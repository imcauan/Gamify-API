import { CommunityEntity } from "../../community/entities/CommunityEntity";
import { PostEntity } from "../../posts/entities/PostEntity";

export interface UserEntity {
    id: string,
    email: string,
    username: string, 
    bio: string | null,
    avatarUrl: string | null,
    posts?: PostEntity[],
    communities?: CommunityEntity[] 
}