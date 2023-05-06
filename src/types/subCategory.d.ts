import { Document } from "mongoose";
import CATEGORY_TYPE from "./category";

export default interface SUB_CATEGORY_TYPE extends Document {
  name: string;
  description: string;
  parent: CATEGORY_TYPE;
}
