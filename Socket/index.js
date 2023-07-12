const io = require("socket.io")(8000, {
    cors: {
        origin:"http://localhost:3000"
    }
})

let users = [];

const addUser = (userId, socketId) => {
    !users.some(user=>user.userId === userId) &&
        users.push({userId, socketId})
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};
  

io.on("connection", (socket) => { 
    console.log("user connected")

    //get id
    socket.on("addUser", userId => {
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    })

    //send msg
    socket.on("sendMessage", ({ receiver, sender, message }) => {
        const user = getUser(receiver);
        io.to(user.socketId).emit("getMessage", {
          sender,
          message,
        });
      });

    //disconnect
    socket.on("disconnect", userId => {
        console.log("user disconnected")
        removeUser(socket.id)
        io.emit("getUsers", users)
    })
})
