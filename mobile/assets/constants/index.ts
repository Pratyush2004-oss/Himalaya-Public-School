// export const BASE_URL = "https://dm8gg2rt-5000.inc1.devtunnels.ms/api";
export const BASE_URL = "https://himalaya-public-school.vercel.app/api";
export const RAZORPAY_KEY_ID = "rzp_test_nNCur574VZoFK2";

// user apis
export const UserApis = {
  registerUser: `${BASE_URL}/auth/register`,
  loginUser: `${BASE_URL}/auth/login`,
  checkAuth: `${BASE_URL}/auth/check-auth`,
  checkAdmin: `${BASE_URL}/auth/check-admin`,
  changePassword: `${BASE_URL}/auth/change-password`,
  updateProfile: `${BASE_URL}/auth/update-user-profile`,
  getEventsList: `${BASE_URL}/auth/get-all-events`,
};

// batch apis
export const batchApis = {
  // teacher apis
  add_students_to_batch: `${BASE_URL}/batch/add-students-to-batch`,
  changeBatchJoiningCode: `${BASE_URL}/batch/change-batch-Joining-code/:batchId`,
  get_Batches_for_Teacher: `${BASE_URL}/batch/get-all-batches-for-teacher`,
  get_Single_Batch_for_Teacher: `${BASE_URL}/batch/get-batch-By-id-for-teacher/:batchId`,
  getAllStudentList: `${BASE_URL}/batch/get-all-students/:batchId`,
  delete_Student_from_Batch: `${BASE_URL}/batch/delete-student-from-batch`,
  deleteBatch: `${BASE_URL}/batch/delete-batch/:batchId`,

  // student apis
  add_to_batch: `${BASE_URL}/batch/join-batch-by-code`,
  get_batches_for_Student: `${BASE_URL}/batch/get-all-batches-for-students`,
  get_All_Batches_to_Join: `${BASE_URL}/batch/get-all-batches-for-student-to-join`,
  leaveBatch: `${BASE_URL}/batch/leave-batch`,
};

export const AssignmentApis = {
  createAssignment: `${BASE_URL}/assignment/create-assignment`,
  getTodayAssignment: `${BASE_URL}/assignment/get-assignments-of-today`,
  getBatchAssignment: `${BASE_URL}/assignment/get-assignment/:batchId`,
};

export const feeApis = {
  getAllFees: `${BASE_URL}/fee/get-all-fee-list`,
  orderFee: `${BASE_URL}/fee/create-order`,
  verifyFeePayment: `${BASE_URL}/fee/verify-fee-payment`,
};

export const adminApis = {
  // user apis
  getAllUsers: `${BASE_URL}/admin/get-all-the-users`,
  verifyUser: `${BASE_URL}/admin/verify-users`,
  getStudentInformation: `${BASE_URL}/admin/get-student-information`,
  getStudentInfoByUID: `${BASE_URL}/admin/get-student-by-UID`,
  deleteUser: `${BASE_URL}/admin/delete-user/:userId`,

  // batch apis
  getAllTeachers: `${BASE_URL}/admin/get-all-teachers`,
  getAllBatchesForAdmin: `${BASE_URL}/admin/get-all-batches-for-admin`,
  createBatch: `${BASE_URL}/admin/create-batch`,
  deleteBatch: `${BASE_URL}/admin/delete-batch/:batchId`,
  // fee apis
  verifyFeePayment: `${BASE_URL}/admin/verify-fee-payment`,
  // event apis
  createEvent: `${BASE_URL}/admin/create-event`,
  deleteEvent: `${BASE_URL}/admin/delete-event/:eventId`,
  updateEventStatus: `${BASE_URL}/admin/change-event-status/:eventId`,
};

export const StandardsList = [
  {
    name: "1st",
    value: "1",
  },
  {
    name: "2nd",
    value: "2",
  },
  {
    name: "3rd",
    value: "3",
  },
  {
    name: "4th",
    value: "4",
  },
  {
    name: "5th",
    value: "5",
  },
  {
    name: "6th",
    value: "6",
  },
  {
    name: "7th",
    value: "7",
  },
  {
    name: "8th",
    value: "8",
  },
  {
    name: "9th",
    value: "9",
  },
  {
    name: "10th",
    value: "10",
  },
  {
    name: "11th",
    value: "11",
  },
  {
    name: "12th",
    value: "12",
  },
];

export const BusList = [
  "Pickup1",
  "Pickup2",
  "Pickup3",
  "Pickup4",
  "Pickup5",
  "Pickup6",
  "Pickup7",
  "Pickup8",
  "Pickup9",
  "Pickup10",
  "Pickup11",
  "Pickup12",
];

export const RoleList = ["student", "teacher"];
