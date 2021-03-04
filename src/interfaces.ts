export interface Status {
  id: string;
  displayName: string;
  order: number;
}

export interface Task {
  id: string; 
  title: string;
  description: string;
  status: string;
  isDraft?: boolean;
}

export interface Board {
  id: string;
  displayName: string;
  isActive: boolean;
}

export interface Observer {
  next: (snapshot: unknown) => void;
  error: () => void;
}

export interface StorageContext {
  statuses: Status[],
  tasks: Task[],
  activeBoard: Board
};
