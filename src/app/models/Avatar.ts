import { User } from './user';
export interface IAvatar {

    name: String;
    user: String;
}
export class Avatar implements IAvatar {
    id: String;
    constructor(public name: String,
        public user: String) { }
}