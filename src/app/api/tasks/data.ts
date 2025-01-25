export interface Task {
  id?: string;
  title: string;
  description?: string;
  boardId: string;
  status?: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  assignedTo?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}

export interface SubTask {
  id?: string;
  title: string;
  taskId: string;
  completed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
} 