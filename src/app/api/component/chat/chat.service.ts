import { Injectable } from '@angular/core';
import { Http } from '@angular/http'
@Injectable()
export class ChatService {
  constructor(public http: Http) { }
  saveNewChat(chat, headers) {
    return this.http.options('http://localhost:3000/chats', {
      method: 'POST',
      body: chat,
      headers: headers
    })
  }

  saveNewAvatar(avatar, headers, userId) {
    return this.http.options('http://localhost:3000/avatars/' + userId, {
      method: 'POST',
      body: avatar,
      headers: headers
    })
  }

  saveNewPost(post, headers) {

    return this.http.options('http://localhost:3000/posts', {
      method: 'POST',
      body: post,
      headers: headers
    })
  }

  getAvatars(userId, headers) {
    return this.http.options('http://localhost:3000/avatars/' + userId, {
      method: 'GET',
      headers: headers
    })
  }
  saveNewChatlike(chat, headers) {
    return this.http.options('http://localhost:3000/chats/' + chat._id,
      {
        method: 'PUT',
        body: chat,
        headers: headers
      })
  }

  getChats(headers) {
    return this.http.options('http://localhost:3000/chats/', {
      method: 'GET',
      headers: headers
    })

  }


}