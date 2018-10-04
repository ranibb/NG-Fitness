import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  
  maxDate;

  constructor() { }

  ngOnInit() {
    this.maxDate = new Date(); // This gives the date of today
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18); // 18 years ago from today
  }

  onSubmit(form: NgForm) {
    console.log(form);
  }

}
