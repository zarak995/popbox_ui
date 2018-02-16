import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { User } from '../../../models/user';
import { RegisterService } from '../../component/register/register.service';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { ToastsManager } from "ng2-toastr";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [RegisterService]

})
export class RegisterComponent implements OnInit {
  constructor(private registerService: RegisterService, private router: Router) { }
  newuser: User = new User();
  months = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
    { value: 6 },
    { value: 7 },
    { value: 8 },
    { value: 9 },
    { value: 10 },
    { value: 11 },
    { value: 12 }
  ];

  selectedDay: number;
  selectedMonths: string;
  selectedYear: number;
  registerForm: FormGroup;
  days: number[] = [];
  years: number[] = [];
  verify_id: String = "";
  verificatioCode: string = "";
  confirmPassword: String = "";
  ngOnInit() {
    this.populateDays();
    this.populateYears();
    this.validateForm();
    this.confirmPasswordChange();
  }

  populateDays() {
    this.days = [];
    for (let index = 1; index <= 31; index++) {
      this.days.push(index);
    }
  }

  populateYears() {
    this.years = [];
    for (let index = 2017; index >= 1939; index--) {
      this.years.push(index);
    }
  }

  validateForm() {
    this.registerForm = new FormGroup({
      'email': new FormControl('', [Validators.pattern('[^ @]*@[^ @]*')]),
      'name': new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z a-zA-Z]+$/i)]),
      'pass': new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9!@#$%^&*?]+$/i)]),
      'cpass': new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9!@#$%^&*?]+$/i)]),
      'occupation': new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z a-zA-Z]+$/i)]),
      'gender': new FormControl('', [Validators.required, this.forbiddenValueValidator(/--Select Gender--/i)]),
      'year': new FormControl('', [Validators.required, this.forbiddenValueValidator(/--Year--/i)]),
      'month': new FormControl('', [Validators.required, this.forbiddenValueValidator(/--Month--/i)]),
      'day': new FormControl('', [Validators.required, this.forbiddenValueValidator(/--Day--/i)]),
      'phone': new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern(/^[+][0-9]+$/i)])
    });
  }

  forbiddenValueValidator(value: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const forbidden = value.test(control.value);
      return forbidden ? { 'forbidden': { value: control.value } } : null;
    };
  }

  confirmPasswordChange() {
    this.registerForm.get('cpass').valueChanges.subscribe(change => {
      if (this.registerForm.get('pass').value !== change) {
        this.registerForm.controls['cpass'].setErrors({ 'incorrect': true });
      }
    })
  }

  showPassword() {
    let regPass = document.getElementById('pass');
    let regCPass = document.getElementById('cpass');
    if (regPass.attributes.getNamedItem('type').value === 'password') {
      regPass.attributes.getNamedItem('type').value = 'text';
      regCPass.attributes.getNamedItem('type').value = 'text';
      return;
    }
    regPass.attributes.getNamedItem('type').value = "password";
    regCPass.attributes.getNamedItem('type').value = 'password';
  }
  addNewUser() {
    alert("something");
    this.confirmPasswordChange();
    if (this.registerForm.valid && this.registerForm.get('pass').value === this.registerForm.get('cpass').value) {
      this.newuser = new User();
      this.newuser.email = this.registerForm.get('email').value;
      this.newuser.name = this.registerForm.get('name').value;
      this.newuser.password = this.registerForm.get('pass').value;
      this.newuser.occupation = this.registerForm.get('occupation').value;
      this.newuser.gender = this.registerForm.get('gender').value;
      this.newuser.phone = this.registerForm.get('phone').value;
      this.newuser.dateOfBirth = new Date();
      this.newuser.dateOfBirth.setFullYear(this.registerForm.get('year').value,
        this.registerForm.get('month').value, this.registerForm.get('day').value);
      this.registerService.registerNewUser(this.newuser)
        .subscribe(
        data => {
          if (data.code === '11000') {
            alert(JSON.stringify(data.message));
          } else {
            alert("your account has been created. Please login");
            alert(JSON.stringify(data));
            this.verify_id += data;
            this.verificationCodeModal();
          }
        },
        err => console.log(err),
        () => console.log('Request Add New user Complete'));
    } else {
      alert("ensure that all fields are valid");
    }
  }
  resendToUserEmail() {
    this.registerService.resendToEmail(this.verify_id)
      .subscribe((data) => { console.log(data) })
  }

  resendToUserPhone() {
    alert("sent to phone");
  }

  verificationCodeModal() {
    if(this.registerService.verify_id!=" "){
      alert("This is verify idea from reg comp "+ this.registerService.verify_id);
      this.verify_id = this.registerService.verify_id;
      alert("VerficationModal "+ this.verify_id) 
    }
    let modal = document.getElementsByClassName('modal') as HTMLCollectionOf<HTMLElement>;
    if (modal.length != 0) {
      modal[0].style.display = "block";
    }
  }

  validateUser() {
    alert("Verify_Id on validate User " +this.registerService.verify_id)
    alert(this.verify_id + " " + this.verificatioCode);
    let verification_data = { userId: this.verify_id, code: this.verificatioCode }
    this.registerService.verifyUser(verification_data)
      .subscribe(data => { alert(JSON.stringify(data)) });
    this.closeModal();
    this.router.navigate(['/landing']);
  }

  closeModal() {
    let modal = document.getElementsByClassName('modal') as HTMLCollectionOf<HTMLElement>;
    if (modal.length != 0) {
      modal[0].style.display = "none";
    }
  }

  gotToLogin() {
    this.router.navigate(['']);
  }
}
