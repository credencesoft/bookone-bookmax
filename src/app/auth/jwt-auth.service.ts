import { Injectable } from "@angular/core";
import { LocalStoreService } from "../model/local-store.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { map, catchError, delay } from "rxjs/operators";
import { User } from "../model/user.model";
import { of, BehaviorSubject, throwError, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Token } from "@angular/compiler";
import { TokenStorage } from "src/token.storage";
import { ApplicationUser } from "../views/landing/Login-cancel-page/user";
import { API_URL } from "../app.component";

// ================= only for demo purpose ===========
const DEMO_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjhkNDc4MDc4NmM3MjE3MjBkYzU1NzMiLCJlbWFpbCI6InJhZmkuYm9ncmFAZ21haWwuY29tIiwicm9sZSI6IlNBIiwiYWN0aXZlIjp0cnVlLCJpYXQiOjE1ODc3MTc2NTgsImV4cCI6MTU4ODMyMjQ1OH0.dXw0ySun5ex98dOzTEk0lkmXJvxg3Qgz4ed";

const DEMO_USER: User = {
  id: "5b700c45639d2c0c54b354ba",
  displayName: "Watson Joyce",
  role: "SA",
};
// ================= you will get those data from server =======

@Injectable({
  providedIn: "root",
})
export class JwtAuthService {
  token;
  isAuthenticated: Boolean;
  user: User = {};
  user$ = (new BehaviorSubject<User>(this.user));
  signingIn: Boolean;
  return: string;
  headers = new HttpHeaders().set("Content-Type", "application/json");
  JWT_TOKEN = "JWT_TOKEN";
  APP_USER = "EGRET_USER";

  constructor(
    private tokenStorage: TokenStorage,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams
      .subscribe(params => this.return = params['return'] || '/');
  }
  login(credentials): Observable<any> {
    // Logger.log('API_URL'+API_URL);
    this.signingIn = true;
    return this.http.post<Token>(`${environment.apiUrl}/api/user/login`, credentials,  { observe: "response" });
    // let user = credentials.username;
    // let pass = credentials.password;
    // this.signingIn = true;
    // return this.http.post(API_URL + "/api/user/login", { user, pass }, options);
  }
  logout() {
    sessionStorage.removeItem("AuthToken");
    sessionStorage.removeItem("UserId");
    sessionStorage.removeItem("PropertyId");
    sessionStorage.removeItem("RoomDetails");
    sessionStorage.removeItem("PropertyDetails");
    sessionStorage.removeItem("Roles");
    window.sessionStorage.clear();
    this.router.navigateByUrl("/sessions/signin");
  }
  public signin(username, password) {
    return of({token: DEMO_TOKEN, user: DEMO_USER})
      .pipe(
        delay(1000),
        map((res: any) => {
          this.setUserAndToken(res.token, res.user, !!res);
          this.signingIn = false;
          return res;
        }),
        catchError((error) => {
          return throwError(error);
        })
      );

    // FOLLOWING CODE SENDS SIGNIN REQUEST TO SERVER

    // this.signingIn = true;
    // return this.http.post(`${environment.apiURL}/auth/local`, { username, password })
    //   .pipe(
    //     map((res: any) => {
    //       this.setUserAndToken(res.token, res.user, !!res);
    //       this.signingIn = false;
    //       return res;
    //     }),
    //     catchError((error) => {
    //       return throwError(error);
    //     })
    //   );
  }

  /*
    checkTokenIsValid is called inside constructor of
    shared/components/layouts/admin-layout/admin-layout.component.ts
  */
  public checkTokenIsValid() {
    // return of(DEMO_USER)
    //   .pipe(
    //     map((profile: User) => {
    //       this.setUserAndToken(this.getJwtToken(), profile, true);
    //       this.signingIn = false;
    //       return profile;
    //     }),
    //     catchError((error) => {
    //       return of(error);
    //     })
    //   );

    /*
      The following code get user data and jwt token is assigned to
      Request header using token.interceptor
      This checks if the existing token is valid when app is reloaded
    */

      return this.http
      .get<ApplicationUser>(
        `${API_URL}/api/user/findById/` + this.tokenStorage.getUserId(),
        { observe: "response" }
      )
      .pipe(
        map((profile: any) => {
          this.setUserAndToken(this.getJwtToken(), profile.body, true);
          return profile;
        }),
        catchError((error) => {
          this.logout();
          // this.signout();
          return of(error);
        })
      );
  }

  public signout() {
    sessionStorage.removeItem("AuthToken");
    sessionStorage.removeItem("UserId");
    sessionStorage.removeItem("PropertyId");
    sessionStorage.removeItem("RoomDetails");
    sessionStorage.removeItem("PropertyDetails");
    sessionStorage.removeItem("Roles");
    window.sessionStorage.clear();
    this.setUserAndToken(null, null, false);
    this.router.navigateByUrl("sessions/signin");
  }

  isLoggedIn(): Boolean {
    return !!this.getJwtToken();
  }

  getJwtToken() {
    return this.tokenStorage.getToken();
  }
  getUser() {
    return this.tokenStorage.getUserId();
  }

  setUserAndToken(token: String, user: User, isAuthenticated: Boolean) {
    this.isAuthenticated = isAuthenticated;
    this.token = token;
    this.user = user;
    this.user$.next(user);
    this.tokenStorage.setItem(this.JWT_TOKEN, token);
    this.tokenStorage.setItem(this.APP_USER, user);
  }
}
