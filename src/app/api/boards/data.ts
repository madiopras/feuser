export interface Board {
  id?: string;
  title: string;
  description?: string;
  projectId: string;
  order?: number;
  status?: 'todo' | 'in-progress' | 'done';
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
} 