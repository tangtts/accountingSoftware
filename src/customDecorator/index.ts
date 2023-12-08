import { User } from './../user/entities/user.entity';
import { ExecutionContext, SetMetadata, applyDecorators, createParamDecorator } from '@nestjs/common';
import { IsEmpty, IsString,IsNotEmpty } from 'class-validator';
// 合并装饰器
export const  RequireLogin = () => SetMetadata('require-login', true);
export function IsStringAndNotEmpty(){
  return applyDecorators(
    IsNotEmpty(),
    IsString(),
  )
}

/**
 * 
 * 获取 user信息，比如 userid
 */
export const UserInfo = createParamDecorator((data:string,ctx:ExecutionContext)=>{
  const request = ctx.switchToHttp().getRequest();
  if(request.user){
    return data ? request.user[data] : request.user;
  }
  return null;
})