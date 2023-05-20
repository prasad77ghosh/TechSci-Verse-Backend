import { CloudApiKey, CloudApiSecret, CloudName } from "../config";
import cloudinary, { UploadApiResponse } from "cloudinary";

export default class MediaStoreService {
  constructor() {
    cloudinary.v2.config({
      cloud_name: CloudName,
      api_key: CloudApiKey,
      api_secret: CloudApiSecret,
    });
  }

  //upload file in to cloudinary
  async upload(file: any, folder: string): Promise<UploadApiResponse> {
    try {
      const result = await cloudinary.v2.uploader.upload(file.path, { folder });
      return result;
    } catch (error) {
      throw new Error("File does not uploaded in cloudinary..");
    }
  }

  // delete file from cloudinary
  async delete(publicId: string): Promise<void> {
    try {
      await cloudinary.v2.uploader.destroy(publicId);
    } catch (error) {
      throw new Error("There is some error, file is not deleted");
    }
  }

  //update file of cloudinary
  async update(
    publicId: string,
    file: any,
    folder: string
  ): Promise<UploadApiResponse> {
    try {
      await cloudinary.v2.uploader.upload(publicId);
      const result = await cloudinary.v2.uploader.upload(file.path, { folder });
      return result;
    } catch (error) {
      throw new Error("There is some error, file is not updated");
    }
  }
}
