import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../../environments/environment.prod';

@Injectable()
export class ViewchatService {
  viewchatid: String = "";
  constructor(private http: Http) { }
  headers = new Headers({
    'content-type': 'application/json',
    'authorization': window.localStorage.getItem('accesstoken')
  });

  getSelectedViewChat() {
    return this.http.options(environment.host + environment.chatsRoute + this.viewchatid, {
      method: 'GET',
      headers: this.headers
    })
      .map(res => res.json())
  }
}