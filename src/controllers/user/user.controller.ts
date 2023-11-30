import { Request, Response } from "express";
import { User } from "../../models/entities/user/user.model";
import { CreateUserDto } from "../../models/dtos/users/create-user.dto";
import { AuthResponseDto } from "../../models/dtos/users/auth-response.dto";
import AuthenticationUtils from "../../utils/auth/authentication.utils";
import { LoginUserDto } from "../../models/dtos/users/login-user.dto";

export class UserController {


    static save = async (req: Request, res: Response) => {
        try {
            const createUserDto = req.body as CreateUserDto;
            const existingUser = await User.findOne({ where: { email: createUserDto.email } });
            if (existingUser) throw new Error('User with this email already exists');
            createUserDto.password = await AuthenticationUtils.getPasswordHash(createUserDto.password);
            const user = User.build(createUserDto);
            await user.save();
            const authResponseDto: AuthResponseDto = await AuthenticationUtils.generateAuthResponseDto(user);
            return res.send(authResponseDto);
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }


    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body as LoginUserDto;
            const user: User | null = await User.findOne({ where: { email } });
            const isPasswordValid = await AuthenticationUtils.validatePassword(password, user?.password)
            const authenticated = !!user && isPasswordValid;
            const authResponseDto = await AuthenticationUtils.generateAuthResponseDto(authenticated ? user : null, authenticated ? undefined : 'Credentials are incorrect');
            res.status(authResponseDto.success ? 200 : 403).send(authResponseDto);
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }

}