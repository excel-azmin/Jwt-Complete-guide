import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt'
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { use } from 'passport';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService){}

    
    async signup(dto: AuthDto): Promise<Tokens>{

        const hash = await this.hashData(dto.password);
        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash,
                updatedAt: new Date()
            },
        });

        const tokens = await this.getTokens((await newUser).id, (await newUser).email);
        await this.updateRtHash(newUser.id, tokens.refresh_token);
        return tokens;
    }

    async signin(dto: AuthDto):Promise<Tokens>{

        const user = await this.prisma.user.findUnique(
            {
                where: {
                    email : dto.email
                }
            }
        )

        if(!user) throw new NotFoundException({
            error: "User Not Found",
            data : dto.email
        });

        const passwordMatches = await bcrypt.compare(dto.password, user.hash);
        if(!passwordMatches) new NotFoundException({
            error: "User Password Dosen't Match",
            data : dto.email
        });

        const tokens = await this.getTokens((await user).id, (await user).email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

    logout(){}

    refreshToken(){}



    hashData(data: string){
        return bcrypt.hash(data, 10);
    }

    async getTokens(userId: number, email: string): Promise<Tokens>{

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: 'at-secret',
                    expiresIn: 60 * 15,
                }),

            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: 'rt-secret',
                    expiresIn: 60 * 15,
                })    

        ])

        return {
            access_token: at,
            refresh_token: rt
        }
    }

    async updateRtHash(userId: number, rt: string){
        const hash = await this.hashData(rt);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data:{
                hashedRt: hash
            }
        })
    }


    
}
