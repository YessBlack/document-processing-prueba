import type { Result } from "../domain/Result";

export interface ICommandHandler<TCommand, TResult> {
  execute(command: TCommand): Promise<Result<TResult>>;
}
