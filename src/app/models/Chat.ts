import { Avatar } from "./Avatar";
import { Post } from "./Post";

interface IChat {
    title: String;
    body: String;
    owner: String;
}

export class Chat implements IChat {
    _id: String;
    post: [Post];
    likes: [any];
    constructor(public title: String, public body: String
        , public owner: String) {
    }
}