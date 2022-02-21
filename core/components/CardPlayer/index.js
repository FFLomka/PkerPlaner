import classes from "./CardPlayer.module.scss"

export default function CardPlayer({name, value, type, ...props}) {
	return (
		<div className={classes.root}>
			<div className={classes.card + " " + (type == "noPick" ? classes.nopick : type == "pick" ? classes.pick : classes.show)}>{value}</div>
			<div className={classes.name}>{name}</div>
		</div>
	)
}
