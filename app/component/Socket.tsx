/* eslint-disable react-hooks/exhaustive-deps */
/* this is necessary for Socket.IO since it requires browser APIs. */
"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useUser } from "@clerk/nextjs";

/* 
The Socket component monitors and displays the WebSocket connection status between 
the client and your server, showing whether it's connected and what transport method is being used. 
*/
export default function Socket() {
  /* Tracks whether the socket is currently connected to the server */
  const [isConnected, setIsConnected] = useState(false);
  /* Shows the current transport method (e.g., "websocket", "polling") 
  Transports are the delivery method (how messages travel) */
  const [transport, setTransport] = useState("N/A");
  /* we are on the client component so we use useUser from clerk */
  const { isLoaded, isSignedIn, user } = useUser();

  // Move all hooks before any conditional logic
  useEffect(() => {
    // Only run the effect if we have a valid user
    if (!isLoaded || !isSignedIn || !user) {
      return;
    }

    const username = user.username;

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      /*  Socket.IO often starts with HTTP long-polling and then upgrades 
      to WebSocket for better performance */
      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });

      socket.emit("newUser", username);
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    /* Events are the language (how client/server talk) */
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [user]); // Include all dependencies

  // Handle loading and error states after all hooks
  if (!isLoaded) {
    console.log("loading user ...");
    return null; // Return null instead of console.log
  }

  if (!isSignedIn || !user) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-textGray">user not found</div>
      </div>
    );
  }

  return <div></div>;
}
