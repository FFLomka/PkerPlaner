const Room = require("./classes/Room")
const User = require("./classes/User")

const io = require("socket.io")({
	cors: {
		origin: "*",
	},
})

const rooms = new Map()
const users = new Map()

function addRoom(name, id) {
	const room = new Room(name, id || uuidv4())
	rooms.set(room.id, room)
	return room
}

addRoom("Testing room", "test")
addRoom("Super puper secret room, you is hacker", "secret")

io.on("connection", (socket) => {
	console.log("DRAWQQ", socket.id)
	const user = new User(socket)
	users.set(socket.id, user)

	socket.on("joinRoom", (data) => {
		try {
			if (rooms.has(data.id)) {
				user.joinRoom(rooms.get(data.id))
				user.room.join(user)
				socket.emit("updateRoom", user.room.toSend())
			} else {
				user.joinRoom(addRoom("Speshial room for " + user.name, data.id))
				user.room.join(user)
				socket.emit("updateRoom", user.room.toSend())
			}
		} catch (error) {}
	})
	socket.on("resetRoom", () => {
		try {
			user.room.reset()
		} catch (error) {}
	})
	socket.on("showRoom", () => {
		try {
			user.room.show()
		} catch (error) {}
	})

	socket.on("setNickname", (data) => {
		try {
			user.name = data.nickname
			user.room.sendDesk()
		} catch (error) {}
	})

	socket.on("click_card", (data) => {
		try {
			user.room.pick(user, data.value)
		} catch (error) {}
	})

	socket.on("disconnect", () => {
		try {
			user.room.leave(user)
		} catch (error) {}
		users.delete(socket.id)
	})
})

io.listen(3001)
