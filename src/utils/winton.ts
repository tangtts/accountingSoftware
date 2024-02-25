import { WinstonModule,utilities  } from 'nest-winston';
import * as winston from 'winston';
import  * as DailyRotateFile from 'winston-daily-rotate-file';

function genDefaultLogTransport(level:string):DailyRotateFile{
  const transport: DailyRotateFile = new DailyRotateFile({
    level,
    filename: `${level}-%DATE%.log`, // 日志名称，占位符 %DATE% 取值为 datePattern 值
    dirname: `logs`, // 日志保存的目录
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
    maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
    maxFiles: '14d',// 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件。
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.json()
    ),
  })
  return transport
}

const errorLogTransport = genDefaultLogTransport("error");
const infoLogTransport = genDefaultLogTransport("info");

export  function winstonConfig() {
  return WinstonModule.forRoot({
    exitOnError: false,
    transports: [
      errorLogTransport,
      infoLogTransport
    ],
  })
}