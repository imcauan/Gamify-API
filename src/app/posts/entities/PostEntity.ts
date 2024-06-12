export interface PostEntity {
    id: string,
    createdAt: Date,
    updatedAt: Date,
    authorId: string,
    caption?: string,
    location?: string,
    tags?: string,
}