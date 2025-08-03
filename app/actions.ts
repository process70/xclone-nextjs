"use server";

import { imageKit } from "@/utils";

type Setting = {
  type: "original" | "wide" | "square";
  sensitive: boolean;
};
export const mediaFile = async (formData: FormData, settings: Setting) => {
  const file = formData.get("file") as File;
  const desc = formData.get("desc") as string;
  console.log({ formData, settings });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const transformation = `w-600,${
    settings.type === "square"
      ? "ar-1-1"
      : settings.type === "wide"
      ? "ar-16-7"
      : ""
  }`;

  imageKit.upload(
    {
      file: buffer,
      fileName: file.name,
      folder: "/posts",

      transformation: {
        pre: transformation,
      },
      customMetadata: {
        sensitive: settings.sensitive,
      },
    },
    (err, res) => {
      if (err) console.log(err);
      if (res) console.log(res);
    }
  );
};
