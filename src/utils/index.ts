import * as crypto from 'crypto';
import * as dayjs from 'dayjs';

export function encryptByMD5(str) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}

export function getStartAndEndDate (){
    let startDay = dayjs().startOf("date").format("YYYY-MM-DD HH:mm:ss"); // 2023-12-06 00:00:00
    let endDay = dayjs().endOf("date").format("YYYY-MM-DD HH:mm:ss");
    
    let startWeekDay = dayjs()
      .startOf("week")
      .format("YYYY-MM-DD HH:mm:ss");
    let endWeekDay = dayjs().endOf("week").format("YYYY-MM-DD HH:mm:ss");

    let startMonthDay = dayjs().startOf("month").format("YYYY-MM-DD HH:mm:ss");
    let endMonthDay = dayjs().endOf("month").format("YYYY-MM-DD HH:mm:ss");

    return {
        startDay,
        endDay,
        startWeekDay,
        endWeekDay,
        startMonthDay,
        endMonthDay
    }
}