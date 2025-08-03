import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const profileId = searchParams.get("profileId");
  const page = searchParams.get("cursor");
  const LIMIT = 3;

  const { userId } = await auth();
  if (!userId)
    return NextResponse.json("unauthorized, user not authenticated", {
      status: 404,
    });
  /* fetch the current user and following users posts*/
  // 1. Get current user's followed user IDs
  const followingUsers = await prisma.follow.findMany({
    where: { followerId: userId as string },
    select: { followingId: true },
  });

  const followingIds = followingUsers.map((r) => r.followingId);
  const allUserIds = [userId, ...followingIds].filter(
    (id): id is string => !!id
  );

  const whereCondition =
    profileId !== "undefined"
      ? {
          userId: profileId as string, //fetch current user posts only
        }
      : {
          userId: { in: allUserIds },
        };

  const posts = await prisma.post.findMany({
    where: whereCondition,
    include: {
      User: true,
      rePost: {
        include: {
          User: true,
          _count: {
            select: {
              comments: true,
              likes: true,
              reposts: true,
            },
          },
          likes: {
            where: {
              userId,
            },
          },
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
          reposts: true,
        },
      },
      likes: {
        where: {
          userId,
        },
      },
      reposts: {
        where: {
          userId,
        },
      },
      saves: {
        where: {
          userId,
        },
      },
    },
    take: LIMIT,
    skip: Number(page) * 3,
    orderBy: { createdAt: "desc" },
  });
  const totalPosts = await prisma.post.count({ where: whereCondition });
  const hasMore = Number(page) * LIMIT < totalPosts;

  return Response.json({ posts, hasMore });
};
