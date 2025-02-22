// types/error.ts
export interface ErrorType {
    message: string;
    statusCode?: number; // Optional status code if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any; // Optional additional data from the error
  }
  