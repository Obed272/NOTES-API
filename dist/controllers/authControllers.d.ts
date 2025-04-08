import { Request, Response } from "express";
interface RegisterRequestBody {
    name: string;
    email: string;
    password: string;
}
interface LoginRequestBody {
    email: string;
    password: string;
}
export declare const regUser: (req: Request<{}, {}, RegisterRequestBody>, res: Response) => Promise<void>;
export declare const logUser: (req: Request<{}, {}, LoginRequestBody>, res: Response) => Promise<void>;
export {};
