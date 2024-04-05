import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';
import { UserIdCheckMiddlewares } from 'src/middlewares/user-id-check.middlewares';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
      //ConfigModule serve para configuração de variaveis de ambiente
      ConfigModule.forRoot(),
      PrismaModule, 
      forwardRef(() => AuthModule) 
    
    ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserModule],
})
export class UserModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdCheckMiddlewares).forRoutes({
      path: '/users/:id',
      method: RequestMethod.ALL
    })
  }

}
