import ImageKit from "imagekit";

export const imageKit = new ImageKit({
  privateKey: process.env.PRIVATE_KEY!,
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

/* import ImageKit from "imagekit";

// Only initialize if we're on the server side
let imageKit: ImageKit | null = null;

if (typeof window === "undefined") {
  imageKit = new ImageKit({
    privateKey: process.env.PRIVATE_KEY!,
    publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
  });
}

export { imageKit };
 */
