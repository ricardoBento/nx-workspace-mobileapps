export interface User {
  user?: string;
}

export class UserClass {
  user;
  constructor(user) {
    this.user = user;
  }
}
