import React from "react";
import Search from "./Search";
import PopularTags from "./PopularTags";
import Recommendations from "./Recommendations";
import Link from "next/link";

const RightBar = () => {
  return (
    /* The parent div with h-dvh (height: 100dvh) creates a fixed height container, 
    but sticky positioning needs a scrollable container to work properly. */
    <div className="pt-4 flex flex-col gap-4 sticky top-0 h-max">
      <Search />
      <PopularTags />
      <Recommendations />
      <div className="flex flex-wrap gap-x-3 text-sm text-textGray">
        <Link href="/" className="">
          Terms of Service
        </Link>
        <Link href="/" className="">
          Privacy Policy
        </Link>
        <Link href="/" className="">
          Cookie Policy
        </Link>
        <Link href="/" className="">
          Accessiblity
        </Link>
        <Link href="/" className="">
          Ads info
        </Link>
        <Link href="/" className="">
          More ...
        </Link>
        <span className="">@ 2024 X Corp.</span>
      </div>
    </div>
  );
};

export default RightBar;
