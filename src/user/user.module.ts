import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from './user.service';
import { UserIdCheckMiddlewares } from 'src/middlewares/user-id-check.middlewares';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdCheckMiddlewares).forRoutes({
      path: '/users/:id',
      method: RequestMethod.ALL
    })
  }

}
