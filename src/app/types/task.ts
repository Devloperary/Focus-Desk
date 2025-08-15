export type TaskStatus = "Pending" | "In Progress" | "Completed" | "Scheduled";

export type TaskDoc = {
  _id?: string;
  userId: string;
  title: string;
  status: TaskStatus;
  date: string | null;       // "YYYY-MM-DD" or null (for general/daily without a date)
  createdAt: Date;
  updatedAt: Date;
};
