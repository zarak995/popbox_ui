import { Component, OnInit } from '@angular/core';
import { LeftnavService } from './leftnav.service';
import { Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { ChatService } from '../chat/chat.service';
import { setInterval } from 'timers';


@Component({
  selector: 'app-leftnav',
  templateUrl: './leftnav.component.html',
  styleUrls: ['./leftnav.component.css']
})
export class LeftnavComponent implements OnInit {
  isChatModal = false;
  constructor(private leftnavService: LeftnavService, private chatService: ChatService) { }
  token: String = window.localStorage.getItem('token');
  headers: Headers = new Headers({ 'content-type': 'application/json', 'authorization': this.token });
  listOfTopChats = [];

  ngOnInit() {
    this.getTopChats();
    setInterval(() => {
      this.getTopChats();
    }, 60000);
  }

  getTopChats() {
    this.listOfTopChats = [];
    this.leftnavService.getTopChats(this.headers)
      .map(res => res.json())
      .subscribe(data => {
        data.forEach(element => {
          this.listOfTopChats.push(element);
        });
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
