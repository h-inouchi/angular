import { User } from "./user";

export class Comment {
  user :User;
  message: string;
  date: number;
  key: any;
  isEdit: boolean | undefined;

  constructor(value:any) {
    this.user = value.user;
    this.message = value.message;
    this.date = value.date || Date.now();
    if (value.key) {
      this.key = value.key;
    }
  }
}
