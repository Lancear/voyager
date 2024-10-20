export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly errorBody: string;
  public constructor(message: string, statusCode: number, errorBody: string);
}

export type SafeTryResult<T> =
  { success: true, data: T }
  | { success: false, error: Error };

export function ensureErrorType(error: unknown, fallbackMessage: string): Error;
export function addErrorContext(err: Error, context: object): Error;
export function addErrorContext(err: unknown, fallbackMessage: string, context: object): Error;
export function safeTry<T>(fn: () => T): SafeTryResult<T>;
