
export interface IPost {
    avatar: any;
    chat: String;
    body: String;
    createdDate: any;
}
export class Post implements IPost {
    _id:any;
    likes: Number;
    tags: any;
    createdDate: any;
    constructor(public chat: String, public avatar: any
        , public body: String) { }
}