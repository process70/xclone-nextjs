import React from "react";
import Image from "./Image";

const PostInfo = () => {
  return (
    <div className="p-1 cursor-pointer w-6 h-6 hover:bg-slate-400/35 hover:rounded-full transition-all">
      <Image
        src="icons/infoMore.svg"
        alt="post info"
        w={16}
        h={16}
        className="w-full h-full"
      />
    </div>
  );
};

export default PostInfo;
