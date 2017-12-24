
export interface IPost {
    avatar: any;
    chat: String;
    body: String;
    createdDate: any;
}
export class Post implements IPost {
    likes: Number;
    tags: any;
    constructor(public chat: String, public avatar: any
        , public body: String, public createdDate: any) { }
}