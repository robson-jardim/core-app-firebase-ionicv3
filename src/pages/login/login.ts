import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../providers/auth-service/auth-service';
import { EmailValidator } from '../../validators/email';

import { RegisterUserPage } from '../register-user/register-user';
import { ProfilePage } from '../../pages/profile/profile';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild('Nav') nav;

  public loginForm:FormGroup;
  public loading:Loading;

  constructor(private _auth:  AuthService,
              public navCtrl: NavController,
              public formBuilder: FormBuilder,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {

    _auth.afAuth.authState.subscribe( user => {
      if (user) {
        this.navCtrl.setRoot('ProfilePage'  );
      }
    });

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required,
    EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6),
    Validators.required])]

});

  }

  goToResetPassword(){
    this.navCtrl.push('HomePage');
  }


  signInWithFacebook(): void {
    this._auth.signInWithFacebook()
      .then(() => this.onSignInSuccess());
  }

  private onSignInSuccess(): void {
    console.log("Facebook display name ",this._auth.displayName());
  }

  private registerUser(): void {
     this.navCtrl.push('RegisterUserPage');
  }

  private signInUser(): void {
    if (!this.loginForm.valid){
        console.log(this.loginForm.value);
      } else {
        this._auth.signInUser(this.loginForm.value.email, this.loginForm.value.password)
        .then( authData => {
          this.navCtrl.setRoot('HomePage');
        }, error => {
          this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });

        this.loading = this.loadingCtrl.create({
          dismissOnPageChange: true,
        });
        this.loading.present();
      }
  }

}
