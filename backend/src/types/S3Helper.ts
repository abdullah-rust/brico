// ============================
// INTERFACES
// ============================
export interface UploadFileInput {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

export interface UploadFileResult {
  fileKey: string;
}

export interface GetFileResult {
  buffer: Buffer;
  contentType: string;
  contentLength?: number;
  lastModified?: Date;
}
