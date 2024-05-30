import { UserEntity } from "../app/user/entities/UserEntity";

declare global {
    namespace Express {
        export interface Request {
            user: Partial<UserEntity>
        }
    }
}