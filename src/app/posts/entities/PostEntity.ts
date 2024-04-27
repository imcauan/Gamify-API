import { UserEntity } from "../../user/entities/UserEntity";

export interface PostEntity {
    id: string,   
    createdAt: Date,        
    updatedAt: Date,
    title: string,
    imageUrl: string
    content?: string,
    author: UserEntity
}