import React from "react";
import Post from "./Post";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import InfiniteFeed from "./InfiniteFeed";

const Feed = async ({ profileId }: { profileId?: string }) => {
  const { userId } = await auth();
  if (!userId) return;

  /* fetch the current user and following users posts*/
  // 1. Get current user's followed user IDs
  const followingUsers = await prisma.follow.findMany({
    where: { followerId: userId as string },
    select: { followingId: true },
  });

  const followingIds = followingUsers.map((r) => r.followingId);
  const allUserIds = [userId, ...followingIds].filter((id: string) => !!id);

  const whereCondition = profileId
    ? {
        userId: profileId,
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
          // we add this field to check whether the current user have likes the post
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
      },
      // include the total number of
      _count: {
        select: {
          comments: true,
          likes: true,
          reposts: true,
        },
      },
      // we add this field to check whether the current user have likes the post
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
    take: 3,
    skip: 0,
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="">
      {posts.map((post) => (
        <div key={post.id}>
          <Post post={post} />
        </div>
      ))}
      <InfiniteFeed profileId={profileId} />
    </div>
  );
};

export default Feed;
