import { Avatar } from "./Avatar";
import { Post } from "./Post";

interface IChat {
    body: String;
    owner: any;
}

export class Chat implements IChat {
    _id: String;
    post: [Post];
    likes: [any];
    isLiked: Boolean;
    reports: [any];
    createdDate: string;
    constructor(public body: String
        , public owner: any) {
    }
}