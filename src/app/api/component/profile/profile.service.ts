import { Injectable } from '@angular/core';
import { Http, RequestMethod, Request, Headers, RequestOptions, } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ProfileService {
  constructor(private http: Http, private router: Router) { }
  getUserCurrentUserData() {
    const token = window.localStorage.getItem('token');
    const userId = window.localStorage.getItem('id');
    const headers = new Headers({ 'authorization': token, 'content-type': 'application/json' });
    debugger;
    return this.http.options(environment.host + environment.usersRoute + userId, {
      headers: headers,
      method: 'GET'
    })
      .map(res => res.json());
  }
}
