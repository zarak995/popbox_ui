import { Injectable } from '@angular/core';
import { User } from '../../../models/user';
import { Http } from '@angular/http';
@Injectable()
export class RegisterService {

  constructor(private http: Http) { }

  registerNewUser(newUser: User) {
    debugger;
    return this.http.options('http://ec2-52-202-182-40.compute-1.amazonaws.com:3000/login/reg', {
      method: 'POST',
      body: newUser
    }).map(res => res.json());
  }
}
