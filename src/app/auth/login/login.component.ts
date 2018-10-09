import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Store } from '@ngrx/store';

import { AuthService } from '../auth.service';
import { UIService } from '../../shared/ui.service';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading$: Observable<boolean>;
  private loadingSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<{ ui: fromApp.State }>
  ) { }

  ngOnInit() {
    this.isLoading$ = this.store.pipe(map(state => state.ui.isLoading))
      // this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      //   this.isLoading = isLoading
      // })
    }

    loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });

    onSubmit(loginForm) {
      console.log(loginForm);
      this.authService.login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      })
    }

    // ngOnDestroy() {
    //   if (this.loadingSubs) {
    //     this.loadingSubs.unsubscribe();
    //   }
    // }

  }
