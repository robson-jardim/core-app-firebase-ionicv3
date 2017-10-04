import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public navCtrl: NavController,
              private _auth: AuthService) {

    _auth.afAuth.authState.subscribe( user => {
      if (!user) {
        this.navCtrl.setRoot('LoginPage'  );
      }
    });

  }

  private signOut(): void {
    this._auth.signOut();
  }

  displayName() {
    return this._auth.displayName();
  }

}
