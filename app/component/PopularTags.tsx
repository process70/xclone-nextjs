import React from "react";
import Image from "./Image";
import Link from "next/link";
// import Image from "next/image";

const PopularTags = () => {
  return (
    <div className="p-4 rounded-xl border-[1px] border-borderGray flex flex-col gap-4">
      <h1 className="text-xl font-bold text-textGrayLight">
        {"What's"} Happening
      </h1>
      {/* TREND EVENTS */}
      <div className="flex gap-4">
        <Image
          src="general/Messi"
          alt=""
          w={1600}
          h={800}
          className="rounded-xl w-20 h-16"
        />
        <div className="flex-1">
          <h2 className="font-bold">Messi Barcelona</h2>
          <span className="text-sm text-textGray">Champions League Match</span>
        </div>
      </div>
      {/* TOPICS */}
      <div className="">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm text-textGray">
            Technology . Trending
          </span>
          <Image src="icons/infoMore.svg" alt="" w={16} h={16} className="" />
        </div>
        <h2 className="font-bold text-textGrayLight">OpenAI</h2>
        <span className="text-sm text-textGray">20K posts</span>
      </div>
      <div className="">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm text-textGray">
            Sports . Trending
          </span>
          <Image src="icons/infoMore.svg" alt="" w={16} h={16} className="" />
        </div>
        <h2 className="font-bold text-textGrayLight">Arsenal</h2>
        <span className="text-sm text-textGray">200K posts</span>
      </div>
      <div className="">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm text-textGray">
            Trending in Algeria
          </span>
          <Image src="icons/infoMore.svg" alt="" w={16} h={16} className="" />
        </div>
        <h2 className="font-bold text-textGrayLight" dir="rtl">
          عيد الإستقلال
        </h2>
        <span className="text-sm text-textGray">8650 posts</span>
      </div>
      <div className="">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm text-textGray">Trending</span>
          <Image src="icons/infoMore.svg" alt="" w={16} h={16} className="" />
        </div>
        <h2 className="font-bold text-textGrayLight">Russia</h2>
        <span className="text-sm text-textGray">1.9K posts</span>
      </div>
      <Link href="/" className="p-3 text-iconBlue hover:bg-zinc-950 w-full">
        Show More
      </Link>
    </div>
  );
};

export default PopularTags;
