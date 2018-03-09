import { Component, OnInit } from '@angular/core';
import { ViewchatService } from './viewchat.service';
import { Chat } from '../../models/Chat';
import { Post } from '../../models/Post';
import * as moment from 'moment';
import { ChatService } from '../../../app/component/chat.service';
import { max } from 'rxjs/operator/max';
@Component({
  selector: 'app-viewchat',
  templateUrl: './viewchat.component.html',
  styleUrls: ['./viewchat.component.css']
})
export class ViewchatComponent implements OnInit {

  constructor(private viewChatService: ViewchatService, private chatService: ChatService) { }
  viewSelectedChat: Chat;
  comment = {
    chatId: '',
    commentBody: '',
    commentAvatarId: ''
  }

  currentAvatar: {
    id: '',
    name: '',
    user: ''
  };
  user = window.localStorage.getItem('accesstoken_pcs1')
  ngOnInit() {
    this.getCurrentAvatar();
    this.getSelectedChat();
  }

  sortChatsAndPosts(chat: Chat) {
    chat.createdDate = moment(chat.createdDate).fromNow();
    if (chat.post.length > 0) {
      for (var i = 0; i < chat.post.length; i++) {
        chat.post[i].createdDate = moment(chat.post[i].createdDate).fromNow();
      }
    }
    return chat;
  }
  getCurrentAvatar() {
    this.viewChatService.getCurrentAvatar(this.user)
      .subscribe(data => {
        data.forEach(element => {
          this.currentAvatar = {
            id: element._id, name: element.name, user: element.user
          }
        },
          err => { console.log(err); },
          () => console.log('Request complete'));
      })
  }

  getSelectedChat() {
    this.viewChatService.getSelectedViewChat()
      .subscribe(data => {
        this.viewSelectedChat = data;
        let maxLikes = this.viewSelectedChat.likes.length;
        for (var xl = 0; xl < maxLikes; xl++) {
          if (this.viewSelectedChat.likes[xl].user === this.user) {
            this.viewSelectedChat.isLiked = true;
            break;
          }
        }
        let maxReports = this.viewSelectedChat.reports.length;
        for (var xl = 0; xl < maxReports; xl++) {
          if (this.viewSelectedChat.reports[xl].user === this.user) {
            this.viewSelectedChat.isReported = true;
            break;
          }
        }
        this.sortChatsAndPosts(this.viewSelectedChat);
      },
      err => { },
      () => { console.log('Request Complete: Get selected chat') })
  }

  createNewPost(chat) {
    var maxPosts = chat.post.length;
    for (var x = 0; x < maxPosts; x++) {
      if (chat.post[x].avatar.user === this.user) {
        this.comment.commentAvatarId = chat.post[x].avatar._id;
        this.comment.chatId = chat._id;
        break;
      }

      if (chat.post[x].avatar.user === chat.owner.user) {
        this.comment.commentAvatarId = chat.owner._id;
        this.comment.chatId = chat._id;
        break;
      }
    }

    if (this.comment.chatId != "") {
      this.chatService.saveNewPost(new Post(chat._id, this.comment.commentAvatarId,
        this.comment.commentBody))
        .subscribe(data => {
          if (data.status != null) {
            alert(data.message);
          } else {
            this.viewSelectedChat = data;
            this.sortChatsAndPosts(this.viewSelectedChat);
            this.comment = null;
          }
        },
        err => { },
        () => { console.log('Request Complete: Save new post') })
      return;
    }
  }

  removeChatLike(chat) {
    chat.isLiked = false;
    let maxlikes = chat.likes.length;
    for (var x = 0; x < maxlikes; x++) {
      if (this.currentAvatar.id == chat.likes[x]
        || chat.likes[x].user == this.user) {
        chat.likes.splice(x, 1);
        break;
      }
    }
    this.chatService.updateChat(chat)
      .map(res => res.json())
      .subscribe(data => {
        if (data.status == 'failed'
          || data.status == 'error') {
        } else {
          chat = data;
          chat.isLiked = false;
          this.sortChatsAndPosts(chat);
        }
      })
  }


  createNewChatlike(chat) {
    chat.isLiked = true;
    let maxlikes = chat.likes.length;
    chat.likes.push(this.currentAvatar.id);
    this.chatService.updateChat(chat)
      .map(res => res.json())
      .subscribe(data => {
        if (data.status == 'failed'
          || data.status == 'error') {
          alert(data.message)
        } else {
          chat = data;
          chat.isLiked = true;
          this.sortChatsAndPosts(chat);
        }
      })
  }

  unreportChat(chat: any) {
    chat.isReported = false;
    let reportsMax = chat.reports.length;
    for (var x = 0; x < reportsMax; x++) {
      if (chat.reports[x].user === this.user ||
        chat.reports[x] === this.currentAvatar.id) {
        chat.reports.splice(x, 1);
        break;
      }
    }
    this.chatService.updateChat(chat)
      .map(res => res.json())
      .subscribe(data => {
        chat = data;
        chat.isReported = false;
        this.sortChatsAndPosts(chat);
      })
  }

  reportChat(chat: any) {
    chat.isReported = true;
    chat.reports.push(this.currentAvatar.id);
    this.chatService.updateChat(chat)
      .map(res => res.json())
      .subscribe(data => {
        chat = data;
        chat.isReported = true;
        this.sortChatsAndPosts(chat);
      })
  }
}