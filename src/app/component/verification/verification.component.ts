import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { LoginService } from '../login/login.service';
import { VerificationService } from './verification.service';
import { RegisterService } from '../register/register.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {
  constructor(private verificationService: VerificationService, private loginService:
    LoginService, private router: Router, private registerservice: RegisterService,
    private verForm: FormBuilder) { }

  verifyuserId: String = "";
  verificationForm: FormGroup;
  ngOnInit() {
    if (this.loginService.verifyId !== "") {
      this.verifyuserId = this.loginService.verifyId;
    } else if (this.registerservice.verifyId !== "") {
      this.verifyuserId = this.registerservice.verifyId;
    } else {
      alert('There was an error please login and validate your account');
      this.router.navigate(['/login']);
    }
    this.validateVerification();
  }

  validateVerification() {
    this.verificationForm = this.verForm.group({
      vercode: ['', [
        Validators.required,
        Validators.maxLength(5),
        Validators.minLength(4),
        Validators.pattern(/^[1-9][0-9]+$/i)
      ]]
    });
  }

  verfifyUser() {
    let data = {
      userId: this.verifyuserId,
      code: this.verificationForm.get('vercode').value
    }
    this.verificationService.verifyUser(data)
      .subscribe(
      data => {
        if (data.status == 'success') {
          alert(data.message);
          this.router.navigate(['/login']);
        } else {
          alert(data.message);
        }
      },
      err => { },
      () => console.log("Request Complete : User vefification"))
  }

  resendVercodeToSMS() {
    let data = {
      userId: '5a91a226b3aad7446dd314cf'
    }
    this.verificationService.resendVercodeAsSMS({ userId: this.loginService.verifyId })
      .subscribe(
      data => {
        if (data.status == 'failed' || data.status === 'error') {
          alert(data.message);
        } else if (data.status == 'success') {
          alert(data.message);
          this.router.navigate(['/login']);
        }

      },
      err => { },
      () => console.log("Request Complete : Verification code sent as SMS"))
  }

  resendVercodeToEMAIL() {
    alert(this.loginService.verifyId);
    this.verificationService.resendVercodeAsEmail({ userId: this.loginService.verifyId })
      .subscribe(
      data => {
        if (data.status === 'failed' || data.status === 'error') {
          alert(data.message);
        } else if (data.status === "success") {
          alert(data.message);
        }
      },
      err => { console.log(err) },
      () => console.log("Request Complete : Verification code sent Email"))
  }
}