import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { Subscription } from 'rxjs'
import { Store } from "@ngrx/store"

import { Exercise } from "./exercise.model";
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions'

@Injectable()
export class TrainingService {

    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finshedExercisesChanged = new Subject<Exercise[]>()

    private availableExercises: Exercise[] = [];

    private runningExercise: Exercise;

    private fbSubs: Subscription[] = [];

    constructor(
        private db: AngularFirestore,
        private uiService: UIService,
        private store: Store<fromRoot.State>
    ) { }

    fetchAvailableExercises() {
        this.store.dispatch(new UI.StartLoading())
        this.fbSubs.push(this.db
            .collection('availableExercises')
            .snapshotChanges()
            .pipe(
                map(docArray => {
                    // throw(new Error());
                    return docArray.map(doc => {
                        return {
                            id: doc.payload.doc.id,
                            ...doc.payload.doc.data() as Exercise
                        }
                    })
                })
            )
            .subscribe((exercises: Exercise[]) => {
                this.store.dispatch(new UI.StopLoading())
                console.log(exercises);
                this.availableExercises = exercises;
                this.exercisesChanged.next([...this.availableExercises])
            }, error => {
                this.store.dispatch(new UI.StopLoading())
                this.uiService.showSnackbar('Fetching Exercises faild, please try again later', null, 3000)
                this.exercisesChanged.next(null)
            }))
    }

    startExercise(selectedId: string) {

        /* Example of selecting a single document and then update it. */
        // this.db.doc('availableExercises/' + selectedId).update({
        //     lastSelected: new Date()
        // })

        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        this.addDataToDatabase({ ...this.runningExercise, date: new Date(), state: 'completed' })
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancalled'
        })
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSubs.push(this.db
            .collection('finishedExercises')
            .valueChanges()
            .subscribe((exercises: Exercise[]) => {
                this.finshedExercisesChanged.next(exercises);
            }));
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}