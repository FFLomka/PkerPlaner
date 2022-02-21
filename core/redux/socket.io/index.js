import {createSlice} from "@reduxjs/toolkit"
import io from "socket.io-client"

export default createSlice({
	name: "socket",
	initialState: {
		socket: io(process.env.NEXT_PUBLIC_WSS_URL, {
			reconnectionDelay: 25000,
			reconnectionDelayMax: 10000,
		}),
	},
	reducers: {
		emit: (state, {payload}) => {
			state.socket.emit(payload.name || "default", payload)
		},
		onEvent: (state, {payload}) => {
			if (typeof payload == "object") state.socket.on(payload.name, payload.cb)
		},
		offEvent: (state, {payload}) => {
			if (typeof payload == "object") state.socket.off(payload.name, payload.cb)
		},
	},
})
