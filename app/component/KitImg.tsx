"use client"; // This component must be a client component
import { Image, buildSrc } from "@imagekit/next";
import { useState } from "react";

type Props = {
  src: string;
  alt?: string;
  w?: number;
  h?: number;
  className?: string;
  onClick?: () => void;
  // New prop to enable LQIP for dynamically fetched images
  enableLQIP?: boolean;
};

export default function KitImg({
  src,
  alt = "",
  w = 100,
  h = 100,
  className,
  onClick,
}: Props) {
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;

  return (
    <div className={`overflow-hidden ${className}`} onClick={onClick}>
      <Image
        urlEndpoint={urlEndpoint}
        src={src}
        alt={alt}
        width={w}
        height={h}
        loading="lazy"
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
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }
            : {}
        }
        onLoad={() => {
          setShowPlaceholder(false);
        }}
      />
    </div>
  );
}
