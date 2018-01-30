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
}
