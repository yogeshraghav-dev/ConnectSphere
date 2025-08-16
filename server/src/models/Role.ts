import mongoose,{Schema,Document} from "mongoose";

export interface IRole extends Document {
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
  updatedAt?: Date | null;
}


const RoleSchema:Schema<IRole> = new Schema(
  {
    name:{type:String, required:true, unique:true},
    description:{type:String, required:false},
    permissions:{type:[String], default:[]},
    createdAt:{type:Date, default:Date.now},
    updatedAt:{type:Date, default:null}
  },
  {
    collection: "roles"
  }
);

export const Role = mongoose.model<IRole>("Role", RoleSchema);

