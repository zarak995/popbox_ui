import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import { Post } from '../../../models/Post';

@Injectable()
export class ChatService {
  constructor(public http: Http) { }
  leftNavSelectedChat: any = {};

  removeChat(headers, chatId) {
    return this.http.options("http://ec2-52-202-182-40.compute-1.amazonaws.com:3000/chats/" + chatId, {
      method: "DELETE",
      headers: headers
    })
  }
  removePost(headers, chatId, postId) {
    return this.http.options('http://ec2-52-202-182-40.compute-1.amazonaws.com:3000/posts/' + chatId + '/' + postId, {
      method: 'DELETE',
      headers: headers
    })
  }
  saveNewChat(chat, headers) {
    return this.http.options('http://ec2-52-202-182-40.compute-1.amazonaws.com:3000/chats', {
      method: 'POST',
      body: chat,
      headers: headers
    })
  }

  saveNewAvatar(avatar, headers, userId) {
    return this.http.options('http://ec2-52-202-182-40.compute-1.amazonaws.com:3000/avatars/' + userId, {
      method: 'POST',
      body: avatar,
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

  getOneChat(headers, chat) {
    return this.http.options('http://ec2-52-202-182-40.compute-1.amazonaws.com:3000/chats/' + chat._id, {
      method: 'GET',
      headers: headers
    })
  }
  getAvatars(userId, headers) {
    return this.http.options('http://ec2-52-202-182-40.compute-1.amazonaws.com:3000/avatars/' + userId, {
      method: 'GET',
      headers: headers
    })
  }
  updateChat(chat, headers) {
    return this.http.options('http://ec2-52-202-182-40.compute-1.amazonaws.com:3000/chats/' + chat._id,
      {
        method: 'PUT',
        body: chat,
        headers: headers
      })
  }

  getChats(headers) {
    return this.http.options('http://ec2-52-202-182-40.compute-1.amazonaws.com:3000/chats/', {
      method: 'GET',
      headers: headers
    })
  }
}
