interface Base {
  _id: string;
  addedBy: string;
  modifiedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends Base {
  email: string;
  phone: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}
