import { MessageEntity } from "../../message/entities/MessageEntity";

export interface ChatEntity {
    id: string;
    members: string[];
    messages: MessageEntity[];
    createdAt: Date;
    updatedAt: Date;
}