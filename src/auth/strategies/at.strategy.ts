import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, } from "passport-jwt";
import { Strategy } from "passport-local";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secrectOrKey: 'at-secret',
        });
    }

    validate(payload: any){
        return payload;
    }
}