import { BadRequestException, Body, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/decorators/user.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { writeFile, writeFileSync } from "fs";
import { join } from "path";
import { FileService } from "src/file/file.service";




@Controller('auth')
export class AuthController{

    constructor(
            private readonly  useService: UserService,
            private readonly authService: AuthService,
            private readonly fileService: FileService
        ){}

    @Post('login')
    async login(@Body() {email, password}: AuthLoginDTO){
        return await this.authService.login(email, password)
    }

    @Post('register')
    async register(@Body() body: AuthRegisterDTO){
        return await this.authService.register(body)
    }

    @Post('forget')
    async forget(@Body() {email}: AuthForgetDTO){
        return await this.authService.forget(email)
    }

    @Post('reset')
    async reset(@Body() {password, token}: AuthResetDTO){
        return await this.authService.reset(password, token)
    }

    @UseGuards(AuthGuard)
    @Post('me')
    async me(@User() user){
        return {
            user
        }
    }

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuard)
    @Post('photo')
    async uploadPhoto(
        @User() user, 
        @UploadedFile(new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({maxSize: 1024 * 80})
            ]
            

    })) photo: Express.Multer.File){
        
        const path = join(__dirname, '..', '..', `storage`, `photos`, `photo-${user.id}.png`)

        try{

            await this.fileService.upload(photo, path)

        }catch(e){
            throw new BadRequestException(e)
        }

        return {sucess: true}
    }

}