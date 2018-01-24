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
import { isType } from '@angular/core/src/type';

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
  selectedChat: any = {};
  constructor(private http: Http, private loginService: LoginService,
    private router: Router, private chatservice: ChatService) {
  }
  loggedInUser: User;
  headers: Headers = new Headers({ 'content-type': 'application/json', 'authorization': this.token });

  elementScroll() {
    let chatDivs = document.getElementsByClassName('chat_card') as HTMLCollectionOf<HTMLElement>;
    let maxChatsDivs = chatDivs.length;
    if (maxChatsDivs != 0) {
      for (var x = 0; x < maxChatsDivs; x++) {
        chatDivs[x].scrollTop = chatDivs[x].scrollHeight;
      }
    }
  }

  ngOnInit() {
    if (this.loginService.isUserLoggedin()) {
      this.getChats();
      this.getAvatars();
      this.elementScroll()
    } else {
      this.router.navigate(['']);
    }
  }

  viewOneChat(chat: any) {

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

  sortChatsAndPosts(Posts: any) {
    for (var i = 0; i < Posts.length; i++) {
      Posts[i].createdDate = moment(Posts[i].createdDate).fromNow();
    }
    return Posts;
  }


  
  getTopChats() {
    let modal = document.getElementsByClassName('new-chat-as-header') as HTMLCollectionOf<HTMLElement>;
    if (modal.length != 0) {
      modal[0].style.display = "none";
    }

    this.listOfChats = [];
    this.chatservice.getTopChats(this.headers)
      .map(res => res.json())
      .subscribe(data => {
        data.forEach(element => {
          this.listOfChats.push(element);
        });
        this.listOfChats.forEach(element => {
          if (element.post !== null) {
            element.createdDate = moment(element.createdDate).fromNow();
            if (element.post.length > 0) {
              element.post = this.sortChatsAndPosts(element.post);
            }
          }

          let maxLikes = element.likes.length;
          for (var xl = 0; xl < maxLikes; xl++) {
            if (element.likes[xl].user === this.id) {
              element.isLiked = true;
            }
          }
        });
      })
  }
  getChats() {
    this.listOfChats = [];
    this.chatservice.getChats(this.headers)
      .map(res => res.json())
      .subscribe(data => {
        data.forEach(element => {
          this.listOfChats.push(element);
        });
        this.listOfChats.forEach(element => {
          if (element.post !== null) {
            element.createdDate = moment(element.createdDate).fromNow();
            if (element.post.length > 0) {
              element.post = this.sortChatsAndPosts(element.post);
            }
          }

          let maxLikes = element.likes.length;
          for (var xl = 0; xl < maxLikes; xl++) {
            if (element.likes[xl].user === this.id) {
              element.isLiked = true;
            }
          }
        });
      })
  }

  createNewAvatar() {
    debugger;
    this.avatar = new Avatar(null, this.newAvatarName, this.id);
    this.chatservice.saveNewAvatar(this.avatar, this.headers, this.id)
      .map(res => res.json())
      .subscribe(data => { })
    //Need to change this code below
    this.getAvatars();
    this.closeModal();
  }

  createNewPost(chat: any) {
    debugger;
    this.selectedChat = {};
    this.message = "";
    if (this.postBody.chatId === chat._id) {
      let max = this.listOfChats.length;
      for (var x = 0; x < max; x++) {
        if (this.listOfChats[x]._id === chat._id) {
          let maxPost = this.listOfChats[x].post.length;
          if (this.listOfChats[x].owner.user === this.id) {
            this.post = new Post(this.postBody.chatId, this.listOfChats[x].owner._id, this.postBody.body, Date.now);
          } else {
            this.post = new Post(this.postBody.chatId, this.currentAvatar.id, this.postBody.body, Date.now);
            for (var y = 0; y < maxPost; y++) {
              if (maxPost > 0 && this.listOfChats[x].post[y].avatar.user === this.id) {
                this.post = new Post(this.postBody.chatId, this.listOfChats[x].post[y].avatar._id, this.postBody.body, Date.now);
                break;
              }
            }
          }
          this.chatservice.saveNewPost(this.post, this.headers)
            .map(res => res.json())
            .subscribe((data) => {
              let max = this.listOfChats.length;
              for (var i = 0; i < max; i++) {
                if (this.listOfChats[i]._id === data._id) {
                  this.listOfChats[i] = data;
                  this.listOfChats[i].createdDate = moment(this.listOfChats[i].createdDate).fromNow();
                  let maxLikes = this.listOfChats[i].likes.length;
                  for (var xl = 0; xl < maxLikes; xl++) {
                    if (this.listOfChats[i].likes[xl].user === this.id) {
                      this.listOfChats[i].isLiked = true;
                    }
                  }
                  this.listOfChats[i].post.forEach(element => {
                    element.createdDate = moment(element.createdDate).fromNow();
                  });
                  //this.selectedChat = this.listOfChats[i];
                  break;
                }
              }
            });
          break;
        }
      }
    }
  }

  createNewChat() {
    debugger;
    this.chat = new Chat(this.chatBody, this.currentAvatar.id);
    this.chatservice.saveNewChat(this.chat, this.headers)
      .map(res => res.json())
      .subscribe(data => {
        if (data.post !== null) {
          data.createdDate = moment(data.createdDate).fromNow();
          if (data.post.length > 0) {
            data.post = this.sortChatsAndPosts(data.post);
          }
        }
        this.listOfChats.unshift(data);
      })
    this.chatBody = "";
    this.chatTitle = "";
    this.chat = null;
  }

  deleteChat(chat: any) {
    this.chatservice.removeChat(this.headers, chat._id)
      .map(res => res.json())
      .subscribe(data => {
        let chatl = this.listOfChats.length;
        for (var x = 0; x < chatl; x++) {
          if (this.listOfChats[x]._id === data._id) {
            this.listOfChats.splice(x, 1);
            return;
          }
        }
      });
  }

  deletePost(chatId: any, postId: any) {
    debugger;
    let max = this.listOfChats.length;
    for (var i = 0; i < max; i++) {
      if (this.listOfChats[i]._id === chatId) {
        let maxPosts = this.listOfChats[i].post.length;
        for (var j = 0; j < maxPosts; j++) {
          if (this.listOfChats[i].post[j]._id === postId) {
            this.listOfChats[i].post.splice(j, 1);
            this.chatservice.removePost(this.headers, this.listOfChats[i]._id, this.listOfChats[i].post[j]._id)
              .map(res => res.json())
              .subscribe(data => {
                this.listOfChats[i] = data;
                this.listOfChats[i].createdDate = moment(this.listOfChats[i].createdDate).fromNow(); this.listOfChats[i].post.forEach(element => {
                  element.createdDate = moment(element.createdDate).fromNow();
                });
              });
            break;
          }
        }
      }
    }
  }

  reportNewChat(chat: any) {
    debugger;
    console.log(chat);
    let max = this.listOfChats.length;
    for (var i = 0; i < max; i++) {
      if (this.listOfChats[i]._id === chat._id) {
        let maxLikes = this.listOfChats[i].reports.length;
        for (var j = 0; j < maxLikes; j++) {
          if (this.listOfChats[i].reports[j].user === this.id) {
            return;
          }
        }

        for (var k = 0; k < maxLikes; k++) {
          if (this.listOfChats[i].reports[k].id === this.currentAvatar.id) {
            return;
          }
        }

        this.listOfChats[i].reports.push(this.currentAvatar.id);
        this.chatservice.updateChat(this.listOfChats[i], this.headers)
          .map(res => res.json())
          .subscribe(data => {
            this.listOfChats[i] = data;
            this.listOfChats[i].createdDate = moment(this.listOfChats[i].createdDate).fromNow(); this.listOfChats[i].post.forEach(element => {
              element.createdDate = moment(element.createdDate).fromNow();
            });
          });
        break;
      }
    }
  }

  createNewChatlike(chatID: any) {
    debugger;
    let max = this.listOfChats.length;
    for (var i = 0; i < max; i++) {
      if (this.listOfChats[i]._id === chatID) {
        this.listOfChats[i].isLiked = true;
        let maxLikes = this.listOfChats[i].likes.length;
        this.listOfChats[i].likes.push(this.currentAvatar.id);
        this.chatservice.updateChat(this.listOfChats[i], this.headers)
          .map(res => res.json())
          .subscribe(data => {
            this.listOfChats[i] = data;
            this.listOfChats[i].isLiked = true;
            this.listOfChats[i].createdDate = moment(this.listOfChats[i].createdDate).fromNow(); this.listOfChats[i].post.forEach(element => {
              element.createdDate = moment(element.createdDate).fromNow();
            });
          });
        break;
      }
    }
  }

  postMessageChanged($event, chatId: any) {
    this.postBody.chatId = chatId;
    this.postBody.body = $event;
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

  openAvatarModal() {
    this.isAvatarModal = true;
    let modal = document.getElementsByClassName('modal') as HTMLCollectionOf<HTMLElement>;
    if (modal.length != 0) {
      modal[0].style.display = "block";
    }
  }

  openChatModal(chat) {
    console.log("open");
    this.selectedChat = chat;
    this.isChatModal = true;
    let modal = document.getElementsByClassName('chatModal') as HTMLCollectionOf<HTMLElement>;
    if (modal.length != 0) {
      modal[0].style.display = "block";
    }
  }

  closeChatModal() {
    this.selectedChat = {};
    let modal = document.getElementsByClassName('chatModal') as HTMLCollectionOf<HTMLElement>;
    if (modal.length != 0) {
      modal[0].style.display = "none";
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