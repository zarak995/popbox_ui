import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { User } from '../../../models/user';
import { RegisterComponent } from '../register/register.component'
import { from } from 'rxjs/observable/from';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})

export class LoginComponent implements OnInit {
  constructor(private loginService: LoginService, private router: Router, private reg: RegisterComponent) { }
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
      'password': new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9!@#$%^& *?]+$/i)])
    });
  }

  forbiddenValueValidator(value: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const forbidden = value.test(control.value);
      return forbidden ? { 'forbidden': { value: control.value } } : null;
    };
  }

  DisplayRegisterPage() {
    let modal = document.getElementsByClassName('secondMainSection') as HTMLCollectionOf<HTMLElement>;
    if (modal.length != 0) {
      modal[0].style.display = "block";
    }

    let login = document.getElementsByClassName('firstMainSection') as HTMLCollectionOf<HTMLElement>;
    if (login.length != 0) {
      login[0].style.display = "none";
    }
  }

  authenticate() {
    this.body.username = this.loginForm.get('username').value;
    this.body.password = this.loginForm.get('password').value;
    this.loginService.isUserValid(this.body)
      .subscribe(
      data => {
        if (data.code === "401") {
          alert("Your account has not been verified yet");
          this.reg.verify_id = data.uid;
          this.reg.verificationCodeModal();
        }
        else if (data.token) {
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

  showPassword(){
    let modal = document.getElementById('login_txtpassword');
    if (modal.attributes.getNamedItem('type').value === 'password') {
      modal.attributes.getNamedItem('type').value = 'text';
      return;
    }
    modal.attributes.getNamedItem('type').value="password";
  }
}
