module.exports = class User {
	constructor(socket) {
		{
			this.id = socket.id
			this.name = "User"
			this.socket = socket
			this.room = null
		}
	}

	joinRoom(room) {
		this.room = room
	}

	leaveRoom() {
		this.room = null
	}
}
