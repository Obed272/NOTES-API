import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
interface CustomRequest extends Request {
    user?: string | JwtPayload;
}
export declare const authMiddleware: (req: CustomRequest, res: Response, next: NextFunction) => Response | any;
export default authMiddleware;
