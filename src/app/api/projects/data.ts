export interface Project {
  id?: string;
  title: string;
  description?: string;
  status?: 'active' | 'completed' | 'archived';
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
} 