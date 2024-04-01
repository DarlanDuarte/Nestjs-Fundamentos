import { Body, Controller, Get, Param, Post, Put, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {

  constructor(private userService: UserService){}

  @Post()
  async create(@Body() {name, email, password}: CreateUserDTO) {
    return await this.userService.create({name, email, password})
  }

  @Get()
  async list(){
    return await this.userService.list()
  }

  @Get(':id')
  async show(@Param('id', ParseIntPipe) id: number){
    return await this.userService.show(id)
  }

  @Put(':id')
  async update(@Body() {name, email, password}: UpdatePutUserDTO, @Param('id', ParseIntPipe) id: number){
    return {
      name,
      email,
      password,
      id
    }
  }

  @Patch(':id')
  async updatePartial(@Body() {name}: UpdatePatchUserDTO, @Param('id', ParseIntPipe) id: number){
    return {
      name, id
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number){
    return{
      id
    }
  }

}