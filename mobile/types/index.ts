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
export type CreateBatchInputType = {
  name: string;
  teacher: string;
  standard: string;
};












// FEE TYPE
export type FeeType = {
  amount: number;
  student: string;
  transactionDetail: {
    order_id: string;
    payment_id: string;
  };
  mode: string;
  paid: boolean;
  paidAt: Date;
};
