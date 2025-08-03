import Feed from "@/app/component/Feed";
import FollowButton from "@/app/component/FollowButton";
import Image from "@/app/component/Image";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
/* Promise<{[key: string]: string | undefined}> */
const UserPage = async ({
  params,
}: {
  params: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { userId } = await auth();
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    include: {
      _count: {
        select: {
          Posts: true,
          followingUsers: true,
          followerUsers: true,
        },
      },
      // check if the userId follows username
      // check if the username has the list of the following users that includes the userId
      followingUsers: userId
        ? {
            where: {
              followerId: userId,
            },
          }
        : undefined,
    },
  });
  if (!user) return;
  return (
    <div className="">
      {/* PROFILE TITLE */}
      <div
        className="p-2 flex items-center justify-between sticky top-0 backdrop-blur-md 
         z-10 bg-black bg-opacity-75"
      >
        <div className="flex items-center gap-8">
          <Link href="/">
            <Image src="icons/back.svg" alt="" w={20} h={20} />
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-lg">{user.displayName}</h1>
            <span className="">{user._count.Posts} posts</span>
          </div>
        </div>
      </div>
      {/* INFO */}
      <div className="">
        <div className="relative -z-10">
          {/* aspect[3/1] means the width is 3x heigth */}
          <Image
            src={`${user.cover || "general/cover.jpg"}`}
            alt=""
            w={500}
            h={400}
            className="aspect-[3/1] w-full"
          />
          <Image
            src={`${user.avatar || "general/avatar.png"}`}
            alt=""
            className="w-1/5 aspect-square rounded-full overflow-hidden border-4 border-black 
                bg-slate-100 absolute left-4 -translate-y-1/2"
          />
        </div>
        <div className="flex items-center justify-end gap-2 p-2 w-full">
          <Image
            src="icons/more.svg"
            alt="more"
            w={20}
            h={20}
            className="w-9 h-9 rounded-full cursor-pointer border-[1px] border-borderGray p-[5px]"
          />
          <Image
            src="icons/explore.svg"
            alt="explore"
            w={20}
            h={20}
            className="w-9 h-9 rounded-full cursor-pointer border-[1px] border-borderGray p-[5px]"
          />
          <Image
            src="icons/message.svg"
            alt="message"
            w={20}
            h={20}
            className="w-9 h-9 rounded-full cursor-pointer border-[1px] border-borderGray p-[5px]"
          />
          {userId && userId !== user.id && (
            <FollowButton
              userId={userId}
              otherUser={user.id}
              otherUsername={user.username}
              isFollow={!!user.followingUsers.length}
            />
          )}
        </div>
        {/* USER DETAILS */}
        <div className="p-4 flex flex-col gap-2">
          <div className="">
            <h1 className="font-bold text-2xl">{user.displayName}</h1>
            <span className="text-sm text-textGray">@{user.username}</span>
          </div>
          <p className="">{user.bio}</p>
          {/* JOB & LOCATION & DATE */}
          <div className="mt-4 flex gap-3 text-textGray">
            <div className="flex gap-1 items-center">
              <Image
                src="icons/job.svg"
                alt="job"
                w={16}
                h={16}
                className="w-5 h-5 rounded-full cursor-pointer"
              />
              <span className="text-md">{user.job}</span>
            </div>

            <div className="flex gap-1 items-center">
              <Image
                src="icons/userLocation.svg"
                alt="location"
                w={16}
                h={16}
                className="w-5 h-5 rounded-full cursor-pointer"
              />
              <span className="text-md">{user.location}</span>
            </div>
            <div className="flex gap-1 items-center">
              <Image
                src="icons/chain.svg"
                alt="chain"
                w={16}
                h={16}
                className="w-5 h-5 rounded-full cursor-pointer"
              />
              <span className="text-md">{user.website}</span>
            </div>
          </div>
          {/* DATE */}
          <div className="flex gap-1 items-center text-textGray">
            <Image
              src="icons/date.svg"
              alt="date"
              w={16}
              h={16}
              className="w-5 h-5 rounded-full cursor-pointer"
            />
            <span className="text-md">
              Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </span>
          </div>
          {/* FOLLOWING & FOLLOWERS */}
          <div className="my-3 flex gap-4 items-center text-textGray">
            <Link href="/" className="flex gap-1 items-center">
              <h2 className=" text-white">{user._count.followingUsers}</h2>
              <span className=" text-textGray">Following</span>
            </Link>
            <Link href="/" className="flex gap-1 items-center">
              <h2 className=" text-white">{user._count.followerUsers}</h2>
              <span className=" text-textGray">Followers</span>
            </Link>
          </div>
          <p className="text-md text-textGray">
            Not followed by anyone you’re following
          </p>
        </div>
      </div>
      {/* Feed */}
      <Feed profileId={user.id} />
    </div>
  );
};

export default UserPage;
