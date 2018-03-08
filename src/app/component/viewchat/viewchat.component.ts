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
  comment: String = "";
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
      },
      err => { },
      () => { console.log('Request Complete: Get selected chat') })
  }

  createNewPost() {
    this.chatService.saveNewPost(new Post(this.viewSelectedChat._id, '5a933aea35457b50ade40bfd', this.comment))
      .subscribe(data => {
        this.viewSelectedChat = data;
      },
      err => { },
      () => { console.log('Request Complete: Save new post') })
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
          chat.createdDate = moment(this.viewSelectedChat.createdDate).fromNow();
          chat.post.forEach(element => {
            element.createdDate = moment(element.createdDate).fromNow();
          })
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
          chat.createdDate = moment(chat.createdDate).fromNow();
          chat.post.forEach(element => {
            element.createdDate = moment(element.createdDate).fromNow();
          })
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
        chat.createdDate = moment(chat.createdDate).fromNow();
        chat.post.forEach(element => {
          element.createdDate = moment(element.createdDate).fromNow();
        });
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
        chat.createdDate = moment(chat.createdDate).fromNow();
        chat.post.forEach(element => {
          element.createdDate = moment(element.createdDate).fromNow();
        });
      })
  }
}