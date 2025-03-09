/**
 * Represents a todo item in the application
 */
export interface Todo {
  /** Unique identifier for the todo */
  id: string;

  /** The todo title/description */
  title: string;

  /** ISO date string when the todo was created or scheduled */
  date: string;

  /** Whether the todo has been completed */
  completed: boolean;

  /** Whether the todo is marked for "later" */
  later: boolean;

  /** Optional due date for the todo */
  dueDate?: string;

  /** Optional due time for the todo */
  dueTime?: string;

  /** Optional priority level */
  priority?: 'low' | 'medium' | 'high';

  /** Optional category or tags */
  category?: string;

  /** Optional notes or additional details */
  notes?: string;

  /** Creation timestamp */
  createdAt?: string;

  /** Last updated timestamp */
  updatedAt?: string;

  /** Optional estimated duration for the todo */
  estimatedDuration?: number;

  /** Optional actual duration for the todo */
  actualDuration?: number;

  /** Optional subtasks for the todo */
  subtasks?: Todo[];
}
