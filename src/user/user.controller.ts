import { Body, Controller, Get, Param, Post, Put, Patch, Delete, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { ParamId } from 'src/decorators/param-id.decorator';

@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {

  constructor(private userService: UserService){}


  @Post()
  async create(@Body() data: CreateUserDTO) {
    return await this.userService.create(data)
  }

  @Get()
  async list(){
    return await this.userService.list()
  }

  @Get(':id')
  async show(@ParamId() id: number){
    console.log({id})
    return await this.userService.show(id)
  }

  @Put(':id')
  async update(@Body() {name, email, password ,birthAt}: UpdatePutUserDTO, @Param('id', ParseIntPipe) id: number){
    return await this.userService?.update(id, {name, email, password, birthAt})
  }

  @Patch(':id')
  async updatePartial(@Body() data: UpdatePatchUserDTO, @Param('id', ParseIntPipe) id: number){
    return await this.userService?.updatePartial(id, data)
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number){
    return this.userService?.delete(id)
  }

}