import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http'
import { VerificationService } from './verification.service'

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ], providers: [VerificationService]
})
export class VerificationModule {

}
