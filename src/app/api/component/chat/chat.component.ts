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
      this.getChats();
      this.getAvatars();
    } else {
      this.router.navigate(['']);
    }
  }

  viewOneChat(chat: any) {
    this.chatservice.getOneChat(this.headers, chat)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
      })
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
  }
  createNewAvatar() {
    this.avatar = new Avatar(null, this.newAvatarName, this.id);
    this.chatservice.saveNewAvatar(this.avatar, this.headers, this.id)
      .map(res => res.json())
      .subscribe(data => console.log(data))
    this.getAvatars();
    this.closeModal();
  }

  createNewPost(chat: any) {
    debugger;
    this.message = "";
    if (this.postBody.chatId === chat._id) {
      let max = this.listOfChats.length;
      for (var x = 0; x < max; x++) {
        if (this.listOfChats[x]._id == chat._id) {
          let postMax = this.listOfChats[x].post.length;
          if (this.listOfChats[x].owner.user == this.id) {
            this.post = new Post(this.postBody.chatId, this.listOfChats[x].owner._id, this.postBody.body, Date.now);
            this.chatservice.saveNewPost(this.post, this.headers)
              .map(res => res.json())
              .subscribe((data) => {
                this.chatservice.getOneChat(this.headers, data)
                  .map(res => res.json())
                  .subscribe(data => {
                    let max = this.listOfChats.length;
                    for (var i = 0; i < this.listOfChats.length; i++) {
                      if (this.listOfChats[i]._id === data._id) {
                        this.listOfChats[i].post = data.post;
                        let cmax = this.listOfChats[i].post.length;
                        for (var k = 0; k < cmax; k++) {
                          this.listOfChats[i].post[k].createdDate = moment(this.listOfChats[i].post[k].createdDate).fromNow();
                        }
                      }
                    }
                    return;
                  })
                return;
              });
          }
          else if (postMax < 0) {
            this.post = new Post(this.postBody.chatId, this.currentAvatar.id, this.postBody.body, Date.now);
            this.chatservice.saveNewPost(this.post, this.headers)
              .map(res => res.json())
              .subscribe((data) => {
                this.chatservice.getOneChat(this.headers, data)
                  .map(res => res.json())
                  .subscribe(data => {
                    let max = this.listOfChats.length;
                    for (var i = 0; i < this.listOfChats.length; i++) {
                      if (this.listOfChats[i]._id === data._id) {
                        this.listOfChats[i].post = data.post;
                        let cmax = this.listOfChats[i].post.length;
                        for (var k = 0; k < cmax; k++) {
                          this.listOfChats[i].post[k].createdDate = moment(this.listOfChats[i].post[k].createdDate).fromNow();
                        }
                      }
                    }
                    return;
                  })
                return;
              });
          } else if (postMax > 0) {
            for (var y = 0; y < postMax; y++) {
              if (this.listOfChats[x].post[y].avatar.user === this.id) {
                this.post = new Post(this.postBody.chatId, this.listOfChats[x].post[y].avatar._id, this.postBody.body, Date.now);
                this.chatservice.saveNewPost(this.post, this.headers)
                  .map(res => res.json())
                  .subscribe((data) => {
                    this.chatservice.getOneChat(this.headers, data)
                      .map(res => res.json())
                      .subscribe(data => {
                        let max = this.listOfChats.length;
                        for (var i = 0; i < this.listOfChats.length; i++) {
                          if (this.listOfChats[i]._id === data._id) {
                            this.listOfChats[i].post = data.post;
                            let cmax = this.listOfChats[i].post.length;
                            for (var k = 0; k < cmax; k++) {
                              this.listOfChats[i].post[k].createdDate = moment(this.listOfChats[i].post[k].createdDate).fromNow();
                            }
                          }
                        }
                        return;
                      })
                    return;
                  });
                break;
              } else if (y == postMax - 1) {
                debugger;
                this.post = new Post(this.postBody.chatId, this.currentAvatar.id, this.postBody.body, Date.now);
                this.chatservice.saveNewPost(this.post, this.headers)
                  .map(res => res.json())
                  .subscribe((data) => {
                    this.chatservice.getOneChat(this.headers, data)
                      .map(res => res.json())
                      .subscribe(data => {
                        let max = this.listOfChats.length;
                        for (var i = 0; i < this.listOfChats.length; i++) {
                          if (this.listOfChats[i]._id === data._id) {
                            this.listOfChats[i].post = data.post;
                            let cmax = this.listOfChats[i].post.length;
                            for (var k = 0; k < cmax; k++) {
                              this.listOfChats[i].post[k].createdDate = moment(this.listOfChats[i].post[k].createdDate).fromNow();
                            }
                          }
                        }
                        return;
                      })
                    return;
                  });
                break;
              }
            }

          }
          break;
        }
      }
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
    let max = this.listOfChats.length;
    for (var i = 0; i < max; i++) {
      if (this.listOfChats[i]._id === chatID) {
        let maxLikes = this.listOfChats[i].likes.length;
        if (maxLikes == 0) {
          /*for (var x = 0; x < maxLikes; x++) {
            if (this.listOfChats[i].likes[x].user == this.id) {
              break;
            }
          }
          break;*/
          this.listOfChats[i].likes.push(this.currentAvatar.id);
          console.log(this.listOfChats[i]);
          this.chatservice.saveNewChatlike(this.listOfChats[i], this.headers)
            .map(res => res.json())
            .subscribe(data => {
              this.listOfChats[i] = data;
            });
        } else if (maxLikes > 0) {
          debugger;
          for (var j = 0; j < maxLikes; j++) {
            if (this.listOfChats[i].likes[j].user === this.id) {

              break;
            }
            else if (j == maxLikes - 1) {
              this.listOfChats[i].likes.push(this.currentAvatar.id);
              console.log(this.listOfChats[i]);
              this.chatservice.saveNewChatlike(this.listOfChats[i], this.headers)
                .map(res => res.json())
                .subscribe(data => {
                  this.listOfChats[i] = data;
                });
            }
          }
        }
        break;
      }
    }
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
  getProfile() {
    this.router.navigate(['/profile']);
  }
}