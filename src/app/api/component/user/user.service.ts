import { Injectable } from '@angular/core';
import { Http, RequestMethod, Request, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

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
    return this.http.get('localhost:3000/Users', this.options.body)
    .map(res => res.json());
  }
}
