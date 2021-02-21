import { sign } from 'jsonwebtoken'
import authConfig from '@config/auth';
import AppError from "@shared/errors/AppError";
import { compare, hash } from "bcrypt";
import { compile } from "joi";
import { getCustomRepository } from "typeorm";
import User from "../typeorm/entities/User";
import { UsersRepository } from "../typeorm/repositories/UsersRepository";

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string
}

class CreateSessionsService {
    public async execute({ email, password }: IRequest) : Promise<IResponse> {
        const usersRepository = getCustomRepository(UsersRepository);
        
        // ve se o email do usuario existe no banco
        const user = await usersRepository.findByEmail(email);
        if(!user){
            throw new  AppError('Incorrect email/password combination.', 401);
        }

        // compara a senha que o user digitou com a criptografia
        const passwordConfirmed = await compare(password, user.password);
        if(!passwordConfirmed){
            throw new  AppError('Incorrect email/password combination.', 401);
        }

        const token = sign({}, authConfig.jwt.secret, {
            subject: user.id,
            expiresIn: authConfig.jwt.expiresIn,
        });

        return {
            user,
            token
        };
    }
}

export default CreateSessionsService