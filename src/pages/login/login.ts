import { Component } from '@angular/core';
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


  public loginForm:FormGroup;
  public loading:Loading;

  constructor(private _auth:  AuthService,
              public navCtrl: NavController,
              public formBuilder: FormBuilder,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {

    //Set form validations
    this.loginForm = formBuilder.group({
      email:    ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  //Login user
  private signInUser(goPage?: string): void {

    if (!goPage) {
      goPage = 'HomePage'
    }

    if (!this.loginForm.valid){
        console.log(this.loginForm.value);
      } else {
        this._auth.signInUser(this.loginForm.value.email, this.loginForm.value.password)
        .then( authData => {
          this.navCtrl.setRoot(goPage);
        }, error => {
          this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [{text: "Ok", role: 'cancel'}]
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

  goToResetPassword(){
    this.navCtrl.push('ResetPasswordPage');
  }

  registerUser() {
    this.navCtrl.push('RegisterUserPage');
  }

  signInWithFacebook(): void {
    this._auth.signInWithFacebook()
      .then(() => this.onSignInSuccess());
  }

  private onSignInSuccess(): void {
    console.log("Facebook display name ",this._auth.displayName());
  }




}
