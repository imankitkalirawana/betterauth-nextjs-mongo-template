export interface Base {
  _id: string;
  addedBy: string;
  modifiedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends Base {
  email: string;
  phone: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}
