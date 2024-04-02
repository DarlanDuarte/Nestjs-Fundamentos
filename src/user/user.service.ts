import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDTO } from "./dto/create-user.dto";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService){}

    async create(data: CreateUserDTO){
        
        return await this.prisma?.user.create({
            data
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

    async update(id: number, {name, email, password, birthAt}: UpdatePutUserDTO){
        await this.exists(id)

        return await this.prisma?.user.update({
            where:{
                id:id
            },
            data:{
                name: name,
                email: email,
                password: password,
                birthAt: birthAt ? new Date(birthAt) : null
            }
        })
    }

    async updatePartial(id: number, data: UpdatePatchUserDTO){
        await this.exists(id)

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
        if(!(await this.show(id))){
            throw new NotFoundException(`O usuário ${id} não existe!`)
        }
    }

}