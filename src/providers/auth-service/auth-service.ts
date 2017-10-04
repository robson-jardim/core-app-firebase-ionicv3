import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
//import { IUser } from '../../models/user/user';
import * as firebase from 'firebase/app';


@Injectable()
export class AuthService {


  private currentUser: firebase.User = null;

  constructor(public afAuth: AngularFireAuth,
              private fb: Facebook,
              private platform: Platform) {

  }

  //Email and Password Log-In
  signInUser(user: string, password: string ): firebase.Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(user, password);
  }

  //Reset Password Link
  resetPassword(email: string): firebase.Promise<any> {
    console.log("resetPassword!");
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  //Log the user out
  signOut() {
    this.afAuth.auth.signOut();
    console.log("User signOut!");
  }


  //Create a new user account
  registerUser(email: string, password: string, name = "") {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(function(firebaseUser) {
        console.log("User " + firebaseUser.uid + " created successfully!");
        return firebaseUser;
      }).catch(function(error) {
        console.error("Error: ", error);
      })
  }

  //Verify if user is logged in
  authenticated(): boolean {
    return this.currentUser !== null;
  }

  //Login with Facebook
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

  //Get User Name
  displayName(): string {
    if (this.currentUser !== null) {
      return this.currentUser.displayName;
    } else {
      return '';
    }
  }




}
