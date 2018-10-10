import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromUi from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer'

export interface State {
    ui: fromUi.State;
    auth: fromAuth.State;
}
/**
 * Keep in mind that the training state / the training module is actually loaded lazily. 
 * Therefore, what we can't add training as a state to our reducers map. This won't work 
 * because this would require us to import the training reducer and the training state 
 * ahead of time before we actually load the module.
 */

export const reducers: ActionReducerMap<State> = {
    ui: fromUi.uiReducer,
    auth: fromAuth.authReducer
}

export const getUiState = createFeatureSelector<fromUi.State>('ui');
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

export const getAuthState = createFeatureSelector<fromAuth.State>('auth');
export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuth);