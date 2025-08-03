"use client";
import { likePost, rePost, savePost } from "@/actions";
import React, { useEffect, useOptimistic, useState } from "react";
import { socket } from "../socket";
import { useUser } from "@clerk/nextjs";

const PostInteractions = ({
  // this username is crucial for sending events using socket io
  username,
  likes,
  comments,
  reposts,
  isliked,
  isReposted,
  isSaved,
  postId,
}: {
  username: string;
  likes: number;
  comments: number;
  reposts: number;
  isliked: boolean;
  isReposted: boolean;
  isSaved: boolean;
  postId: string;
}) => {
  const [state, setState] = useState({
    isLiked: isliked,
    isReposted: isReposted,
    isSaved: isSaved,
    reposts: reposts,
    likes: likes,
  });
  /* useOptimistic is a React hook introduced in React 19 that allows you to show optimistic 
    updates in your UI while an async action is pending. */
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    (prev, type: "repost" | "like" | "save") => {
      if (type === "like") {
        return {
          ...prev,
          likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
          isLiked: !prev.isLiked,
        };
      }
      if (type === "repost") {
        return {
          ...prev,
          reposts: prev.isReposted ? prev.reposts - 1 : prev.reposts + 1,
          isReposted: !prev.isReposted,
        };
      }
      if (type === "save") {
        return {
          ...prev,
          isSaved: !prev.isSaved,
        };
      }
      // if there is no type (like comment)
      return prev;
    }
  );
  /* we are on the client component so we use useUser from clerk */
  const { isLoaded, isSignedIn, user } = useUser();

  // Debug socket connection
  /*   useEffect(() => {
    console.log("🔌 Socket connected:", socket.connected);
    console.log("🔌 Socket ID:", socket.id);

    const onConnect = () => console.log("✅ Socket connected!");
    const onDisconnect = () => console.log("❌ Socket disconnected!");

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []); */

  // Move all hooks before any conditional logic
  // Only run the effect if we have a valid user
  if (!isLoaded || !isSignedIn || !user) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-textGray">Loading...</div>
      </div>
    );
  }

  const likeAction = async () => {
    if (!optimisticState.isLiked) {
      console.log("original post username: " + username);
      console.log("the user who liked the post: " + user.username);
      socket.emit("sendNotification", {
        receiverUsername: username,
        data: {
          senderUsername: user.username,
          type: "like",
          link: `/${username}/status/${postId}`,
        },
      });
    }
    // display the changes in UI
    addOptimistic("like");
    // execute like function in backend
    await likePost(postId);
    // set the state
    setState((prev) => {
      return {
        ...prev,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
        isLiked: !prev.isLiked,
      };
    });
  };

  const repostAction = async () => {
    if (!optimisticState.isReposted) {
      socket.emit("sendNotification", {
        receiverUsername: username,
        data: {
          senderUsername: user.username,
          type: "repost",
          link: `/${username}/status/${postId}`,
        },
      });
    }
    // display the changes in UI
    addOptimistic("repost");
    // execute like function in backend
    await rePost(postId);
    // set the state
    setState((prev) => {
      return {
        ...prev,
        reposts: prev.isReposted ? prev.reposts - 1 : prev.reposts + 1,
        isReposted: !prev.isReposted,
      };
    });
  };

  const saveAction = async () => {
    // display the changes in UI
    addOptimistic("save");
    // execute like function in backend
    await savePost(postId);
    // set the state
    setState((prev) => {
      return {
        ...prev,
        isSaved: !prev.isSaved,
      };
    });
  };
  return (
    <div className="flex items-center justify-between my-2 gap-4 lg:gap-16 text-textGray ">
      {/* The group class allows you to style child elements based on the 
        parent element's state (like hover, focus, etc.). */}
      <div className="flex flex-1 items-center justify-between b">
        <div className="group flex gap-[2px] cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
            className="text-textGray group-hover:text-iconBlue"
          >
            <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />
          </svg>
          <p className="group-hover:text-iconBlue text-sm">{comments}</p>
        </div>

        <form action={repostAction}>
          <button className="group flex gap-[2px] cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
              className={`${
                optimisticState.isReposted ? "fill-textGreen" : "fill-textGray"
              } group-hover:text-textGreen`}
            >
              <path d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z" />
            </svg>
            <p
              className={`${
                optimisticState.isReposted ? "text-textGreen" : "text-textGray"
              } group-hover:text-textGreen text-sm`}
            >
              {optimisticState.reposts}
            </p>
          </button>
        </form>

        <form action={likeAction}>
          <button className="group flex gap-[2px] cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
              className={`${
                optimisticState.isLiked ? "fill-textPink" : "text-textGray"
              } group-hover:fill-textPink`}
            >
              <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z" />
            </svg>
            <p
              className={`${
                optimisticState.isLiked ? "text-textPink" : "text-textGray"
              } group-hover:text-textPink text-sm`}
            >
              {optimisticState.likes}
            </p>
          </button>
        </form>

        <div className="group flex gap-[2px] cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
            className="text-textGray group-hover:text-iconBlue"
          >
            <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path>
          </svg>
          <p className="group-hover:text-iconBlue text-sm">5.9K</p>
        </div>
      </div>
      <form action={saveAction}>
        <button className="flex items-center gap-2">
          <div className="group cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
              className={`${
                optimisticState.isSaved ? "fill-blue-600" : "fill-textGray"
              } group-hover:fill-blue-600 text-sm`}
            >
              <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z" />
            </svg>
          </div>
          <div className="group cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
              className="text-textGray group-hover:text-iconBlue"
            >
              <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" />
            </svg>
          </div>
        </button>
      </form>
    </div>
  );
};

export default PostInteractions;
