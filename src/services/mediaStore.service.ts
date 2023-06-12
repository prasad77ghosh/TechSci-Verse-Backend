import { UploadedFile } from "express-fileupload";
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
  async upload({
    files,
    folder,
  }: {
    files: UploadedFile | UploadedFile[];
    folder: string;
  }): Promise<UploadApiResponse> {
    try {
      let results: any;

      if (Array.isArray(files)) {
        files.forEach(async (file) => {
          const uploadFile = await cloudinary.v2.uploader.upload(
            file.tempFilePath,
            {
              folder,
            }
          );

          results.push(uploadFile);
        });
      } else {
        results = await cloudinary.v2.uploader.upload(files.tempFilePath, {
          folder,
        });
      }

      return results;
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
