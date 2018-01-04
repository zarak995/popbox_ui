import { Avatar } from "./Avatar";
import { Post } from "./Post";

interface IChat {
    title: String;
    body: String;
    owner: any;

}

export class Chat implements IChat {
    _id: String;
    post: [Post];
    likes: [any];
    reports: [any];
    createdDate: string;
    constructor(public title: String, public body: String
        , public owner: any) {
    }
}