import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Post } from '../../../models/Post';
import {environment} from '../../../../environments/environment.prod';
@Injectable()
export class LeftnavService {
  constructor(private http: Http) { }
  getTopChats(headers) {
    return this.http.options(environment.host +environment.chatsRoute+environment.topChatsRoute, {
      method: 'GET',
      headers: headers
    })
  }

  getUserChats(headers, userId) {
    return this.http.options(environment.host + environment.userChatsRoute + userId, {
      method: 'GET',
      headers: headers
    })
  }
}

