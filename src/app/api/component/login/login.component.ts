import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { User } from '../../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})

export class LoginComponent implements OnInit {
  constructor(private loginService: LoginService, private router: Router) { }
  loginForm: FormGroup;
  username: String;
  password: String;
  body = {
    username: this.username,
    password: this.password
  };

  ngOnInit() {
    this.validateForm();
    if (this.loginService.isUserLoggedin()) {
      this.router.navigate(['/landing']);
    }
  }

  validateForm() {
    this.loginForm = new FormGroup({
      'username': new FormControl('', [Validators.required, Validators.pattern('[^ @]*@[^ @]*')]),
      'password': new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/i)])
    });
  }

  forbiddenValueValidator(value: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const forbidden = value.test(control.value);
      return forbidden ? { 'forbidden': { value: control.value } } : null;
    };
  }

  authenticate() {
    this.body.username = this.loginForm.get('username').value;
    this.body.password = this.loginForm.get('password').value;
    this.loginService.isUserValid(this.body)
      .subscribe(
      data => {
        if (data.token) {
          window.localStorage.setItem('token', data.token);
          window.localStorage.setItem('id', data.user);
          this.router.navigate(['/landing']);
        } else {
          alert(JSON.stringify(data));
          this.router.navigate(['']);
        }
      },
      err => console.log(err),
      () => console.log('request complete'));
  }
}
