
export interface RequestLoadStudents {
  type: 'RequestLoadStudents';
}

export interface SetStudentStatus {
  type: 'SetStudentStatus';
  studentId: string;
  status: string;
}

export type Action = RequestLoadStudents;

export default Action;
