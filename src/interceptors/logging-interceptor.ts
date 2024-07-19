import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { LogContext, LogLevel } from '@shared/constants';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Adjust the import path as necessary

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(
        private readonly logService: any //TODO
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        const now = Date.now();

        return next.handle().pipe(
            tap((data) => {
                const logMessage = `${method} ${url} - ${Date.now() - now}ms`;
                this.logService.createLog(LogLevel.INFO, logMessage, LogContext.REQUEST);
            }),
            tap((data) => {
                const response = context.switchToHttp().getResponse();
                const { statusCode } = response;
                const logMessage = `${method} ${url} ${statusCode} - ${Date.now() - now}ms`;

                switch (true) {
                    case statusCode >= 500:
                        this.logService.createLog(LogLevel.ERROR, logMessage, context);
                        break;
                    case statusCode >= 400:
                        this.logService.createLog(LogLevel.WARN, logMessage, context);
                        break;
                    default:
                        this.logService.createLog(LogLevel.INFO, logMessage, context);
                        break;
                }
            }),
        );
    }
}
