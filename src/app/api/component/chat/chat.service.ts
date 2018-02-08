import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
import { Post } from '../../../models/Post';
import { environment } from '../../../../environments/environment.prod';
@Injectable()
export class ChatService {
  constructor(public http: Http) { }
  leftNavSelectedChat: any = {};

  removeChat(headers, chatId) {
    return this.http.options(environment.host + environment.chatsRoute + chatId, {
      method: "DELETE",
      headers: headers
    })
  }
  removePost(headers, chatId, postId) {
    return this.http.options(environment.host + environment.chatsRoute + chatId + '/' + postId, {
      method: 'DELETE',
      headers: headers
    })
  }
  saveNewChat(chat, headers) {
    return this.http.options(environment.host + environment.chatsRoute, {
      method: 'POST',
      body: chat,
      headers: headers
    })
  }

  saveNewAvatar(avatar, headers, userId) {
    return this.http.options(environment.host + environment.avatarRoute + userId, {
      method: 'POST',
      body: avatar,
      headers: headers
    })
  }

  saveNewPost(post, headers) {
    console.log("its here");
    console.log(Post)
    return this.http.options(environment.host + environment.postRoute, {
      method: 'POST',
      body: post,
      headers: headers
    })
  }

  getOneChat(headers, chat) {
    return this.http.options(environment.host + environment.chatsRoute + chat._id, {
      method: 'GET',
      headers: headers
    })
  }
  getCurrentAvatar(userId, headers) {
    return this.http.options(environment.host + environment.avatarRoute + userId, {
      method: 'GET',
      headers: headers
    })
  }
  updateChat(chat, headers) {
    return this.http.options(environment.host + environment.chatsRoute + chat._id,
      {
        method: 'PUT',
        body: chat,
        headers: headers
      })
  }

  getUserChats(headers, userId) {
    return this.http.options(environment.host + environment.userChatsRoute + userId, {
      method: 'GET',
      headers: headers
    })
  }

  getChats(headers) {
    return this.http.options(environment.host + environment.chatsRoute, {
      method: 'GET',
      headers: headers
    })
  }

  getTopChats(headers) {
    return this.http.options(environment.host + environment.chatsRoute + environment.topChatsRoute, {
      method: 'GET',
      headers: headers
    })
  }
}
