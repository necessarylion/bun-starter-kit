import { env } from "bun"
import { Disk } from "flydrive"
import { FSDriver } from "flydrive/drivers/fs"

const drivers = {
	fs: () =>
		new FSDriver({
			location: new URL(`${process.cwd()}/storage`, import.meta.url),
			visibility: "public",
		}),
}

export const disk = new Disk(drivers[env.DRIVE_DISK]())
