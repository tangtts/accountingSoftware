import {
  ExceptionFilter,
  HttpException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { getReqMainInfo } from 'src/utils/getReqMainInfo';
import {Logger} from "winston";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const msg: unknown = exception['response'] || 'Internal Server Error';
    // 加入更多异常错误逻辑
    // if (exception instanceof QueryFailedError) {
    //   msg = exception.message;
    //   // if (exception.driverError.errno && exception.driverError.errno === 1062) {
    //   //   msg = '唯一索引冲突';
    //   // }
    // }

    console.log(exception)

    const responseBody = {
      ...getReqMainInfo(request),
      exceptioin: exception['name'],
      error: msg,
    };

    this.logger.error({message: responseBody});
    response.status(httpStatus).json(responseBody);
  }
}
