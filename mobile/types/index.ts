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

// batches
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

// FEE TYPE
export type FeeType = {
  _id: string;
  amount: number;
  student: string;
  month: string;
  transactionDetail: {
    order_id: string;
    payment_id: string;
  };
  mode: string;
  paid: boolean;
  paidAt: Date;
};
