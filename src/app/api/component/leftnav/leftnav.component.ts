import { Component, OnInit } from '@angular/core';
import { LeftnavService } from './leftnav.service';
import { Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { ChatService } from '../chat/chat.service';
import { setInterval } from 'timers';
import { Chat } from '../../../models/Chat';

@Component({
  selector: 'app-leftnav',
  templateUrl: './leftnav.component.html',
  styleUrls: ['./leftnav.component.css']
})
export class LeftnavComponent implements OnInit {
  isChatModal = false;
  constructor(private leftnavService: LeftnavService, private chatService: ChatService) { }
  token: String = window.localStorage.getItem('token');
  id: String = window.localStorage.getItem('id');
  headers: Headers = new Headers({ 'content-type': 'application/json', 'authorization': this.token });
  listOfTopChats: Chat[] = [];
  listOfUserChats: Chat[] = [];

  ngOnInit() {
    this.getTopChats();
    this.getUserChats();
    setInterval(() => {
      this.getUserChats();
      this.getTopChats();
    }, 60000);
  }

  getUserChats() {
    this.listOfUserChats = [];
    this.leftnavService.getUserChats(this.headers, this.id)
      .map(res => res.json())
      .subscribe(data => {
        if (data.length > 0) {
          for (var x = 0; x < data.length  && x < 3; x++) {
            this.listOfUserChats.push(data[x]);          
          }
        }
      })
  }

  getTopChats() {
    this.listOfTopChats = [];
    this.leftnavService.getTopChats(this.headers)
      .map(res => res.json())
      .subscribe(data => {
        for (var x = 0; x < 3; x++) {
          this.listOfTopChats.push(data[x]);
        }
      })
  }

  openChatModal() {
    this.isChatModal = true;
    let modal = document.getElementsByClassName('chatModal') as HTMLCollectionOf<HTMLElement>;
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
}