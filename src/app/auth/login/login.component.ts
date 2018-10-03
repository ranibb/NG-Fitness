import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

  loginForm = this.fb.group({
    email: ['', Validators.compose([Validators.required,Validators.email])],
    password: ['', Validators.required]
  });

  onSubmit(loginForm: FormBuilder) {
    console.log(loginForm);
  }

}
