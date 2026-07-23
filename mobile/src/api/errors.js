/**
 * Error thrown when the API returns success:false or the network/parse fails.
 */
export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {{ code?: string, status?: number, requestId?: string, cause?: unknown }} [options]
   */
  constructor(message, options = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = options.code || 'CLIENT_ERROR';
    this.status = options.status;
    this.requestId = options.requestId;
    if (options.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}
