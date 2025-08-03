"use client"; // This component must be a client component
import { Image as KImage, buildSrc } from "@imagekit/next";
import { useEffect, useState } from "react";

type Props = {
  src: string;
  alt?: string;
  w?: number;
  h?: number;
  className?: string;
};
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

export default function Image({
  src,
  alt = "",
  w = 100,
  h = 100,
  className,
}: Props) {
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  /*   useEffect(() => {
    console.log("image src: ", src);
  }, [src]); */

  return (
    <KImage
      urlEndpoint={urlEndpoint}
      src={src}
      alt={alt}
      width={w}
      height={h}
      loading="lazy"
      className={className} // Added object-cover and full sizing
      style={
        showPlaceholder
          ? {
              backgroundImage: `url(${buildSrc({
                urlEndpoint,
                src,
                transformation: [
                  {
                    quality: 10,
                    blur: 90,
                  },
                ],
              })})`,
              backgroundSize: "contain", // Changed from "contain" to "cover"
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center", // Added center positioning
            }
          : {}
      }
      onLoad={() => {
        setShowPlaceholder(false);
      }}
    />
  );
}
