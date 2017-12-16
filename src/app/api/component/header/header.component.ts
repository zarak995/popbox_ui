import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, public http: Http) { }
  token: String = window.localStorage.getItem('token');
  loggedInUser: User;
  headers: Headers = new Headers({ 'content-type': 'application/json', 'authorization': this.token });
  id: String = window.localStorage.getItem('id');
  ngOnInit() {
    this.getData();
  }
  getData() {
    this.loggedInUser = new User();
    this.http.options('http://localhost:3000/users/' + this.id, {
      method: 'GET',
      headers: this.headers
    }).map(res => res.json())
      .subscribe(data => {
        this.loggedInUser = {
          id: data._id, name: data.name,
          password: data.password, email: data.email, date_of_birth: data.date_of_birth,
          occupation: data.occupation, gender: data.gender
        };
      });
  }

  logout() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('id');
    this.router.navigate(['']);
  }

}
