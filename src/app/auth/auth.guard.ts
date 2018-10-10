import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
    CanLoad,
    Route
} from '@angular/router';
import { Store } from '@ngrx/store'
import { take } from 'rxjs/operators';

import * as fromRoot from '../app.reducer'

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    constructor(
        private router: Router,
        private store: Store<fromRoot.State>
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select(fromRoot.getIsAuth).pipe(take(1))
    }

    canLoad(route: Route) {
        return this.store.select(fromRoot.getIsAuth).pipe(take(1))
    }
}
// Keep in mind that observables are an ongoing construct. It constantly emits new values.
// The guard only runs once. Though this is why we have to add a special operator here.
// Pipe simply allows us to apply multiple operators to a given observable sequence.
// With this addition “.pipe(take(1))” we essentially tell NgRx or the guard here that we want to finish after getting one value.