import { FSDriver } from "flydrive/drivers/fs"

export default {
	fs: () =>
		new FSDriver({
			location: new URL(`${process.cwd()}/storage`, import.meta.url),
			visibility: "public",
		}),
}
