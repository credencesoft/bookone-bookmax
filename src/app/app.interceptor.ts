// import { AppLoaderService } from "./shared/services/app-loader/app-loader.service";
import { Injectable, InjectionToken, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { TokenStorage } from "src/token.storage";
import { BehaviorSubject } from "rxjs";
import { catchError, finalize, map } from "rxjs/operators";
import { timeout } from "rxjs/operators";
import { SESSION_APP_ID } from "./app.component";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { Logger } from "src/services/logger.service";

export const DEFAULT_TIMEOUT = new InjectionToken<number>("defaultTimeout");
const TOKEN_HEADER_KEY = "Authorization";
const APP_ID_SESSION_KEY = "APP_ID";

@Injectable()
export class HTTPStatus {
  private requestInFlight$: BehaviorSubject<boolean>;
  constructor() {
    this.requestInFlight$ = new BehaviorSubject(false);
  }

  setHttpStatus(inFlight: boolean) {
    this.requestInFlight$.next(inFlight);
  }

  getHttpStatus(): Observable<boolean> {
    return this.requestInFlight$.asObservable();
  }
}

@Injectable()
export class Interceptor implements HttpInterceptor {
  private totalRequests = 0;
  constructor(
    private token: TokenStorage,
    private router: Router,
    private status: HTTPStatus
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.totalRequests++;
    if (this.totalRequests == 1) {
      if(this.token.checkRequestDialog() === null ||
      this.token.checkRequestDialog() === undefined ||
      this.token.checkRequestDialog() === "")
      {
        // this.appLoaderService.open();
      }
    }
    let authReq = req;
    this.status.setHttpStatus(true);

    if (this.token.getToken() != null && req.url.indexOf("googleapis") < 0) {
      authReq = req.clone({
        headers: req.headers
          .set(TOKEN_HEADER_KEY, this.token.getToken())
          .set(APP_ID_SESSION_KEY, SESSION_APP_ID),
      });
    }

    return next.handle(authReq).pipe(
      map((event) => {
        return event;
      }),
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          // Logger.log('error :->' + error.message);
          if (error.status === 401) {
            // this.router.navigate(['user']);
          }
        }
        return next.handle(req);
      }),
      finalize(() => {
        this.totalRequests--;
        // Logger.log('this.totalRequests :->' + this.totalRequests);
        if (this.totalRequests === 0) {
          // this.appLoaderService.close();
        }
        this.status.setHttpStatus(false);
      })
    );

    // ///////////

    // return next.handle(authReq).pipe(
    //   map((event) => {
    //     return event;
    //   }),
    //   catchError((error) => {
    //     if (error instanceof HttpErrorResponse) {
    //       Logger.log("error :->" + error.message);
    //       if (error.status === 401) {
    //         this.router.navigate(["user"]);
    //       }
    //     }
    //     return next.handle(req);
    //   }),
    //   finalize(() => {
    //     this.status.setHttpStatus(false);
    //   })
    // );
  }
}
/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
];
@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  constructor(@Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const timeoutValue = req.headers.get("timeout") || this.defaultTimeout;
    const timeoutValueNumeric = Number(timeoutValue);

    return next.handle(req).pipe(timeout(timeoutValueNumeric));
  }
}
export const timeoutInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
];
