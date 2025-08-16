import mongoose,{Schema,Document,Types} from "mongoose";
import "../models/Role";


export interface IUser extends Document {
  email: string;  
  name: string;
  passwordHash: string;
  roleId:Types.ObjectId | any; // Reference to Role
  status:"active" | "inactive";
  createdAt: Date;
  updatedAt?: Date | null;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null }
  },
  { collection: "users" } // explicitly link to existing collection
);

export const User = mongoose.model<IUser>("User", UserSchema);