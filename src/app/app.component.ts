import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common/src/pipes/date_pipe';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) { }
  ngOnInit() {
    this.changeBackground();
    this.router.navigate(['/landing'])
  }

  changeBackground() {
    let myD = new Date();
    myD.getTime()
    if (myD.getHours() > 21 && myD.getMinutes() >= 17) {
      let modal = document.getElementsByClassName('mainDiv2') as HTMLCollectionOf<HTMLElement>;
      if (modal.length != 0) {
        modal[0].style.backgroundImage = '../assets/maxresdefault.jpg';
      }
    }
  }

  
}
