import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { LandingService } from './landing.service';
@NgModule({
  imports: [
    HttpModule,
    CommonModule
  ], providers: [LandingService]
})
export class LandingModule { }
