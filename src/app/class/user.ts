export class User {
  displayName: string | null| undefined;
  email: string | null| undefined;
  photoURL: string | null| undefined;
  uid: string | undefined;
  initial: string | undefined;

  constructor(user: firebase.User | null) {
    this.uid = user?.uid;
    this.displayName = user?.displayName;
    this.email = user?.email;
    this.photoURL = user?.photoURL;
    this.initial = user?.displayName?.slice(0, 1);
  }
}
