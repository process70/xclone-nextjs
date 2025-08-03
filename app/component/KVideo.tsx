"use client";
import { buildSrc, Video } from "@imagekit/next";
import { useEffect } from "react";

type props = {
  src: string;
  className?: string;
  maxHeight?: number;
  maxWidth?: number;
  originalWidth?: number;
  originalHeight?: number;
};

export default function KVideo({
  src,
  className,
  maxHeight = 400,
  maxWidth = 600,
  originalWidth,
  originalHeight,
}: props) {
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

  useEffect(() => {
    console.log("video src: ", src);
  }, [src]);

  // Calculate dimensions that maintain aspect ratio
  const calculateDimensions = () => {
    if (!originalWidth || !originalHeight) {
      return { width: maxWidth, height: maxHeight };
    }

    const aspectRatio = originalWidth / originalHeight;

    let newWidth = originalWidth;
    let newHeight = originalHeight;

    // Scale down if video is larger than max dimensions
    if (newWidth > maxWidth || newHeight > maxHeight) {
      if (aspectRatio > maxWidth / maxHeight) {
        // Video is wider relative to max dimensions
        newWidth = maxWidth;
        newHeight = maxWidth / aspectRatio;
      } else {
        // Video is taller relative to max dimensions
        newHeight = maxHeight;
        newWidth = maxHeight * aspectRatio;
      }
    }

    return { width: Math.round(newWidth), height: Math.round(newHeight) };
  };

  const { width, height } = calculateDimensions();

  return (
    <div
      className={`flex justify-center items-center object-contain ${className}`}
    >
      <Video
        urlEndpoint={urlEndpoint}
        src={src}
        controls
        width={width}
        height={height}
      />
    </div>
  );
}
