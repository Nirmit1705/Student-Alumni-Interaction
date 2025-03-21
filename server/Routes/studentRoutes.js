import express from "express";
import {
  registerStudent,
  authStudent,
  getStudentProfile,
  updateStudentProfile,
  getAllStudents,
  searchStudents,
  getStudentsByBranch,
  getStudentsByYear,
  uploadStudentProfilePicture,
  uploadStudentResume
} from "../Controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerStudent);
router.post("/login", authStudent);
router.get("/", getAllStudents);
router.get("/search", searchStudents);
router.get("/branch/:branch", getStudentsByBranch);
router.get("/year/:year", getStudentsByYear);

// Protected routes
router.route("/profile")
  .get(protect, getStudentProfile)
  .put(protect, updateStudentProfile);

// File upload routes
router.post("/profile/upload-picture", protect, uploadStudentProfilePicture);
router.post("/profile/upload-resume", protect, uploadStudentResume);

export default router;
