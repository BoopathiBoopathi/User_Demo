import express from "express";
import { getUsers, createUser, getUserById, updateUser, deleteUser, } from "../../controllers/userController.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();
router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.post("/", auth, createUser);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

export default router;
