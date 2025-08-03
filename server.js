import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { v4 } from "uuid";

/* Creates a Next.js app in development mode */
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// list of users connected to the server
let onlineUsers = [];

const addUser = (username, socketId) => {
  // check if the user is already connected
  const isExist = onlineUsers.find((user) => user.socketId === socketId);

  if (!isExist) {
    onlineUsers.push({ username, socketId });
    console.log(username + " added!");
  }
};

// remove the user when he leave the server(close the browser tab, sign out)
const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  console.log("user removed!");
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

app.prepare().then(() => {
  /* Sets up a custom HTTP server */
  const httpServer = createServer(handler);

  /* Initializes Socket.IO on the server */
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    //console.log("connected", socket);
    // add new event when the the connection is established
    // this event is triggered as soon as the component (/username) mounts
    socket.on("newUser", (username) => {
      console.log({ username });
      addUser(username, socket.id);
    });

    /* data contains what type of notification: (like, comment, repost or follow)
    sets up a listener for incoming events named 'sendNotification'
    this is an event handler for events named 'sendNotification'
    {recieverUsername, data} is the event payload */
    socket.on("sendNotification", ({ receiverUsername, data }) => {
      const receiver = getUser(receiverUsername);

      if (receiver) {
        console.log("user recieved", receiver);
        io.to(receiver.socketId).emit("getNotification", {
          id: v4(),
          ...data,
        });
      }
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
