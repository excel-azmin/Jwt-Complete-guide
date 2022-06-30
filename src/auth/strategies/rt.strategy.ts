import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, } from "passport-jwt";
import { Request } from 'express'
import { Strategy } from "passport-local";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secrectOrKey: 'rt-secret',
            passReqToCallback: true,

        });
    }

    validate(req: Request, payload: any){
        const refreshToken = req.get('authorization').replace('Bearer', '').trim();
        return {
            ...payload,
            refreshToken
        };
    }
}