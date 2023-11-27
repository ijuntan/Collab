const app = require('./app');
const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT;

const documentController = require('../src/controllers/documentController')

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some(user=>user.userId === userId) &&
        users.push({userId, socketId})
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId)
};

io.on("connection", (socket) => { 
    console.log("user connected")

    //get id
    socket.on("addUser", userId => {
        addUser(userId, socket.id)
        io.emit("getUsers", users)
    })

    //send msg
    socket.on("sendMessage", ({ receiver, sender, message, time }) => {
        const user = getUser(receiver);
        if(user) {
            io.to(user.socketId).emit("getMessage", {
                sender,
                message,
                time,
              });
        }
      });

    //disconnect
    socket.on("disconnect", () => {
        removeUser(socket.id)
        io.emit("getUsers", users)
    })

    //text editor
    socket.on("get-document", async (documentId) => {
        try {
            //const document = await findOrCreateDocument(documentId)
            const document = await documentController.getDocument(documentId)
            if(document !== null) {
                socket.join(documentId)
                socket.emit("load-document", document.data)
            
                socket.on("send-changes", delta => {
                    socket.broadcast.to(documentId).emit("receive-changes", delta)
                })
            
                socket.on("save-document", async data => {
                    await documentController.updateDocument(documentId, data)
                })
            }
            else socket.broadcast.to(socket.id).emit("Document not found")
            
        } catch(err) {
            socket.broadcast.to(socket.id).emit("Please try again!")
        }
    })
})
