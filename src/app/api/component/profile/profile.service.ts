import { Injectable } from '@angular/core';
import { Http, RequestMethod, Request, Headers, RequestOptions, } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
@Injectable()
export class ProfileService {
  constructor(private http: Http, private router: Router) {}
  getUserCurrentUserData() {
    const token = window.localStorage.getItem('token');
    const userId = window.localStorage.getItem('id');
    const headers = new Headers({'authorization': token, 'content-type': 'application/json'});
    debugger;
    return this.http.options('http://ec2-52-202-182-40.compute-1.amazonaws.com:3000/users/' + userId,{
      headers: headers, 
      method: 'GET'
  })
    .map(res => res.json());
  }
}
