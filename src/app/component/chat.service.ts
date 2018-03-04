import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment.prod';
import 'rxjs/add/operator/map';
@Injectable()
export class ChatService {

  headers = new Headers({
    'content-type': 'application/json',
    'authorization': window.localStorage.getItem('accesstoken')
  });

  constructor(private http: Http) { }

  saveNewChat(chat) {
    return this.http.options(environment.host + environment.chatsRoute, {
      method: 'POST',
      body: chat,
      headers: this.headers
    }).map(res => res.json())
  }

  saveNewPost(post) {
    return this.http.options(environment.host + environment.postRoute, {
      method: 'POST',
      body: post,
      headers: this.headers
    }).map(res => res.json())
  }

  updateChat(chat) {
    return this.http.options(environment.host + environment.chatsRoute + chat._id,
      {
        method: 'PUT',
        body: chat,
        headers: this.headers
      })
  }
}
