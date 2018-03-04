import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { User } from '../../models/user';
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class RegisterService {
  verifyId: String ='';
  constructor(private http: Http) { }
  registerNewUser(newUser: User) {
    return this.http.options(environment.host + environment.registerRoute, {
      method: 'POST',
      body: newUser
    }).map(res => res.json());
  }
}