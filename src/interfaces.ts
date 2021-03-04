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
