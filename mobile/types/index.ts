import { DocumentPickerAsset } from "expo-document-picker";

export type UserType = {
  name: string;
  email: string;
  role: string;
  standard: string;
  UID: string;
  _id: string;
};

export type registerInputType = {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher" | "";
  standard: string;
};

export type loginInputType = {
  email: string;
  password: string;
};

export type ChangePasswordInputType = {
  oldPassword: string;
  newPassword: string;
};

// BATCH TYPE
export type BatchForTeacherType = {
  _id: string;
  name: string;
  standard: string;
  batchJoiningCode: string | null;
  studentCount: number;
};

export type StudentType = {
  _id: string;
  name: string;
  email: string;
  UID: string;
  standard: string;
};

export type BatchForStudentType = {
  _id: string;
  name: string;
  standard: string;
  teacher: {
    name: string;
  };
  studentCount: number;
};

export type Add_To_BatchInputType = {
  batchId: string;
  studentIds: string[];
};

export type JoinBatchInputType = {
  batchId: string;
  batchJoiningCode: string;
};

export type removeStudentFromBatchInputType = {
  batchId: string;
  studentId: string;
};

export type BatchdetailType = {
  _id: string;
  students: StudentType[];
};

export type AllBatchesForStudentsType = {
  _id: string;
  name: string;
  standard: string;
  teacher: {
    name: string;
  };
  studentCount: number;
};

// admin Types
export type AllUsersType = {
  _id: string;
  name: string;
  UID: string;
  standard: string;
  isVerified: boolean;
};

export type CountType = {
  totalUserCount: number;
  teacherCount: number;
  studentCount: number;
  verifiedCount: number;
};

export type SelectedUserType = {
  user: AllUsersType;
  feeDetails: FeeType[];
};

export type AllTeachersType = {
  _id: string;
  name: string;
  UID: string;
  email: string;
};

export type AllBatchesType = {
  _id: string;
  name: string;
  teacher: {
    name: string;
  };
  batchJoiningCode: number;
  standard: string;
};

export type CreateBatchInputType = {
  name: string;
  teacher: string;
  standard: string;
};

export type CreateEventInputType = {
  title: string;
  description: string;
  date: Date;
  image: string;
};

// FEE TYPE
export type FeeType = {
  _id: string;
  amount: number;
  month: string;
  transactionDetail: {
    order_id: string;
    payment_id: string;
  };
  student: string | null | undefined;
  mode: "online" | "offline";
  paid: boolean;
  paidAt: Date;
  createdAt: Date;
};

export type BatchAssignmentType = {
  _id: string;
  homework: string[];
  createdAt: string;
};

export type TodaysAssignmentType = {
  _id: string;
  homework: string[];
  batchName: string;
};

export type CreateAssignmentInputType = {
  batchIds: string[];
  files: (File | DocumentPickerAsset)[];
};

// event Type

export type EventType = {
  _id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  public: boolean;
};
