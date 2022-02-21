import classes from "./Button.module.scss"

export default function Button({children, className, btnType, ...props}) {
	return (
		<div className={classes.root}>
			{(() => {
				switch (btnType) {
					case "primary":
						return (
							<div {...props} className={classes.primary}>
								<span className={className}>{children}</span>
							</div>
						)
					case "text":
						return (
							<div {...props} className={classes.text}>
								<span className={className}>{children}</span>
							</div>
						)
					case "second":
					default:
						return (
							<div {...props} className={classes.second}>
								<span className={className}>{children}</span>
							</div>
						)
				}
			})()}
		</div>
	)
}
