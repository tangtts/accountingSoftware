import dayjs from "dayjs";
export const timeMap = new Map([
	['今天', [
		dayjs().startOf('date').format('YYYY-MM-DD HH:mm:ss'),
		dayjs().endOf('date').format('YYYY-MM-DD HH:mm:ss')
	]],
	['本周', [
		dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
		dayjs().endOf('week').add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
	]],
	['本月', [
		dayjs().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
		dayjs().endOf('month').format('YYYY-MM-DD HH:mm:ss')
	]],
])

export const changeRangeType = (name)=>{
		return timeMap.get(name)
	}