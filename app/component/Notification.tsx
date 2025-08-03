"use client";
import React, { useEffect, useState } from "react";
import Image from "./Image";
import { socket } from "../socket";
import { useRouter } from "next/navigation";

type NotificationType = {
  id: string;
  senderUsername: string;
  link: string;
  type: "comment" | "like" | "repost" | "follow";
};

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    socket.on("getNotification", (data: NotificationType) => {
      // add the data to the previous notifications
      setNotifications((prev) => [...prev, data]);
      console.log({ notifications });
    });
    return () => {
      socket.off("getNotification");
    };
  }, []);

  const reset = () => {
    setNotifications([]);
    setOpen(false);
  };

  const handleNotification = (n: NotificationType) => {
    // delete from the list of notifications
    setNotifications((prev) => prev.filter((p) => p.id !== n.id));
    setOpen(false);
    router.push(n.link);
  };

  return (
    <div className="relative">
      <div
        className="cursor-pointer p-[6px] hover:bg-[#181818] rounded-full flex items-center gap-2"
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      >
        <div className="relative">
          <Image src={`icons/notification.svg`} alt="" w={24} h={24} />
          {notifications.length > 0 && (
            <div
              className="absolute -right-3 -top-4 w-6 h-6 text-sm bg-blue-500 p-1 rounded-full
            flex items-center justify-center"
            >
              {notifications.length}
            </div>
          )}
        </div>
        <span className="hidden lg:inline p-[5px] text-textGrayLight">
          Notifications
        </span>
      </div>
      {open && (
        <div
          className="absolute -right-full p-4 bg-white rounded-lg text-black flex flex-col 
            gap-4 items-start"
          style={{ zIndex: 9999 }}
        >
          <h1 className="text-textGray text-xl">Notifications</h1>
          {notifications.map((n) => (
            <div
              className="cursor-pointer"
              key={n.id}
              onClick={() => handleNotification(n)}
            >
              <b>{n.senderUsername}</b>{" "}
              {n.type === "like"
                ? "liked your post"
                : n.type === "repost"
                ? "reposted your post"
                : n.type === "comment"
                ? "replied your post"
                : "followed you"}
            </div>
          ))}
          <button
            className="p-2 rounded-lg text-white bg-black text-center"
            onClick={reset}
          >
            Mark as Read
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;
