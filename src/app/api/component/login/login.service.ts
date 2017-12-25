import { Injectable } from '@angular/core';
import { Http, RequestMethod, Request, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {
  constructor(private http: Http) { }
  token: String;
  id: string;

  isUserValid(data) {
    const headers = new Headers({ 'content-type': 'application/json', });
    const options = new RequestOptions({
      headers: headers,
      body: data,
    });

    return this.http.post('http://ec2-52-202-182-40.compute-1.amazonaws.com:3000/login', options.body)
      .map(res => res.json());
  }

  isUserLoggedin() {
    this.token = window.localStorage.getItem('token');
    this.id = window.localStorage.getItem('id');
    if (this.token && this.id) {
      return true;
    } else {
      return false;
    }
  }
}
