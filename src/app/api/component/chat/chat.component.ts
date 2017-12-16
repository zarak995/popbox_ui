import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { LoginService } from '../login/login.service';
import { User } from '../../../models/user';
import { Post } from '../../../models/Post';
import { Avatar } from "../../../models/Avatar";
import { Chat } from "../../../models/Chat";
import { Router } from '@angular/router';
import { map } from 'rxjs/operator/map';
import { forEach } from '@angular/router/src/utils/collection';
import { log } from 'util';
import { element } from 'protractor';
import * as moment from 'moment';
import { DatePipe } from '@angular/common/src/pipes';
import { ChatService } from '../chat/chat.service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  isPostsNull: boolean = false;
  token: String = window.localStorage.getItem('token');
  id: String = window.localStorage.getItem('id');
  postBody = {
    chatId: "",
    body: ""
  }
  isAvatarModal = false;
  isChatModal = false;
  isChats: boolean = true;
  isModal: boolean = false;
  chatBody: String = "";
  chatTitle: String = "";
  post: Post;
  chat: Chat;
  avatar: Avatar;
  array: any = [];
  listOfChats: Chat[];
  listOfAvatars: Avatar[];
  newAvatarName: String = "";
  currentAvatar: Avatar;
  changedChat: String;
  message: String = "";
  constructor(private http: Http, private loginService: LoginService,
    private router: Router, private chatservice: ChatService) {

  }
  loggedInUser: User;
  headers: Headers = new Headers({ 'content-type': 'application/json', 'authorization': this.token });

  ngOnInit() {
    if (this.loginService.isUserLoggedin()) {
      //this.getData();
      this.getChats();
      this.getAvatars();
      console.log(this.listOfAvatars);
      console.log(this.listOfChats);
    } else {
      this.router.navigate(['']);
    }
  }
  getAvatars() {
    this.currentAvatar = null;
    this.listOfAvatars = [];
    this.chatservice.getAvatars(this.id, this.headers)
      .map(res => res.json())
      .subscribe(data => {
        data.forEach(element => {
          this.listOfAvatars.push(element);
          this.currentAvatar = new Avatar(element._id, element.name, element.user);
        });
      });
  }

  getChats() {
    this.listOfChats = [];
    this.chatservice.getChats(this.headers)
      .map(res => res.json())
      .subscribe(data => {
        data.forEach(element => {
          if (element.post !== null && element.post.length > 0) {
            for (var i = 0; i < element.post.length; i++) {
              element.post[i].createdDate = moment(element.post[i].createdDate).fromNow();
            }
          }
          this.listOfChats.push(element);
        });
      })
    console.log(this.listOfChats);
  }

  createNewAvatar() {
    this.avatar = new Avatar(null, this.newAvatarName, this.id);
    this.chatservice.saveNewAvatar(this.avatar, this.headers, this.id)
      .map(res => res.json())
      .subscribe(data => console.log(data))
    this.getAvatars();
    this.closeModal();
  }

  createNewPost(chatId: String) {
    this.message = "";
    if (this.postBody.chatId === chatId) {
      this.listOfChats.forEach(element => {
        if (element._id == chatId) {
          for (var x = 0; x < element.post.length; x++) {
            if (element.post[x].avatar.user === this.id) {
              element.post.push(new Post(chatId, { "name": element.post[x].avatar.name }, this.postBody.body, moment(Date.now()).fromNow()));
              this.post = new Post(this.postBody.chatId, element.post[x].avatar._id, this.postBody.body, Date.now);
              this.chatservice.saveNewPost(this.post, this.headers)
                .map(res => res.json())
                .subscribe(() => { });
              return;
            }
          }
          this.post = new Post(this.postBody.chatId, this.currentAvatar.id, this.postBody.body, Date.now);
          element.post.push(new Post(chatId, { "name": this.currentAvatar.name }, this.postBody.body, moment(Date.now()).fromNow()));
          this.chatservice.saveNewPost(this.post, this.headers)
            .map(res => res.json())
            .subscribe(() => { });
        }
      });
    }
  }

  createNewChat() {
    this.chat = new Chat(this.chatTitle, this.chatBody, this.currentAvatar.id);
    this.chatservice.saveNewChat(this.chat, this.headers)
      .map(res => res.json())
      .subscribe(data => console.log(data));
    this.getChats();
  }

  createNewChatlike(chatID: any) {
    this.listOfChats.forEach(element => {
      if (element._id == chatID) {
        for (var x = 0; x < element.likes.length; x++) {
          debugger;
          if (element.likes[x].user === this.id) {
            return;
          }
        }
        element.likes.push(this.currentAvatar.id);
        this.chatservice.saveNewChatlike(element, this.headers)
          .map(res => res.json())
          .subscribe(data => console.log('Chat updated'));
      }
    });
  }


  postMessageChanged($event, chatId: any) {
    this.postBody.chatId = chatId;
    this.postBody.body = $event;
  }

  openAvatarModal() {
    this.isAvatarModal = true;
    let modal = document.getElementsByClassName('modal') as HTMLCollectionOf<HTMLElement>;
    if (modal.length != 0) {
      modal[0].style.display = "block";
    }
  }

  colourPosts() {
    let post = document.getElementsByClassName('post') as HTMLCollectionOf<HTMLElement>;
    debugger;
    if (post.length != 0) {
      for (var i = 0; i < post.length; i++) {
        post[i].style.color = "yellow";
      }

    }
  }
  openChatModal() {
    this.isChatModal = true;
    let modal = document.getElementsByClassName('modal') as HTMLCollectionOf<HTMLElement>;
    if (modal.length != 0) {
      modal[0].style.display = "block";
    }
  }

  closeModal() {
    let modal = document.getElementsByClassName('modal') as HTMLCollectionOf<HTMLElement>;
    if (modal.length != 0) {
      modal[0].style.display = "none";
    }
  }

  logout() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('id');
    this.router.navigate(['']);
  }

  getProfile() {
    this.router.navigate(['/profile']);
  }
}