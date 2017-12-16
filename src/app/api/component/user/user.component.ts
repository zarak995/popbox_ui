import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    if (this.loginService.isUserLoggedin()) {
      this.getCurrentUserData();
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['']);
    }
  }

  getCurrentUserData() {

  }
}
