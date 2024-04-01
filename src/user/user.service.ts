import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService){}

    async create({name, email, password}: CreateUserDTO){
        
        return await this.prisma?.user.create({
            data:{
                name,
                email,
                password
            },
        })
    }

    async list(){
        return await this.prisma?.user.findMany()
    }

    async show(id: number){
        return await this.prisma?.user.findUnique({
            where:{
                id: id
            }
        })
    }

}