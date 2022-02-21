const {v4: uuidv4} = require("uuid")

module.exports = class Room {
	constructor(name, id) {
		{
			this.id = id
			this.player = {}
			this.desk = {}
			this.name = name
			this.issues = []
			this.currIssues = ""
			this.status = "hide"
		}
	}

	show() {
		this.status = "show"
		this.sendRoom()
		this.sendDesk()
	}

	reset() {
		this.status = "hide"
		const deck = {}
		Object.keys(this.desk).map((e) => {
			deck[e] = {
				type: "noPick",
				id: this.desk[e].name,
			}
		})
		this.desk = deck
		this.sendRoom()
		this.sendDesk()
	}

	toSend() {
		const {name, issues, currIssues, status} = this
		return {name, issues, currIssues, status}
	}

	sendRoom() {
		Object.values(this.player).map((e) => {
			e.socket.emit("updateRoom", this.toSend())
		})
	}

	sendDesk() {
		Object.values(this.player).map((e) => {
			e.socket.emit(
				"dataDesk",
				Object.keys(this.desk).map((deck) => ({
					type: (() => {
						if (this.desk[deck].type == "noPick") return "noPick"
						return this.status == "hide" ? "pick" : "show"
					})(),
					...(this.status == "show" ? {value: this.desk[deck].value} : {}),
					id: this.player[deck].name,
				})),
			)
		})
	}

	join(user) {
		this.player[user.id] = user
		this.desk[user.id] = {id: user.name, type: "noPick"}
		this.sendDesk()
	}

	leave(user) {
		delete this.player[user.id]
		delete this.desk[user.id]
		this.sendDesk()
	}

	pick(user, value) {
		if (this.status == "show") return
		this.desk[user.id].value = value
		this.desk[user.id].type = "pick"
		this.sendDesk()
	}
}
