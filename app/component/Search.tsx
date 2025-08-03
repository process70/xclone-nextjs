import React from "react";
import Image from "./Image";

const Search = () => {
  return (
    <div className="flex items-center gap-4 py-2 px-4 bg-inputGray rounded-full">
      <Image src="icons/explore.svg" w={16} h={16} alt="" />
      <input
        type="text"
        placeholder="Search"
        className="bg-transparent outline-none 
      placeholder:text-textGray"
      />
    </div>
  );
};

export default Search;
