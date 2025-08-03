import Comment from "@/app/component/Comment";
import Image from "@/app/component/Image";
import Post from "@/app/component/Post";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const PostDetail = async ({
  params,
}: {
  params: Promise<{ username: string; postId: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) return;

  const { postId } = await params;

  const getPostDetail = await prisma.post.findUnique({
    where: {
      id: postId,
    },
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
          saves: {
            where: {
              userId,
            },
          },
          reposts: {
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
      comments: {
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
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  if (!getPostDetail) return notFound();
  console.log({ getPostDetail });
  return (
    <div className="">
      <div
        className="p-2 flex items-center justify-between sticky top-0 backdrop-blur-md 
         z-10 bg-black bg-opacity-75"
      >
        <div className="flex items-center gap-8">
          <Link href="/">
            <Image src="icons/back.svg" alt="" w={20} h={20} />
          </Link>
          <h1 className="font-bold text-lg">Post</h1>
        </div>
      </div>
      <Post type="status" post={getPostDetail} />
      <Comment
        comments={getPostDetail.comments}
        postId={getPostDetail.id}
        username={getPostDetail.User.username}
      />
    </div>
  );
};

export default PostDetail;
