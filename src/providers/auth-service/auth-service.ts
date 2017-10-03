import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { IUser } from '../../models/user/user';
import * as firebase from 'firebase/app';


@Injectable()
export class AuthService {

  private currentUser: firebase.User = null;

  constructor(public afAuth: AngularFireAuth,
              private fb: Facebook,
              private platform: Platform) {

      afAuth.authState.subscribe(user => {
        if (!user) {
          this.currentUser = user;
          return;
        }
        this.currentUser = user;
      });

  }


  get authenticated(): boolean {
    return this.currentUser !== null;
  }

  signInUser(user: string, password: string ): firebase.Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(user, password);
  }

  resetPassword(email: string): firebase.Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }



  signInWithFacebook(): firebase.Promise<any> {
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => console.log(res));
    }

  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }

  displayName(): string {
    if (this.currentUser !== null) {
      return this.currentUser.displayName;
    } else {
      return '';
    }
  }


  registerUser(email, password, name) {

    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(function(firebaseUser) {
        console.log("User " + firebaseUser.uid + " created successfully!");
        return firebaseUser;
      }).catch(function(error) {
        console.error("Error: ", error);
      })
  }

}
