import { UserEntity } from "../../auth/entites/UserEntity";

export interface CommunityEntity {
    id: string,
    bio?: string,
    name: string,
    owner: UserEntity,
    createdAt: Date
}