
export interface IPost{
    avatar: any;
    chat: String;
    body: String;    
    createdDate: any;
}
export class Post implements IPost {
    likes: Number;
    tags: [String];
    constructor(public chat: String, public avatar: any
    ,public body: String,public createdDate: any) {}
}