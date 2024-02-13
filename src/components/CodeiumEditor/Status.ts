/**
 * Status of the Codeium AI completions generation.
 */
export enum Status {
  INACTIVE = 'inactive',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

/**
 * Generic wrapper that adds status information to data.
 *
 * @field status - The status of the data.
 * @field message - Optional status message.
 * @field data - The wrapped data.
 */
export type StatusWrapper<T> = {
  status: Status;
  message?: string;
  data?: T;
};
