import * as jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import JwtPayload from '../../models/entities/user/jwt-payload.model';
import { User } from '../../models/entities/user/user.model';
import { AuthResponseDto } from '../../models/dtos/users/auth-response.dto';
dotenv.config();


export default class AuthenticationUtils {

    static async getAccessToken(payload: JwtPayload): Promise<string> {
        return await jwt.sign(payload, <string>process.env.JWT_SECRET, { 'expiresIn': process.env.JWT_EXPIRES_IN })
    }

    static async validateAccessToken(token: string): Promise<JwtPayload> {
        return await <JwtPayload>jwt.verify(token, <string>process.env.JWT_SECRET)
    }

    static async getPasswordHash(password: string): Promise<string> {
        return await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS as string))
    }

    static async validatePassword(inputPassword: string, passwordHash: string | undefined): Promise<boolean> {
        if (!passwordHash) return false;
        return await bcrypt.compare(inputPassword, passwordHash)
    }

    static async generateAuthResponseDto(user: User | null, message?: string): Promise<AuthResponseDto> {
        try {
            const authResponseDto = {} as AuthResponseDto;
            authResponseDto.message = message;
            if (!user) {
                authResponseDto.success = false;
                return authResponseDto;
            }
            authResponseDto.firstName = user.firstName;
            authResponseDto.lastName = user.lastName;
            authResponseDto.email = user.email;
            authResponseDto.gender = user.gender;
            authResponseDto.id = user.id;
            authResponseDto.success = true;
            authResponseDto.token = 'Bearer ' + await AuthenticationUtils.getAccessToken({ id: authResponseDto.id, email: authResponseDto.email })
            return authResponseDto;
        } catch (error: any) {
            throw new Error(`${error?.message || 'Not available'}`)
        }
    }
}