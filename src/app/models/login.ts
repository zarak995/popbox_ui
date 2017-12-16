export interface ILogin {
    username: String;
    password: String;
}

export class Login implements ILogin {
    constructor(public username: String, public password: String) {
    }
}
