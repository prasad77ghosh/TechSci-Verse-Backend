import { Document } from "mongoose";
import USER_TYPE from "./user";
import CATEGORY_TYPE from "./category";
import SUB_CATEGORY_TYPE from "./subcategory";

export default interface POST_TYPE extends Document {
  writer: USER_TYPE;
  title: string;
  description: string;
  headerImgUrl?: string;
  headerImgRef?: string;
  category: CATEGORY_TYPE;
  subCategory?: SUB_CATEGORY_TYPE;
  content: string;
  isPublished: boolean;
  isBlocked: boolean;
  publishDate: string;
}
