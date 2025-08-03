"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "./lib/prisma";
import z, { json } from "zod";
import { revalidatePath } from "next/cache";
import { imageKit } from "./utils";
import { UploadResponse } from "@imagekit/next";
import { socket } from "./app/socket";

export const likePost = async (postId: string) => {
  console.log({ postId });
  const { userId } = await auth();
  if (!userId) return;
  const isLiked = await prisma.like.findFirst({
    where: {
      userId,
      postId,
    },
  });
  console.log({ isLiked: !!isLiked });
  if (isLiked) {
    // dislike the post
    try {
      await prisma.like.delete({
        where: {
          id: isLiked.id,
        },
      });
      console.log(`the user ${userId} has disliked the post ${postId}`);
    } catch (error) {
      console.log("error occured while disliking the post", error);
    }
  }
  // like the post
  else {
    try {
      const like = await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      console.log(`the user ${userId} has liked the post ${postId}`);
    } catch (error) {
      console.log("error occured while liking the post", error);
    }
  }
};

export const rePost = async (postId: string) => {
  const { userId } = await auth();
  if (!userId) return;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      reposts: true,
    },
  });
  console.log("post repostId", !!post?.repostId);
  const isReposted = await prisma.post.findFirst({
    where: {
      repostId: postId,
      userId,
    },
  });
  if (!post) return;

  if (!isReposted) {
    // create a new post
    try {
      await prisma.post.create({
        data: {
          title: post.title,
          description: post.description,
          image: post.image ?? "",
          isSensitive: post.isSensitive,
          userId,
          video: post.video ?? "",
          repostId: postId,
        },
      });
      console.log(`the user ${userId} has reposted ${postId}`);
    } catch (error) {
      console.log("error occured while reposting the post " + postId, error);
    }
    // already reposted
  } else {
    try {
      await prisma.post.delete({
        where: { id: isReposted.id, userId },
      });
      console.log(`the user ${userId} has undo reposted ${postId}`);
    } catch (error) {
      console.log(
        "error occured while undo reposting the post " + postId,
        error
      );
    }
  }
};

export const savePost = async (postId: string) => {
  console.log({ postId });
  const { userId } = await auth();
  if (!userId) return;
  const isSaved = await prisma.save.findFirst({
    where: {
      userId,
      postId,
    },
  });
  console.log({ isLiked: !!isSaved });
  if (isSaved) {
    // dislike the post
    try {
      await prisma.save.delete({
        where: {
          id: isSaved.id,
        },
      });
      console.log(`the user ${userId} has undo save the post ${postId}`);
    } catch (error) {
      console.log("error occured while undo saving the post", error);
    }
  }
  // like the post
  else {
    try {
      await prisma.save.create({
        data: {
          userId,
          postId,
        },
      });
      console.log(`the user ${userId} has save the post ${postId}`);
    } catch (error) {
      console.log("error occured while saving the post", error);
    }
  }
};

export const addComment = async (
  state: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = await auth();
  if (!userId)
    return {
      success: false,
      error: true,
    };
  const desc = formData.get("desc");
  const postId = formData.get("postId");
  const username = formData.get("username");

  const comment = z.object({
    parentPostId: z.string(),
    desc: z.string().max(140),
  });

  // validate input fields using comment zod
  const validateFilds = comment.safeParse({
    parentPostId: postId,
    desc,
  });
  if (!validateFilds.success) {
    // log the error for each field
    return {
      success: false,
      error: true,
    };
  }
  try {
    await prisma.post.create({
      data: {
        userId,
        parentPostId: validateFilds.data?.parentPostId,
        description: validateFilds.data?.desc,
        title: "",
      },
    });
    console.log(
      `${username} have successfully add comment on the post: ${postId}`
    );
    revalidatePath(`/${username}/status/${postId}`);
    return {
      success: true,
      error: false,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
    };
  }
};

export const addPost = async (
  state: { success: boolean; error: boolean },
  formData: FormData
) => {
  const { userId } = await auth();
  if (!userId)
    return {
      success: false,
      error: true,
    };

  const file = formData.get("file") as File;
  const desc = formData.get("desc");
  const imageType = formData.get("imageType");
  const isSensitive = formData.get("isSensitive") as string;

  const upload = async (file: File): Promise<UploadResponse> => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
      const transformation = `w-600,${
        imageType === "square"
          ? "ar-1-1"
          : imageType === "wide"
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
        },
        (err, res) => {
          if (err) reject(err);
          else resolve(res as UploadResponse);
        }
      );
    });
  };
  let imageUrl = "";

  if (file.size) {
    const result: UploadResponse = await upload(file);
    imageUrl = result.filePath ?? "";
  }

  try {
    console.log({ imageUrl });
    await prisma.post.create({
      data: {
        userId,
        title: "",
        description: desc?.toString() ?? "",
        isSensitive: JSON.parse(isSensitive),
        image: imageUrl,
      },
    });
    console.log(`${userId} have successfully add post`);
    revalidatePath(`/`);
    return {
      success: true,
      error: false,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
    };
  }
};

export const followUnfollowUser = async (otherUser: string) => {
  const { userId } = await auth();

  if (!userId || !otherUser)
    return {
      success: false,
      error: true,
    };
  const user = await prisma.user.findUnique({
    where: {
      id: otherUser as string,
    },
  });

  try {
    // test if we've already follow the user
    const follow = await prisma.follow.findFirst({
      where: {
        followerId: userId,
        followingId: otherUser as string,
      },
    });

    if (follow) {
      // unfollow the user
      await prisma.follow.delete({
        where: {
          id: follow.id,
        },
      });
      console.log(`you have successfully unfollow the user ${otherUser}`);
    } else {
      await prisma.follow.create({
        data: {
          followerId: userId,
          followingId: otherUser as string,
        },
      });
      console.log(`you have successfully follow the user ${otherUser}`);
    }
    revalidatePath(`/${user?.username}`);
    return {
      success: true,
      error: false,
    };
  } catch (error) {
    console.log("something went wrong", error);
    return {
      success: false,
      error: true,
    };
  }
};
