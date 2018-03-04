import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewchatService } from './viewchat.service';
@NgModule({
  imports: [
    CommonModule
  ],
  providers: [ViewchatService]
})
export class ViewchatModule { }
