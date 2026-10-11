export class ListUploadsQuery {
  public page: number;
  public limit: number;

  constructor(page: number, limit: number) {
    this.page = page;
    this.limit = limit;
  }
}