import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Http, Headers } from '@angular/http';
@Injectable()
export class LandingService {

  constructor(private http: Http) { }
  headers = new Headers({
    'content-type': 'application/json',
    'authorization': window.localStorage.getItem('accesstoken')
  });

  getChats() {
    return this.http.options(environment.host + environment.chatsRoute, {
      method: 'GET',
      headers: this.headers
    })
      .map(res => res.json());
  }
  getCurrentAvatar(userId) {
    return this.http.options(environment.host + environment.avatarRoute + userId, {
      method: 'GET',
      headers: this.headers
    })
      .map(data => data.json())

  }
}
