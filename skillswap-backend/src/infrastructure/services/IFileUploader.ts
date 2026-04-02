export interface IFileUploader {
  uploadBuffer(buffer: Buffer, filename: string, folder: string): Promise<string>;
}
