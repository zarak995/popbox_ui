import { Injectable } from '@angular/core';
import { Http, RequestMethod, Request, Headers, RequestOptions, } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.prod';

@Injectable()
export class ProfileService {
  token = window.localStorage.getItem('token');
  id = window.localStorage.getItem('id');
  headers = new Headers({ 'authorization': this.token, 'content-type': 'application/json' });
  constructor(private http: Http, private router: Router) { }

  getUserCurrentUserData() {
    return this.http.options(environment.host + environment.usersRoute + this.id, {
      headers: this.headers,
      method: 'GET'
    })
  }

  getOwnChats() {
    return this.http.options(environment.host + environment.userChatsRoute + this.id, {
      headers: this.headers,
      method: 'GET'
    })
  }

  updateProfile(data) {
    return this.http.options(environment.host + environment.usersRoute + this.id, {
      headers: this.headers,
      body: data,
      method: 'PUT'
    })
  }

  changePassword(data) {
    return this.http.options(environment.host + environment.userChangePasswordRoute + this.id, {
      headers: this.headers,
      body: data,
      method: 'PUT'
    })
  }
}