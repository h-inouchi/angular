import { Component, OnInit } from '@angular/core';
import { Comment } from '../class/comment';
import { User } from '../class/user';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList, SnapshotAction } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'ac-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  comments$: Observable<Comment[]>;
  commentsRef: AngularFireList<Comment>;
  currentUser = new User(null);
  currentUser$: Observable<User | null>;
  comment = '';

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {
    this.comments$ = new Observable<Comment[]>();
    this.currentUser$ = new Observable<User>();
    this.commentsRef = db.list('/comments');
  }

  ngOnInit(): void {
    this.currentUser$ = this.afAuth.authState.pipe(
      map((user:firebase.User | null) => {
        if (user) {
          this.currentUser = new User(user);
          return this.currentUser;
        }
        return null;
      })
    );
    this.comments$ = this.commentsRef.snapshotChanges()
    .pipe(
      map((snapshots: SnapshotAction<Comment>[]) => {
        return snapshots.map(snapshot => {
          const value = snapshot.payload.val();
          return new Comment({ key: snapshot.payload.key, ...value });
        })
      })
    )
  }

  addComment(comment: string): void {
    if (comment) {
      this.commentsRef.push(new Comment({
        user: this.currentUser,
        message: comment
      }));
      this.comment = '';
    }
  }

  updateComment(comment: Comment):void {
    const { key, message } = comment;

    this.commentsRef.update(key, { message });
  }

  deleteComment(comment: Comment):void {
    this.commentsRef.remove(comment.key);
  }
}
