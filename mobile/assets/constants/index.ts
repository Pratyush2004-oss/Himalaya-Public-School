export const BASE_URL = "https://himalaya-public-school.vercel.app/api";

// user apis
export const UserApis = {
  registerUser: `${BASE_URL}/auth/register`,
  loginUser: `${BASE_URL}/auth/login`,
  checkAuth: `${BASE_URL}/auth/check-auth`,
  checkAdmin: `${BASE_URL}/auth/check-admin`,
  changePassword: `${BASE_URL}/auth/change-password`,
};

// batch apis
export const batchApis = {
  // teacher apis
  add_students_to_batch: `${BASE_URL}/batch/add-students-to-batch`,
  changeBatchJoiningCode: `${BASE_URL}/batch/change-batch-Joining-code`,
  get_Batches_for_Teacher: `${BASE_URL}/batch/get-all-batches-for-teacher`,
  get_Single_Batch_for_Teacher: `${BASE_URL}/batch/get-batch-By-id-for-teacher/:batchId`,
  getAllStudentList: `${BASE_URL}/batch/get-all-students/:batchId`,
  delete_Student_from_Batch: `${BASE_URL}/batch/delete-student-from-batch`,
  deleteBatch: `${BASE_URL}/batch/delete-batch/:batchId`,

  // student apis
  add_to_batch: `${BASE_URL}/batch/join-batch-by-code`,
  get_batches_for_Student: `${BASE_URL}/batch/get-all-batches-for-student`,
  get_All_Batches_to_Join: `${BASE_URL}/batch/get-all-batches-for-student-to-join`,
  leaveBatch: `${BASE_URL}/batch/leave-batch`,
};

export const assignmentApis = {};

export const feeApis = {};

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

export const RoleList = ["student", "teacher"];
