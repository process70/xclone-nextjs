"use client";
import React, { useActionState, useEffect } from "react";
import Post from "./Post";
import Image from "./Image";
import { Like, Post as PostType, Save, User } from "@prisma/client";
import { notFound } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { addComment } from "@/actions";
import { socket } from "../socket";

type PostWithUser = PostType & {
  User: User;
  _count: {
    comments: number;
    likes: number;
    reposts: number;
  };
  likes: Like[];
  reposts: PostType[];
  saves: Save[];
};

const Comment = ({
  comments,
  postId,
  username,
}: {
  comments: PostWithUser[];
  postId: string;
  username: string;
}) => {
  // we are on the client component that's why we don't use auth()
  const { isLoaded, isSignedIn, user: currentUser } = useUser();

  //It helps manage the state of asynchronous actions, particularly form submissions and server-side operations.
  const [state, formAction, isPending] = useActionState(addComment, {
    success: false,
    error: false,
  });

  useEffect(() => {
    if (state.success) {
      socket.emit("sendNotification", {
        receiverUsername: username,
        data: {
          senderUsername: currentUser?.username,
          type: "comment",
          link: `/${username}/status/${postId}`,
        },
      });
    }
  }, [currentUser?.username, postId, state.success, username]);
  // ✅ Wait for Clerk to finish loading before making decisions
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-textGray">Loading...</div>
      </div>
    );
  }
  // ✅ Only call notFound after we know the loading is complete
  if (!isSignedIn || !currentUser) {
    return notFound();
  }

  return (
    <div>
      {currentUser && (
        <form
          action={formAction}
          className="flex gap-2 justify-between items-center p-4 border-b-[1px] border-b-textGray"
        >
          <div className="overflow-hidden rounded-full w-10 h-10">
            <Image
              src={currentUser?.imageUrl || "general/avatar.png"}
              alt="avatar"
              w={100}
              h={100}
              className="w-full h-full"
            />
          </div>
          {/* we need to append the postId as we use formData */}
          <input type="text" name="postId" value={postId} readOnly hidden />
          {/* we need to pass username in rder to revalidate the page in actions */}
          <input type="text" name="username" value={username} readOnly hidden />
          <input
            type="text"
            name="desc"
            className="flex-1 outline-none bg-transparent text-lg p-2"
            placeholder="Post your reply"
          />
          <button
            type="submit"
            disabled={isPending}
            className="text-black bg-white rounded-full py-2 px-4 disabled:cursor-not-allowed disabled:bg-slate-200"
          >
            {isPending ? "Replying" : "Reply"}
          </button>
        </form>
      )}
      {state.error && (
        <span className="text-red-600 p-4">Something went wrong</span>
      )}
      {comments.map((comment) => (
        <div className="" key={comment.id}>
          <Post type="comment" post={comment} />
        </div>
      ))}
    </div>
  );
};

export default Comment;
