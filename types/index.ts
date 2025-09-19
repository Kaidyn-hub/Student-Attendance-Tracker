export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string; // ISO date string
  status: 'present' | 'absent';
}

export interface User {
  id: string;
  username: string;
  password: string; // In real app, hash this
}
