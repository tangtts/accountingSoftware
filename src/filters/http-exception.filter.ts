import { Logger } from 'winston';
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, Inject } from '@nestjs/common';
import { Response,Request } from 'express';
import { getReqMainInfo } from 'src/utils/getReqMainInfo';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor( @Inject()  private logger:Logger){}
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const request = http.getRequest<Request>();
    const statusCode = exception.getStatus();
    
    let errorMsg:unknown = exception.message || 'Internal Server Error';
    // 加入更多异常错误逻辑
    if (exception instanceof BadRequestException) {
      errorMsg = (exception.getResponse() as any)?.message;
    }
    this.logger.error("error",{
      ...getReqMainInfo(request),
      message:errorMsg,
    })
    response.status(statusCode).json({
      code:statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:errorMsg,
    }).end()
  }
}
