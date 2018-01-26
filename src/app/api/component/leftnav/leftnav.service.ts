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
  
  saveNewPost(post, headers) {
    console.log("its here");
    console.log(Post)
    return this.http.options('http://ec2-52-202-182-40.compute-1.amazonaws.com:3000/posts', {
      method: 'POST',
      body: post,
      headers: headers
    })
  }

}

