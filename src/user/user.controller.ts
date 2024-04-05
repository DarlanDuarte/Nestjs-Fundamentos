import { Body, Controller, Get, Param, Post, Put, Patch, Delete, ParseIntPipe, UseInterceptors, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { ParamId } from 'src/decorators/param-id.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard ,RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {

  constructor(private userService: UserService){}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() data: CreateUserDTO) {
    return await this.userService.create(data)
  }

  @Roles(Role.Admin, Role.User)
  @Get()
  async list(){
    return await this.userService.list()
  }

  @Roles(Role.Admin)
  @Get(':id')
  async show(@ParamId() id: number){
    console.log({id})
    return await this.userService.show(id)
  }

  @Roles(Role.Admin)
  @Put(':id')
  async update(@Body() {name, email, password ,birthAt, role}: UpdatePutUserDTO, @Param('id', ParseIntPipe) id: number){
    return await this.userService?.update(id, {name, email, password, birthAt, role})
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async updatePartial(@Body() data: UpdatePatchUserDTO, @Param('id', ParseIntPipe) id: number){
    return await this.userService?.updatePartial(id, data)
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number){
    return this.userService?.delete(id)
  }

}