import { UserEntity } from "../app/auth/entites/UserEntity";

declare global {
    namespace Express {
        export interface Request {
            user: Partial<UserEntity>
        }
    }
}