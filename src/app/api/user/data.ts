export interface User {
  id?: string;
  email: string;
  password: string;
  name: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 