import type { Result } from "../domain/Result";

export interface IQueryHandler<TQuery, TResult> {
  execute(query: TQuery): Promise<Result<TResult>>;
}