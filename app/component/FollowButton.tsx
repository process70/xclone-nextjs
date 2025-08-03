"use client";
import { followUnfollowUser } from "@/actions";
import React, {
  useActionState,
  useEffect,
  useOptimistic,
  useState,
} from "react";
import { socket } from "../socket";
import { useUser } from "@clerk/nextjs";

const FollowButton = ({
  userId,
  isFollow,
  otherUser,
  otherUsername,
}: {
  userId: string;
  otherUser?: string;
  otherUsername?: string;
  isFollow: boolean;
}) => {
  const [state, setState] = useState(isFollow);

  const [optimisticFollow, switchOptimisticFollow] = useOptimistic(
    state,
    (prev) => !prev
  );

  const { isLoaded, isSignedIn, user } = useUser();

  /*   useEffect(() => {
    console.log("the user who follow: " + user?.username);
    console.log("the user been followed: " + otherUsername);
    socket.emit("sendNotification", {
      receiverUsername: otherUsername,
      data: {
        // the authenticated user who follow
        senderUsername: user?.username,
        type: "follow",
        link: `/${user?.username}`,
      },
    });
  }, [user?.username, state.success, otherUsername]); */

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-textGray">Loading...</div>
      </div>
    );
  }

  const followAction = async () => {
    console.log("the user who follow: " + user?.username);
    if (otherUsername) console.log("the user been followed: " + otherUsername);
    switchOptimisticFollow("");
    await followUnfollowUser(otherUser!);
    setState((prev) => !prev);
    socket.emit("sendNotification", {
      receiverUsername: otherUsername!,
      data: {
        senderUsername: user?.username,
        type: "follow",
        link: `/${user?.username}`,
      },
    });
  };

  return (
    <form action={followAction}>
      {/* we need to append the postId as we use formData */}
      <input type="text" name="otherUser" value={otherUser} readOnly hidden />
      <button
        className="px-4 py-2 text-black bg-white rounded-full font-bold 
        disabled:cursor-not-allowed"
      >
        {isFollow ? "Following" : "Follow"}
      </button>
    </form>
  );
};

export default FollowButton;
