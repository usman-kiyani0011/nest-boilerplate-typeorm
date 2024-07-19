import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { STATUS_CODES } from 'node:http';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {

    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

    catch(exception: any, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : exception?.statusCode
                    ? exception.statusCode
                    : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = {
            statusCode: httpStatus || HttpStatus.INTERNAL_SERVER_ERROR,
            message: Array.isArray(exception?.response?.message)
                ? exception.response.message.join(', ')
                : exception?.response?.message ||
                exception?.message ||
                'Something went wrong',
            error: STATUS_CODES[httpStatus],
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, HttpStatus.OK);
    }
}
