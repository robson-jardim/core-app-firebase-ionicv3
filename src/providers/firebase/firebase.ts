
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';


@Injectable()
export class FirebaseDataProvider {

  constructor(public afd: AngularFireDatabase) { }

  getShoppingItems() {
    return this.afd.list('/shoppingItems/');
  }

  addItem(name) {
    this.afd.list('/shoppingItems/').push(name);
  }

  removeItem(id) {
    this.afd.list('/shoppingItems/').remove(id);
  }
}

export class firebaseDB_User {

  constructor(public afd: AngularFireDatabase) { }

  getUser(uid) {
    return this.afd.list('/users/' + uid);
  }

  adduser(user) {
    this.afd.list('/users/').push(name);
  }

  removeItem(id) {
    this.afd.list('/users/').remove(id);
  }
}
