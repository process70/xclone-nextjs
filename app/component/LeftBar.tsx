import React from "react";
import Image from "./Image";
import Link from "next/link";
import Socket from "./Socket";
import Notification from "./Notification";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const LeftBar = async () => {
  const menuList = [
    {
      id: 1,
      name: "Home",
      link: "/",
      icon: "home.svg",
    },
    {
      id: 2,
      name: "Explore",
      link: "/",
      icon: "explore.svg",
    },
    {
      id: 4,
      name: "Messages",
      link: "/",
      icon: "message.svg",
    },
    {
      id: 5,
      name: "Bookmarks",
      link: "/",
      icon: "bookmark.svg",
    },
    {
      id: 6,
      name: "Jobs",
      link: "/",
      icon: "job.svg",
    },
    {
      id: 7,
      name: "Communities",
      link: "/",
      icon: "community.svg",
    },
    {
      id: 8,
      name: "Premium",
      link: "/",
      icon: "x-logo.svg",
    },
    {
      id: 9,
      name: "Profile",
      link: "/",
      icon: "profile.svg",
    },
    {
      id: 10,
      name: "More",
      link: "/",
      icon: "more.svg",
    },
  ];

  const { userId } = await auth();
  const user = await prisma.user.findUnique({
    where: {
      id: userId as string,
    },
  });
  if (!user) return;

  return (
    /* The parent div with h-dvh (height: 100dvh) creates a fixed height container, 
    but sticky positioning needs a scrollable container to work properly. */
    <div className="flex w-full flex-col sticky top-0 pt-2 pb-4 h-dvh">
      <div className="flex flex-col gap-1 text-md text-center xxl:items-start">
        <Link href="/" className="p-1 hover:bg-[#181818] rounded-full">
          <Image src="icons/x-logo.svg" alt="logo" w={24} h={24} />
        </Link>
        <div className="my-2 flex flex-col w-full">
          {menuList.map((item, index) => (
            <div key={item.id || index}>
              {index === 2 && (
                <div key={index}>
                  <Notification />
                </div>
              )}
              <Link
                href={item.link}
                className="p-[6px] hover:bg-[#181818] rounded-full flex items-center gap-2"
              >
                <Image
                  src={`icons/${item.icon}`}
                  alt={item.name}
                  w={24}
                  h={24}
                />
                <span className="hidden lg:inline p-[5px] text-textGrayLight">
                  {item.name}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
      {/* Post Button */}
      <Link
        href="/compose/post"
        className="lg:hidden text-black bg-white rounded-full w-12 h-12 flex items-center 
        justify-center"
      >
        <Image src="icons/post.svg" alt="new post" w={24} h={24} />
      </Link>
      <Link
        href="/compose/post"
        className="hidden lg:block rounded-full text-black bg-textGrayLight 
        font-bold text-center py-3 px-20 text-xl uppercase"
      >
        post
      </Link>
      <Socket />

      <div className="mt-auto mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative rounded-full overflow-hidden">
            {/* fill property will apply when we set the position of its parent */}
            <Image
              src={`${user.avatar || "general/avatar.png"}`}
              alt="avatar"
              w={40}
              h={40}
            />
          </div>
          <div className="hidden lg:flex flex-col cursor-pointer">
            <span className="font-bold">{user.displayName}</span>
            <span className="text-textGray text-sm">@{user.username}</span>
          </div>
        </div>
        <div className="hidden lg:flex font-bold">...</div>
      </div>
    </div>
  );
};

export default LeftBar;
