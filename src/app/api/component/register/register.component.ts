import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { User } from '../../../models/user';
import { RegisterService } from '../../component/register/register.service';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';

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

  ngOnInit() {
    this.populateDays();
    this.populateYears();
    this.validateForm();
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
      'occupation': new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z a-zA-Z]+$/i)]),
      'gender': new FormControl('', [Validators.required, this.forbiddenValueValidator(/--Select Gender--/i)]),
      'year': new FormControl('', [Validators.required, this.forbiddenValueValidator(/--Year--/i)]),
      'month': new FormControl('', [Validators.required, this.forbiddenValueValidator(/--Month--/i)]),
      'day': new FormControl('', [Validators.required, this.forbiddenValueValidator(/--Day--/i)]),
      'phone': new FormControl('', [Validators.required, Validators.pattern(/^[+][0-9]+$/i)])
    });
  }

  forbiddenValueValidator(value: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const forbidden = value.test(control.value);
      return forbidden ? { 'forbidden': { value: control.value } } : null;
    };
  }

  passwordsAreTheSame(value: string): ValidatorFn {
    return null;
  }

  addNewUser() {
    this.newuser = new User();
    this.newuser.email = this.registerForm.get('email').value;

    this.newuser.name = this.registerForm.get('name').value;
    this.newuser.password = this.registerForm.get('pass').value;
    this.newuser.occupation = this.registerForm.get('occupation').value;
    this.newuser.gender = this.registerForm.get('gender').value;
    this.newuser.phone = this.registerForm.get('phone').value;

    this.newuser.date_of_birth = new Date();
    this.newuser.date_of_birth.setFullYear(this.registerForm.get('year').value,
      this.registerForm.get('month').value, this.registerForm.get('day').value);
    this.registerService.registerNewUser(this.newuser)
      .subscribe(
      data => {
        if (data == null) {
          alert('Could not create the new manual task');
        } else {
          this.router.navigate(['/profile']);
        }
      },
      err => console.log(err),
      () => console.log('Request Add New user Complete'));
  }

  private showErrorMessage(message: string) {
    //this.toastManager.error(message, 'Something went wrong!', { toastLife: 5000, showCloseButton: true });
  }

  gotToLogin() {
    console.log("Here");
    this.router.navigate(['']);
  }
}
