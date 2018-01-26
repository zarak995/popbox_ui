import { Injectable } from '@angular/core';
import { Http, RequestMethod, Request, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import {environment} from '../../../../environments/environment.prod';
@Injectable()
export class UserService {

  constructor(private http: Http) { }
  token = window.localStorage.getItem('token');

  options = new RequestOptions ({
    body: {
      token : this.token
    }
  });

  getUserCurrentUserData() {
    return this.http.get(environment.host + environment.usersRoute, this.options.body)
    .map(res => res.json());
  }
}
