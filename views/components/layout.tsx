import { FC } from "hono/jsx"

export const Layout: FC = (props) => {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>My Hono App</title>
			</head>
			<body
				style={{
					margin: 0,
					padding: 0,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
					width: "100vw",
					backgroundColor: "#f0f0f0",
					color: "#333",
					fontFamily: "Arial, sans-serif",
				}}
			>
				{props.children}
			</body>
		</html>
	)
}
