import { BadRequestException, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class UserIdCheckMiddlewares implements NestMiddleware {

    use(req: Request, res: Response, next: NextFunction) {

        console.log(`UserCheckMiddlewares`, 'Antes')

        if(isNaN(Number(req.params.id)) || Number(req.params.id) <= 0){
            throw new BadRequestException("ID inválido!")
        }

        console.log(`UserCheckMiddlewares`, 'Depois')

        next()

    }
}