import { FC } from "hono/jsx"
import { Layout } from "./components/layout"

export const HomeView: FC = () => {
	return (
		<Layout>
			<h1>Hello, Hono with Bun!</h1>
		</Layout>
	)
}
