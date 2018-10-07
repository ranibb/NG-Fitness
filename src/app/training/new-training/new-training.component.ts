import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {

  exercises: Observable<Exercise[]>;

  constructor(private trainingService: TrainingService, private db: AngularFirestore) { }

  ngOnInit() {

    /* Method 1, access the data in the document but without access to metadata such as the doc ID */
    // this.exercises = this.db.collection('availableExercises').valueChanges();
    // this.db.collection('availableExercises').valueChanges().subscribe(result => {
    //   console.log(result);
    // })

    /* Method 2, access the data in the document and also get metadata such as the doc ID */
    this.exercises = this.db
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
    // this.db
    //   .collection('availableExercises')
    //   .snapshotChanges()
    //   .pipe(
    //     map(docArray => {
    //       return docArray.map(doc => {
    //         return {
    //           id: doc.payload.doc.id,
    //           ...doc.payload.doc.data()
    //         }
    //       })
    //     })
    //   )
    //   .subscribe(result => {
    //     console.log(result);
    //   })
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise)
  }

}
