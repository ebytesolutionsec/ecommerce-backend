let io

module.exports = {
    init : (server) => {
        io = require("socket.io")(server, {
            cors: { origin: "*"}
        })

        io.on('connection', (socket) => {
            console.log("Cliente conectado:", socket.id)
        })

        return io
    },

    getIO: () => {
        if(!io){
            throw new Error("Socket.io no inicializado")
        }

        return io
    }
}