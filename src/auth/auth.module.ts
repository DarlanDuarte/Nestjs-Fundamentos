import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserService } from "src/user/user.service";


@Module({
    imports: [
        JwtModule.register({
        secret: process.env.JWT_SECRET
    }),
        forwardRef(() => UserModule) ,
        PrismaModule
    
    ],
    controllers: [AuthController],
    providers:[UserService, AuthService],
    exports: [AuthService]
})
export class AuthModule{}