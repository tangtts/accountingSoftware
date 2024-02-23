import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class Exception implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();
    const request = http.getRequest<Request>();
    const statusCode = exception.getStatus();
    
    let errorMsg:unknown = exception.message || 'Internal Server Error';
    // 加入更多异常错误逻辑
    if (exception instanceof BadRequestException) {
      errorMsg = exception.getResponse();
    }
    
    response.status(statusCode).json({
      code:statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:errorMsg,
    }).end()
  }
}
