import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        imageUrl: { type: String, required: true },
        emailId: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;