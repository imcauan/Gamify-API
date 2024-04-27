import { UserEntity } from "../../user/entities/UserEntity";

export interface CommunityEntity {
    id: string,
    bio?: string,
    name: string,
    owner: UserEntity,
    createdAt: Date
}