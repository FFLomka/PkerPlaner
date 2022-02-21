import classes from "./Modal.module.scss"

export default function Modal({visible, children, onCancle, ...props}) {
	return (
		<div
			className={classes.root}
			onClick={() => {
				try {
					onCancle()
				} catch (error) {}
			}}
			style={visible ? {} : {display: "none"}}
		>
			<div
				onClick={(e) => {
					try {
						e.preventDefault()
						e.stopPropagation()
					} catch (error) {}
				}}
				className={classes.box}
			>
				{children}
			</div>
		</div>
	)
}
