import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chat } from '../../models/Chat';
import { Post } from '../../models/Post';
import { LandingService } from './landing.service';
import { ViewchatService } from '../viewchat/viewchat.service';
import { ChatService } from '../chat.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Avatar } from '../../models/Avatar';
import { AvatarService } from '../avatar.service';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  constructor(private router: Router, private viewChatService: ViewchatService,
    private avatarService: AvatarService, private landingService: LandingService, private chatService: ChatService,
    private fr: FormBuilder) { }
  token = window.localStorage.getItem("accesstoken");
  user = window.localStorage.getItem('accesstoken_pcs1');
  listAllChats: Chat[];
  message: String = '';
  chat: Chat;
  chatBody: String = '';
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

  newAvatarName: String = "";
  avatarForm: FormGroup;
  isTrue = false
  viewSelectedChat: Chat;
  avatar: Avatar;

  ngOnInit() {
    if (this.token == null) {
      this.router.navigate(['/login']);
    } else {
      this.getAllChats();
      this.getCurrentAvatar();
    }
    this.validateNewAvatar(); 
  }

  validateNewAvatar() {
    this.avatarForm = this.fr.group({
      avatarName: ['', [Validators.required]]
    })
  }

  postMessageChanged(event, chat) {
    this.comment.commentBody = event;
    this.comment.chatId = chat._id;
    this.comment.commentAvatarId = this.currentAvatar.id;
  }
  
  createNewPost(chat) {
    var maxPosts = chat.post.length;
    debugger;
    for (var x = 0; x < maxPosts; x++) {
      if (chat.owner.user == this.user) {
        this.comment.commentAvatarId = chat.owner._id;
        break;
      }

      if (chat.post[x].avatar.user === this.user) {
        this.comment.commentAvatarId = chat.post[x].avatar._id;
        break;
      }


    }

    if (chat._id === this.comment.chatId
      && this.comment.commentBody != "") {
      this.chatService.saveNewPost(new Post(chat._id, this.comment.commentAvatarId,
        this.comment.commentBody))
        .subscribe(data => {
          if (data.status != null) {
            alert(data.message);
          } else {
            let max = this.listAllChats.length;
            for (var x = 0; x < max; x++) {
              if (this.listAllChats[x]._id === data._id) {
                this.listAllChats[x] = data;
                this.sortChatsAndPosts(this.listAllChats[x]);
                break;
              }
            }
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
          this.sortChatsAndPosts(chat)
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
        this.sortChatsAndPosts(chat)
      },
      err => { },
      () => { })
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

  createNewChat() {
    if (this.chatBody) {
      this.chat = new Chat(this.chatBody, this.currentAvatar.id);
      this.chatService.saveNewChat(this.chat)
        .subscribe(data => {
          if (data.status != null) {
            alert(data.message);
          } else {
            this.sortChatsAndPosts(data);
          }
          this.listAllChats.unshift(data);
        },
        err => { },
        () => { })
      this.chatBody = "";
      this.chat = null;
    }
  }

  createNewAvatar() {
    if (this.newAvatarName != "") {
      this.avatar = new Avatar(this.newAvatarName, this.user);
      if (this.avatar !== null) {
        this.avatarService.saveNewAvatar(this.avatar, this.user)
          .map(res => res.json())
          .subscribe(data => {
            this.currentAvatar = { id: data._id, name: data.name, user: data.user }
          });
        this.newAvatarName = "";
        this.getCurrentAvatar();
        this.openCloseAvatarModal();
      }
    }
  }

  getAllChats() {
    this.listAllChats = [];
    this.chatService.getChats()
      .subscribe(data => {
        data.forEach(element => {
          this.listAllChats.push(element);
        });
        this.listAllChats.forEach(element => {
          this.sortChatsAndPosts(element);
          let maxLikes = element.likes.length;
          for (var xl = 0; xl < maxLikes; xl++) {
            if (element.likes[xl].user === this.user) {
              element.isLiked = true;
              break;
            }
          }
          let maxReports = element.reports.length;
          for (var xl = 0; xl < maxReports; xl++) {
            if (element.reports[xl].user === this.user) {
              element.isReported = true;
              break;
            }
          }
        });
      },
      err => { },
      () => { })
  }

  viewOneChat(chat) {
    this.viewChatService.viewchatid = chat._id
    this.router.navigate(['/post']);
  }

  getCurrentAvatar() {
    this.avatarService.getCurrentAvatar(this.user)
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

  openCloseAvatarModal() {
    let modal = document.getElementById('modal')
    if (modal.style.display == "none"
      || modal.style.display == "") {
      modal.style.display = "block";
      return;
    }
    this.newAvatarName = "";
    modal.style.display = "none";
  }
}