import Link from "next/link";
import React from "react";
import Image from "./Image";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import FollowButton from "./FollowButton";

// in this component we are going to the following of our following users
const Recommendations = async () => {
  const { userId } = await auth();
  if (!userId) return;

  // get the following users
  const followingUser = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
  });
  // extract theirs ids
  const followingUserIds = followingUser.map((u) => u.followingId);

  /* 
    a follow t follow d
    a follow i follow r
    a follow p follow z

    User 'a'
    followerUsers: []  // No one follows 'a'
    followingUsers: [
      { id: "uuid1", followerId: "a", followingId: "t" },
      { id: "uuid3", followerId: "a", followingId: "i" },
      { id: "uuid5", followerId: "a", followingId: "p" }

      
      User 'd':
      followerUsers: [
        { id: "uuid2", followerId: "t", followingId: "d" }
        ]
        followingUsers: []  // 'd' doesn't follow anyone
        
      User 't':
      followerUsers: [
        { id: "uuid1", followerId: "a", followingId: "t" }
      ]
      followingUsers: [
        { id: "uuid2", followerId: "t", followingId: "d" }
      ]

    User 'i':
    followerUsers: [
      { id: "uuid3", followerId: "a", followingId: "i" }
    ]
    followingUsers: [
      { id: "uuid4", followerId: "i", followingId: "r" }
    ]    

    User 'r':
    followerUsers: [
      { id: "uuid4", followerId: "i", followingId: "r" }
    ]
    followingUsers: []  // 'r' doesn't follow anyone

    User 'p':
    followerUsers: [
      { id: "uuid5", followerId: "a", followingId: "p" }
    ]
    followingUsers: [
      { id: "uuid6", followerId: "p", followingId: "z" }
    ]

    User 'z':
    followerUsers: [
      { id: "uuid6", followerId: "p", followingId: "z" }
    ]
    followingUsers: []  // 'z' doesn't follow anyone
]
 */
  const recommendations = await prisma.follow.findMany({
    where: {
      // the user we are following are follower of other users that we search for
      followerId: {
        in: followingUserIds,
      },
      followingId: {
        // ensure that the users we search for are not follower of the users we are following,
        notIn: followingUserIds,
      },
    },
    include: {
      // include the list of following to search them later in User model
      follwings: true,
    },
  });

  const friendUsers = recommendations.map((r) => r.follwings);

  return (
    <div className="p-4 rounded-xl border-[1px] border-borderGray flex flex-col gap-4">
      {friendUsers.map((user) => (
        <div className="flex items-center justify-between" key={user.id}>
          <div className="flex gap-2 items-center">
            {/* USER IMAGE */}
            <div className="relative rounded-full w-10 h-10 overflow-hidden">
              <Image
                src={`${user.avatar ? user.avatar : "general/avatar.png"}`}
                alt=""
                w={160}
                h={160}
                className="w-full h-full"
              />
            </div>
            {/* USER INFO */}
            <div className="flex flex-col items-center">
              <h1 className="text-md font-bold">{user.displayName}</h1>
              <span className="text-md text-textGray">@{user.username}</span>
            </div>
          </div>
          <FollowButton userId={userId} isFollow={false} />
        </div>
      ))}

      <Link
        href="/"
        className="p-3 text-iconBlue hover:bg-zinc-950 w-full rounded-2xl"
      >
        Show More
      </Link>
    </div>
  );
};

export default Recommendations;
