import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import * as  bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService){}

    async create(data: CreateUserDTO){


        data.password = await bcrypt.hash(data.password, 10)
        
        return await this.prisma?.user.create({
            data
        })
    }

    async list(){
        return await this.prisma?.user.findMany()
    }

    async show(id: number){

        await this.exists(id)

        return await this.prisma?.user.findUnique({
            where:{
                id: id
            }
        })
    }

    async update(id: number, {name, email, password, birthAt, role}: UpdatePutUserDTO){

        await this.exists(id)


        password = await bcrypt.hash(password, 10)

        return await this.prisma?.user.update({
            where:{
                id:id
            },
            data:{
                name: name,
                email: email,
                password: password,
                birthAt: birthAt ? new Date(birthAt) : null,
                role: role
                
            }
        })
    }

    async updatePartial(id: number, data: UpdatePatchUserDTO){

        await this.exists(id)

        data.password = await bcrypt.hash(data.password, 10)

        return await this.prisma?.user.update({
            where: {
                id
            },
            data
        })
    }

    async delete(id: number){
        await this.exists(id)

        return await this.prisma?.user.delete({
            where:{
                id: id
            }
        })
    }

    async exists(id: number){
        //Count => retorna 1 se existe e 0 se não existe onde 1 é true e 0 é false
        if(!(await this.prisma.user.count({
            where:{
                id
            }
        }))){
            throw new NotFoundException(`O usuário ${id} não existe!`)
        }
    }

}