import { Document } from "mongoose";

export default interface CATEGORY_TYPE extends Document {
  name: string;
  description: string;
}
