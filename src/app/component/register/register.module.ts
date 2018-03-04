import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../register/register.service';
@NgModule({
  imports: [
    CommonModule,
  ], providers: [RegisterService]
})
export class RegisterModule { }
