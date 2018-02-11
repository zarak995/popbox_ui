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
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

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
  newPassword: String = "";
  oldPassword: String = "";
  loggedInUser: User;
  isShowChangepassword = false;
  isAvatarModal: Boolean = false;
  isChatModal: Boolean = false;
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
  isMobileLanding: Boolean = true;
  isMobileTrending: Boolean = false;
  isMobileUserChats: Boolean = false;
  isReported: Boolean = true;
  isProfileSet: Boolean = false;
  updateProfileForm: FormGroup;
  changePasswordForm: FormGroup;

  constructor(private http: Http, private loginService: LoginService,
    private router: Router, private chatservice: ChatService) {
  }
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
      this.getData();
      this.getCurrentAvatar();
      this.getChats();
      this.elementScroll()
      this.validateChangePasswordForm();
      this.confirmPasswordChange();
      setTimeout(() => {
        this.validateUpdateForm();
      }, 3000)
    } else {
      this.router.navigate(['']);
    }
  }

  viewOneChat(chat: any) {

  }

  sortChatsAndPosts(Posts: any) {
    for (var i = 0; i < Posts.length; i++) {
      Posts[i].createdDate = moment(Posts[i].createdDate).fromNow();
    }
    return Posts;
  }

  getCurrentAvatar() {
    this.chatservice.getCurrentAvatar(this.id, this.headers)
      .map(data => data.json())
      .subscribe(data => {
        data.forEach(element => {
          this.currentAvatar = {
            id: element._id, name: element.name, user: element.user
          }
        });
      })
  }
  getTopChats() {
    this.isMobileLanding = false;
    this.isMobileTrending = true;
    this.isMobileUserChats = false;

    /*let modal = document.getElementsByClassName('new-chat-as-header') as HTMLCollectionOf<HTMLElement>;
    if (modal.length != 0) {
      modal[0].style.display = "none";
    }*/

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

  getUserChat() {
    this.isMobileLanding = false;
    this.isMobileTrending = false;
    this.isMobileUserChats = true;

    /*let modal = document.getElementsByClassName('new-chat-as-header') as HTMLCollectionOf<HTMLElement>;
    if (modal.length != 0) {
      modal[0].style.display = "none";
    }*/

    this.listOfChats = [];
    this.chatservice.getUserChats(this.headers, this.id)
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
              break;
            }
          }

          let maxReports = element.reports.length;
          for (var xl = 0; xl < maxReports; xl++) {
            if (element.reports[xl].user === this.id) {
              element.isReported = true;
              break;
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
              break;
            }
          }

          let maxReports = element.reports.length;
          for (var xl = 0; xl < maxReports; xl++) {
            if (element.reports[xl].user === this.id) {
              element.isReported = true;
              break;
            }
          }
        });
      })
  }

  createNewAvatar() {
    this.avatar = new Avatar(this.newAvatarName, this.id);
    if (this.avatar !== null) {
      this.chatservice.saveNewAvatar(this.avatar, this.headers, this.id)
        .map(res => res.json())
        .subscribe(data => {
          this.currentAvatar = { id: data._id, name: data.name, user: data.user }
        });
      this.newAvatarName = "";
      this.closeModal();
    }
  }

  createNewPost(chat: any) {
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
                  this.selectedChat = this.listOfChats[i];
                  var chat_modal_input = document.getElementById('chat-modal-input')
                  break;
                }
              }
            });
          this.isChatModal = true;
          break;
        }
      }
    }
  }

  createNewChat() {

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
            if (this.isChatModal === true) {
              this.isChatModal = false;
            }
            return;
          }
        }
      });
  }

  deletePost(chatId: any, postId: any) {
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

  reportChat(chat: any) {
    chat.isReported = true;
    chat.reports.push(this.currentAvatar.id);
    this.chatservice.updateChat(chat, this.headers)
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
  createNewChatlike(chatID: any) {
    let max = this.listOfChats.length;
    for (var i = 0; i < max; i++) {
      if (this.listOfChats[i]._id === chatID) {
        this.listOfChats[i].isLiked = true;
        this.listOfChats[i].likes.push(this.currentAvatar.id);
        this.chatservice.updateChat(this.listOfChats[i], this.headers)
          .map(res => res.json())
          .subscribe(data => {
            this.listOfChats[i] = data;
            this.listOfChats[i].isLiked = true;
            this.listOfChats[i].createdDate = moment(this.listOfChats[i].createdDate).fromNow();

            this.listOfChats[i].post.forEach(element => {
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

  saveNewPassword() {
    let data = {
      password: this.changePasswordForm.get('opass').value,
      newPassword: this.changePasswordForm.get('pass').value
    }
    this.chatservice.changePassword(this.headers, this.id, data)
      .map(res => res.json())
      .subscribe(data => {
        alert(data);
      })
  }

  saveUpdateProfile() {
    if (this.updateProfileForm.get('email').value == this.loggedInUser.email
      && this.updateProfileForm.get('occupation').value == this.loggedInUser.phone
      && this.updateProfileForm.get('phone').value == this.loggedInUser.phone) {
      alert("No updates were saved");
    }
    else if (this.updateProfileForm.get('email').value !== this.loggedInUser.email
      || this.updateProfileForm.get('occupation').value !== this.loggedInUser.phone
      || this.updateProfileForm.get('phone').value !== this.loggedInUser.phone) {
      this.loggedInUser.email = this.updateProfileForm.get('email').value;
      this.loggedInUser.phone = this.updateProfileForm.get('phone').value;
      this.loggedInUser.occupation = this.updateProfileForm.get('occupation').value;
      this.chatservice.updateProfile(this.headers, this.id, this.loggedInUser)
        .map(res => res.json())
        .subscribe(data => {
          if (data.code == "11000") {
            alert("Please use a different email or phone");
            return
          }
          alert("Profile has been updated");
        })
      this.getData();
    }
  }

  getData() {
    this.loggedInUser = new User();
    this.chatservice.getUserData(this.headers, this.id)
      .map(res => res.json())
      .subscribe(data => {
        this.loggedInUser = {
          id: data._id, name: data.name,
          password: data.password, email: data.email, dateOfBirth: data.dateOfBirth,
          occupation: data.occupation, gender: data.gender, phone: data.phone, isShowReported: data.isShowReported
        };
      });
  }

  openAvatarModal() {
    this.isAvatarModal = true;
    let modal = document.getElementsByClassName('modal') as HTMLCollectionOf<HTMLElement>;
    if (modal.length != 0) {
      modal[0].style.display = "block";
    }
  }

  openChatModal(chat) {
    this.selectedChat = chat;
    this.isChatModal = !this.isChatModal;
    let modal = document.getElementsByClassName('chatModal') as HTMLCollectionOf<HTMLElement>;
    if (modal.length != 0) {
      modal[0].style.display = "block";
    }
  }
  openProfileModal() {
    this.validateUpdateForm();
    let modal = document.getElementsByClassName('profile-modal') as HTMLCollectionOf<HTMLElement>;
    if (modal.length != 0) {
      modal[0].style.display = "block";
    }
  }

  closeChatModal() {
    this.selectedChat = {};
    this.isChatModal = !this.isChatModal
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

  validateUpdateForm() {
    this.updateProfileForm = new FormGroup({
      'email': new FormControl(this.loggedInUser.email, [Validators.pattern('[^ @]*@[^ @]*')]),
      'phone': new FormControl(this.loggedInUser.phone, [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern(/^[+][0-9]+$/i)]),
      'occupation': new FormControl(this.loggedInUser.occupation, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z a-zA-Z]+$/i)]),
    })
  }

  validateChangePasswordForm() {
    this.changePasswordForm = new FormGroup({
      'opass': new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9!@#$%^&*?]+$/i)]),
      'pass': new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9!@#$%^&*?]+$/i)]),
      'cpass': new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9!@#$%^&*?]+$/i)])
    })
  }
  
  showPassword() {
    let updateFrmPass = document.getElementById('pass');
    let updateFrmCPass = document.getElementById('cpass');
    let updateFrmOPass = document.getElementById('opass');
    if (updateFrmPass.attributes.getNamedItem('type').value === 'password') {
      updateFrmPass.attributes.getNamedItem('type').value = 'text';
      updateFrmCPass.attributes.getNamedItem('type').value = 'text';
      updateFrmOPass.attributes.getNamedItem('type').value = 'text';
      return;
    }
    updateFrmOPass.attributes.getNamedItem('type').value = 'password';
    updateFrmPass.attributes.getNamedItem('type').value = "password";
    updateFrmCPass.attributes.getNamedItem('type').value = 'password';
  }
  confirmPasswordChange() {
    this.changePasswordForm.get('cpass').valueChanges.subscribe(change => {
      if (this.changePasswordForm.get('pass').value !== change) {
        this.changePasswordForm.controls['cpass'].setErrors({ 'incorrect': true });
      }
    })
  }
}