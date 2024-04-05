import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt'


@Injectable()
export class AuthService{
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma : PrismaService,
        private readonly userService: UserService
    ){}


    createToken(user: User){

        return {
            acessToken: this.jwtService.sign({
                id: user.id,
                name: user.name,
                email: user.email,
    
            }, {
                expiresIn: '7 days',
                subject: String(user.id),
                issuer: 'login',
                audience: 'users'
            })
        }

    }

    checkToken(token: string){
        try{
            const data = this.jwtService.verify(token)

            return data

        }catch(e){
            throw new BadRequestException(e)
        }

    }

    async login(email: string, password: string){
        
        const usuario = await this.getUser(email)

        const passwordCrypt = await bcrypt.compare(password, usuario.password)

        if(!passwordCrypt){
            throw new UnauthorizedException("Email ou Senha incorretos.")
        }

        const user = await this.prisma.user.findFirst({
            where:{
                email: email,
                password: usuario.password
            }
        })

        if(!user){
            throw new UnauthorizedException(`Email ou Senha incorretos.`)
        }

    



        return this.createToken(user)

    }

    async forget(email: string){

        const user = await this.prisma.user.findFirst({
            where:{
                email
            }
        })

        if(!user){
            throw new UnauthorizedException(`Email está incorreto.`)
        }

        return true
    }

    async reset(password: string, token: string){

        const id = 0;

        const user = await this.prisma.user.update({
            where:{
                id
            },
            data:{
                password
            }
        })

        return this.createToken(user)
    }


    async register(data: AuthRegisterDTO){
        
        const user = await this.userService.create(data)

        return this.createToken(user)
    }

    async getUser(email: string){
        return this.prisma.user.findFirst({
            where:{
                email: email
            }
        })
    }


}