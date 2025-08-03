/* eslint-disable no-unused-vars */
import Image from "next/image";
import React from "react";

type Setting = {
  type: "original" | "wide" | "square";
  sensitive: boolean;
};

type props = {
  src: string;
  settings: Setting;
  onClose: () => void;
  setSettings: (settings: Setting) => void;
};
const ImageEditor = ({ src, onClose, settings, setSettings }: props) => {
  const handleSensitive = (sensitive: boolean) => {
    setSettings({ ...settings, sensitive });
  };

  const handleTypeChange = (type: "original" | "wide" | "square") => {
    setSettings({ ...settings, type });
  };
  return (
    <div
      className="fixed z-10 flex items-center justify-center w-dvw h-dvh 
        top-0 left-0 bg-black bg-opacity-75 sm:w-full"
    >
      <div className="bg-textGray rounded-xl p-8 flex flex-col gap-4">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            onClick={onClose}
            className="cursor-pointer"
          >
            <path
              fill="white"
              d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"
            />
          </svg>
          <button
            className="py-2 px-4 bg-white text-black rounded-full font-bold"
            onClick={onClose}
          >
            Save
          </button>
        </div>
        {/* IMAGE CONTAINER */}
        <div
          className={`flex items-center justify-center relative w-[600px] h-[500px]`}
        >
          <Image
            src={src}
            alt=""
            height={500}
            width={500}
            className={`rounded-xl ${
              settings.type === "square"
                ? "aspect-square object-cover"
                : settings.type === "original"
                ? "h-[300px]"
                : "h-[250px]"
            }`}
          />
        </div>
        {/* IMAGE ACTIONS */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-8">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleTypeChange("original")}
            >
              <svg width={24} viewBox="0 0 24 24">
                <path
                  className={`${
                    settings.type === "original"
                      ? "fill-iconBlue"
                      : "fill-white"
                  }`}
                  d="M3 7.5C3 6.119 4.119 5 5.5 5h13C19.881 5 21 6.119 21 7.5v9c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 19 3 17.881 3 16.5v-9zM5.5 7c-.276 0-.5.224-.5.5v9c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-9c0-.276-.224-.5-.5-.5h-13z"
                />
              </svg>
              Original
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleTypeChange("wide")}
            >
              <svg width={24} viewBox="0 0 24 24">
                <path
                  className={`${
                    settings.type === "wide" ? "fill-iconBlue" : "fill-white"
                  }`}
                  d="M3 9.5C3 8.119 4.119 7 5.5 7h13C19.881 7 21 8.119 21 9.5v5c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 17 3 15.881 3 14.5v-5zM5.5 9c-.276 0-.5.224-.5.5v5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-5c0-.276-.224-.5-.5-.5h-13z"
                />
              </svg>
              Wide
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleTypeChange("square")}
            >
              <svg width={24} viewBox="0 0 24 24">
                <path
                  className={`${
                    settings.type === "square" ? "fill-iconBlue" : "fill-white"
                  }`}
                  d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v13c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-13c0-.276-.224-.5-.5-.5h-13z"
                />
              </svg>
              Square
            </div>
          </div>
          <div
            className={`py-1 px-4 cursor-pointer rounded-full text-black  ${
              settings.sensitive ? "bg-red-500" : "bg-white"
            }`}
            onClick={() => handleSensitive(!settings.sensitive)}
          >
            Sensitive
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
