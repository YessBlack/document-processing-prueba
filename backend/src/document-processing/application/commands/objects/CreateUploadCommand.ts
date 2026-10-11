export class CreateUploadCommand {
  public fileName: string;
  public content: Buffer;
  public userId: string;

  constructor(fileName: string, content: Buffer, userId: string) {
    this.fileName = fileName;
    this.content = content;
    this.userId = userId;
  }
}
