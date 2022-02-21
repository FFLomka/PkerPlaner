import {useEffect, useState} from "react"
import {useDispatch} from "react-redux"

import socketIo from "../../redux/socket.io"
import classes from "./CardPlayer.module.scss"

export default function Pickem({order = [0, 0.5, 1, 2, 3, 4, 5, 8, 13, 17, 24, 36, 99, "?"], disable, ...props}) {
	const dispatch = useDispatch()

	const [activeCard, setActiveCard] = useState()

	useEffect(() => {
		if (disable && activeCard != null) {
			setActiveCard()
		}
	}, [disable, activeCard])

	return (
		<div className={classes.root}>
			{order.map((e, i) => (
				<div
					key={i}
					className={[classes.card, disable ? classes.disable : null, activeCard == e ? classes.active : null].filter((f) => !!f).join(" ")}
					onClick={() => {
						if (disable) return
						dispatch(socketIo.actions.emit({name: "click_card", value: e}))
						setActiveCard(e)
					}}
				>
					{e}
				</div>
			))}
		</div>
	)
}
