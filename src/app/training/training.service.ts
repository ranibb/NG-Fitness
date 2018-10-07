import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'

import { Exercise } from "./exercise.model";

@Injectable()
export class TrainingService {

    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finshedExercisesChanged = new Subject<Exercise[]>()

    private availableExercises: Exercise[] = [];

    private runningExercise: Exercise;

    constructor(private db: AngularFirestore) {}

    fetchAvailableExercises() {
        this.db
            .collection('availableExercises')
            .snapshotChanges()
            .pipe(
            map(docArray => {
                return docArray.map(doc => {
                return {
                    id: doc.payload.doc.id,
                    ...doc.payload.doc.data() as Exercise
                }
                })
            })
            )
            .subscribe((exercises: Exercise[]) => {
                console.log(exercises);
                this.availableExercises = exercises;
                this.exercisesChanged.next([...this.availableExercises])
            })
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
        this.addDataToDatabase({...this.runningExercise, date: new Date(), state: 'completed'})
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
        this.db
            .collection('finishedExercises')
            .valueChanges()
            .subscribe((exercises: Exercise[]) => {
                this.finshedExercisesChanged.next(exercises);
        });
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}