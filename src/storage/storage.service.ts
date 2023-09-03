import {StorageFile} from "./storage-file";
import {DownloadResponse, Storage} from "@google-cloud/storage";
import {Injectable} from "@nestjs/common";
import * as process from "process";

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    console.log("storage project id", process.env.PROJECT_ID);
    this.storage = new Storage({
      projectId: process.env.PROJECT_ID,
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY,
      },
      //keyFilename: "./cloud-functions-7714b-c773deb805cc.json"
    });

    this.bucket = process.env.STORAGE_MEDIA_BUCKET;
  }

  async save(
    path: string,
    contentType: string,
    media: Buffer,
    metadata: { [key: string]: string }[]
  ) {
    console.log("storage service", process.env.STORAGE_MEDIA_BUCKET, " - ", this.bucket)
    const object = metadata.reduce((obj, item) => Object.assign(obj, item), {});
    const file = this.storage.bucket(this.bucket).file(path);
    const stream = file.createWriteStream();
    stream.on("finish", async () => {
      return await file.setMetadata({
        metadata: object,
      });
    });
    stream.end(media);
  }

  async delete(path: string) {
    await this.storage
      .bucket(this.bucket)
      .file(path)
      .delete({ignoreNotFound: true});
  }

  async get(path: string): Promise<StorageFile> {
    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download();
    const [buffer] = fileResponse;
    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>();
    return storageFile;
  }

  async getWithMetaData(path: string): Promise<StorageFile> {
    const [metadata] = await this.storage
      .bucket(this.bucket)
      .file(path)
      .getMetadata();
    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download();
    const [buffer] = fileResponse;

    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>(
      // @ts-ignore
      Object.entries(metadata || {})
    );
    storageFile.contentType = storageFile.metadata.get("contentType");
    return storageFile;
  }
}