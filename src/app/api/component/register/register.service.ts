import { Injectable } from '@angular/core';
import { User } from '../../../models/user';
import { Http } from '@angular/http';
import { environment } from '../../../../environments/environment.prod';
@Injectable()
export class RegisterService {

  constructor(private http: Http) { }
  registerNewUser(newUser: User) {
    return this.http.options(environment.host + environment.loginRoute + environment.registerRoute, {
      method: 'POST',
      body: newUser
    }).map(res => res.json());
  }

  verifyUser(data) {
    return this.http.options(environment.host + environment.loginRoute + environment.userVerification, {
      method: 'POST',
      body: data
    }).map(res => res.json());
  }

  resendToEmail(userId) {
    return this.http.options(environment.host + environment.resendToEmail, {
      method: 'POST',
      body: userId
    }).map(res => res.json());
  }
}