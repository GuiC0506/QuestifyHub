import mongoose, { Model } from "mongoose";
import BookmarkModel from "./Bookmarks";
const { Types } = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    email: {
        type: Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Types.String,
        required: true
    },
    country: {
        type: Types.String,
        required: true
    },
    bookmarks: [{
        title: {
            type: Types.String,
            required: true
        },
        link: {
            type: Types.String,
            required: true
        }
        }]},
    {
        timestamps: {
        createdAt: "created_at",
        updateAt: "updated_at"
    }
});



const UserModel = mongoose.model("User", UserSchema);

export default UserModel;

