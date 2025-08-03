/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "@/app/component/Image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

const ModalPage = () => {
  const router = useRouter();

  const [media, setMedia] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const closeModal = () => {
    router.back();
  };

  const handleMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setMedia(e.target.files[0]);
  };

  return (
    <div
      className="w-full h-fit absolute top-0 left-0 bg-black/80 flex justify-center z-10 
      bg-[#05081c]"
    >
      <div className="px-8 py-4 bg-black rounded-xl w-[600px] mt-12">
        {/* TOP SECTION */}
        <div className="flex justify-between">
          <div
            className="rounded-full text-white  py-1 px-[10px] self-center hover:bg-gray-800 
            transition-colors  cursor-pointer"
            onClick={closeModal}
          >
            ✖
          </div>
          <div
            className="text-iconBlue cursor-pointer py-2 px-4 hover:bg-indigo-100 font-bold
            rounded-full transition-all"
          >
            Drafts
          </div>
        </div>
        {/* BODY SECTION */}
        <div className="py-8 flex gap-4">
          <Image
            src="general/avatar.png"
            alt="avatar"
            w={100}
            h={100}
            className="rounded-full overflow-hidden w-10 h-10"
          />
          <input
            type="text"
            className="flex-1 outline-none bg-transparent text-lg"
            placeholder="What's happening?"
          />
        </div>
        {/* BOTTOM SECTION */}
        <div
          className="flex items-center justify-between gap-4 flex-wrap border-t-[1px] 
          border-textGray pt-4"
        >
          <div className="flex gap-3">
            <input
              type="file"
              name="file"
              ref={fileInputRef}
              placeholder="upload a file"
              onChange={handleMedia}
              className="hidden"
              id="file"
              accept="image/*, video/*"
            />
            <label htmlFor="file">
              <Image
                src="icons/image.svg"
                w={20}
                h={20}
                className="cursor-pointer"
                alt=""
              />
            </label>
            {/* Upload progress: <progress value={progress} max={100}></progress> */}
            <Image
              src="icons/gif.svg"
              alt=""
              w={20}
              h={20}
              className="cursor-pointer"
            />
            <Image
              src="icons/poll.svg"
              alt=""
              w={20}
              h={20}
              className="cursor-pointer"
            />
            <Image
              src="icons/emoji.svg"
              alt=""
              w={20}
              h={20}
              className="cursor-pointer"
            />
            <Image
              src="icons/schedule.svg"
              alt=""
              w={20}
              h={20}
              className="cursor-pointer"
            />
            <div className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#3b82f6"
                stroke="none"
              >
                <path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z" />
              </svg>
            </div>
          </div>
          <button
            type="submit"
            className="text-black bg-white rounded-full font-bold py-2 px-4"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPage;
