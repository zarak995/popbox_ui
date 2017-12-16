import { User } from './user';
export interface IAvatar {
    id: String;
    name: String;
    user: String;
}
export class Avatar implements IAvatar {
    constructor(public id: String, 
        public name: String, 
        public user: String) { }
}