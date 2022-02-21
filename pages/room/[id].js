import {useRouter} from "next/router"
import {useEffect, useState} from "react"
import {useDispatch} from "react-redux"

import Button from "../../core/components/Button"
import CardPlayer from "../../core/components/CardPlayer"
import Modal from "../../core/components/Modal"
import Pickem from "../../core/components/Pickem"
import socketIo from "../../core/redux/socket.io"
import classes from "../../styles/RoomId.module.scss"

export default function Page() {
	const dispatch = useDispatch()
	const router = useRouter()

	const [desk, setDesk] = useState([])
	const [room, setRoom] = useState({})
	const [modalUser, setModalUser] = useState(false)
	const [nickname, setNickname] = useState("User")

	const setNick = (nick) => {
		try {
			setNickname(nick)
			localStorage.setItem("username", nick)
			dispatch(socketIo.actions.emit({name: "setNickname", nickname: nick}))
		} catch (error) {}
	}

	useEffect(() => {
		const cbData = (value) => {
			setDesk(value)
		}
		const cbUpdate = (value) => {
			setRoom(value)
		}
		setNick(localStorage.getItem("username") || "User")

		dispatch(socketIo.actions.onEvent({name: "dataDesk", cb: cbData}))
		dispatch(socketIo.actions.onEvent({name: "updateRoom", cb: cbUpdate}))

		return () => {
			dispatch(socketIo.actions.offEvent({name: "dataDesk", cb: cbData}))
			dispatch(socketIo.actions.offEvent({name: "updateRoom", cb: cbUpdate}))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		dispatch(socketIo.actions.emit({name: "joinRoom", id: router.query.id}))
	}, [router, dispatch])

	return (
		<div className={classes.root}>
			<header>
				<div>
					<div className={classes.title}>{room.name}</div>
					<div className={classes.voting}>
						Now voting:<span>{room.currIssues}</span>
					</div>
				</div>
				<div className={classes.right}>
					<Button
						onClick={() => {
							setModalUser(true)
						}}
						className={classes.user}
						btnType='text'
					>
						{nickname}
					</Button>
					<Modal
						visible={modalUser}
						onCancle={() => {
							setModalUser(false)
						}}
					>
						<input
							value={nickname}
							onChange={({target}) => {
								setNick(target.value)
							}}
						/>
					</Modal>
					<div style={{color: "#0003"}}>|</div>
					<Button>Invite players</Button>
					<Button>Issues</Button>
				</div>
			</header>
			<main>
				<div className={classes.cards}>
					{desk.map((e, i) => (
						<CardPlayer key={i} type={e.type} value={e.value} name={e.id} />
					))}
				</div>
				{room.status == "hide" && (
					<Button
						onClick={() => {
							dispatch(socketIo.actions.emit({name: "showRoom"}))
						}}
						btnType='primary'
					>
						Reveal cards
					</Button>
				)}
				{room.status == "show" && (
					<Button
						onClick={() => {
							dispatch(socketIo.actions.emit({name: "resetRoom"}))
						}}
						btnType='primary'
					>
						Next game
					</Button>
				)}
			</main>
			<footer>
				<Pickem disable={room.status == "show"} />
			</footer>
		</div>
	)
}
