import dayjs from "dayjs"

const FULL_DATE_FORMAT = "DD-MM-YYYY HH:mm"

export const toFullDate = (t: Date): string => dayjs(t).format(FULL_DATE_FORMAT)
