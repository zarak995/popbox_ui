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

  getChats() {
    this.listOfChats = [];
    this.chatservice.getChats(this.headers)
      .map(res => res.json())
      .subscribe(data => {
        data.forEach(element => {
          this.listOfChats.push(element);
        });
        this.listOfChats = this.listOfChats.reverse();
        this.listOfChats.forEach(element => {
          if (element.post !== null) {
            element.createdDate = moment(element.createdDate).fromNow();
            if (element.post.length > 0) {
              element.post = this.sortChatsAndPosts(element.post);
            }

          }
        });
      })
  }
  createNewAvatar() {
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
    this.message = "";
    if (this.postBody.chatId === chat._id) {
      let max = this.listOfChats.length;
      for (var x = 0; x < max; x++) {
        if (this.listOfChats[x]._id === chat._id) {
          let maxPost = this.listOfChats[x].post.length;
          if (this.listOfChats[x].owner._id === this.id) {
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
              for (var i = 0; i < this.listOfChats.length; i++) {                
                if (this.listOfChats[i]._id === data._id) {
                  this.listOfChats[i] = data;
                  this.listOfChats[i].createdDate = moment(this.listOfChats[i].createdDate).fromNow()
                  this.listOfChats[i].post.forEach(element => {
                    element.createdDate = moment(element.createdDate).fromNow();
                  });
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
    this.chat = new Chat(this.chatTitle, this.chatBody, this.currentAvatar.id);
    console.log(this.chat);
    this.chatservice.saveNewChat(this.chat, this.headers)
      .map(res => res.json())
      .subscribe(data => {
        this.listOfChats.push(data)
      })
  }

  createNewChatlike(chatID: any) {
    let max = this.listOfChats.length;
    for (var i = 0; i < max; i++) {
      if (this.listOfChats[i]._id === chatID) {
        let maxLikes = this.listOfChats[i].likes.length;
        for (var j = 0; j < maxLikes; j++) {
          if (this.listOfChats[i].likes[j].user === this.id) {
            return;
          }
        }
        this.listOfChats[i].likes.push(this.currentAvatar.id);
        this.chatservice.saveNewChatlike(this.listOfChats[i], this.headers)
          .map(res => res.json())
          .subscribe(data => {
            this.listOfChats[i] = data;
            this.listOfChats[i].createdDate = moment(this.listOfChats[i].createdDate).fromNow();            this.listOfChats[i].post.forEach(element => {
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
  openChatModal(chat) {
    this.selectedChat = chat;
    this.isChatModal = true;
    let modal = document.getElementsByClassName('chatModal') as HTMLCollectionOf<HTMLElement>;
    if (modal.length != 0) {
      modal[0].style.display = "block";
    }
  }

  closeChatModal() {
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