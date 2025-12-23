import { env } from "bun"
import { Disk } from "flydrive"
import drivers from "@/config/drive"

export const disk = new Disk(drivers[env.DRIVE_DISK]())
