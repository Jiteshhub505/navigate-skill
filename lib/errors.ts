/**
 * Standard error response structure
 */
export interface ErrorResponse {
    error: string;
    message: string;
    details?: unknown;
    statusCode?: number;
}

/**
 * Success response structure
 */
export interface SuccessResponse<T = unknown> {
    success: true;
    data: T;
    message?: string;
}

/**
 * API Response type (either success or error)
 */
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

/**
 * Action result type for server actions
 */
export type ActionResult<T = unknown> =
    | { success: true; data: T; message?: string }
    | { success: false; error: string; message?: string; details?: unknown };

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public details?: unknown
    ) {
        super(message);
        this.name = 'AppError';
    }
}

/**
 * Validation error class
 */
export class ValidationError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, 400, details);
        this.name = 'ValidationError';
    }
}

/**
 * Not found error class
 */
export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} not found`, 404);
        this.name = 'NotFoundError';
    }
}

/**
 * Unauthorized error class
 */
export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

/**
 * Forbidden error class
 */
export class ForbiddenError extends AppError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}

/**
 * Handle errors safely and return a formatted error response
 */
export function handleError(error: unknown): ErrorResponse {
    console.error('Error occurred:', error);

    if (error instanceof AppError) {
        return {
            error: error.name,
            message: error.message,
            details: error.details,
            statusCode: error.statusCode,
        };
    }

    if (error instanceof Error) {
        return {
            error: 'Error',
            message: error.message,
            statusCode: 500,
        };
    }

    return {
        error: 'UnknownError',
        message: 'An unknown error occurred',
        statusCode: 500,
    };
}

/**
 * Try-catch wrapper for async functions that returns ActionResult
 */
export async function tryCatch<T>(
    fn: () => Promise<T>,
    errorMessage: string = 'Operation failed'
): Promise<ActionResult<T>> {
    try {
        const data = await fn();
        return { success: true, data };
    } catch (error) {
        const errorResponse = handleError(error);
        return {
            success: false,
            error: errorResponse.error,
            message: errorMessage,
            details: errorResponse.details,
        };
    }
}

/**
 * Safe JSON parsing with error handling
 */
export function safeParse<T>(json: string, fallback: T): T {
    try {
        return JSON.parse(json) as T;
    } catch {
        return fallback;
    }
}

/**
 * Safe async operation with retry logic
 */
export async function retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (i < maxRetries - 1) {
                await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
            }
        }
    }

    throw lastError || new Error('Max retries exceeded');
}

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse(response: unknown): response is ErrorResponse {
    return (
        typeof response === 'object' &&
        response !== null &&
        'error' in response &&
        'message' in response
    );
}

/**
 * Type guard to check if action result is success
 */
export function isSuccessResult<T>(
    result: ActionResult<T>
): result is SuccessResponse<T> {
    return 'success' in result && result.success === true;
}
