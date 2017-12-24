import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Post } from '../../../models/Post';

@Injectable()
export class LeftnavService {
  constructor(private http: Http) { }
  getTopChats(headers) {
    return this.http.options('http://localhost:3000/chats/top/chats', {
      method: 'GET',
      headers: headers
    })
  }
  
  saveNewPost(post, headers) {
    console.log("its here");
    console.log(Post)
    return this.http.options('http://localhost:3000/posts', {
      method: 'POST',
      body: post,
      headers: headers
    })
  }

}

