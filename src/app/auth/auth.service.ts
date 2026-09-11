import { TokenStorage } from "src/token.storage";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApplicationUser } from "../views/landing/Login-cancel-page/user";
import { Observable, of, throwError } from "rxjs";
import { API_URL } from "../app.component";
import { HttpHeaders } from "@angular/common/http";
import { Token } from "@angular/compiler";
import { PropertyUser } from "../model/property-user";
import { Logger } from "src/services/logger.service";
import { Router, ActivatedRoute } from "@angular/router";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable()
export class AuthService {
  currentUser: any;
  return: string;
  signingIn: Boolean;
  isAuthenticated: Boolean;
  JWT_TOKEN = "AuthToken";
  APP_USER = "UserId";
  headers = new HttpHeaders().set("Content-Type", "application/json");
  token;
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorage
  ) {
    this.route.queryParams.subscribe(
      (params) => (this.return = params["return"] || "/")
    );
  }
  logout() {
    sessionStorage.removeItem("AuthToken");
    sessionStorage.removeItem("UserId");
    sessionStorage.removeItem("PropertyId");
    sessionStorage.removeItem("RoomDetails");
    sessionStorage.removeItem("PropertyDetails");
    sessionStorage.removeItem("Roles");
    window.sessionStorage.clear();
    this.router.navigate(["/sessions/signin"]);
  }

  login(credentials): Observable<any> {
    
    this.signingIn = true;
    return this.http.post<Token>(`${environment.apiUrl}/api/user/login`, credentials,  { observe: "response" });
    
  }

  
  // login(credentials: { email: string, password: string }): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/login`, credentials);
  // }

  storeToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }
  
  public checkTokenIsValid() {
   

    return this.http
      .get<ApplicationUser>(
        `${API_URL}/api/user/findById/` + this.tokenStorage.getUserId(),
        { observe: "response" }
      )
      .pipe
      
      ();
  }

  createUser(applicationUser: ApplicationUser): Observable<any> {
    Logger.log(applicationUser);
    return this.http.post<ApplicationUser>(
      API_URL + "/api/user/signup",
      applicationUser,
      { observe: "response" }
    );
  }
  createUserByAdmin(propertyUser: PropertyUser): Observable<any> {
    Logger.log(propertyUser);
    return this.http.post<PropertyUser>(
      API_URL + "/api/user/signup",
      propertyUser,
      { observe: "response" }
    );
  }

  updateUserByAdmin(propertyUser: PropertyUser): Observable<any> {
    Logger.log(propertyUser);
    return this.http.post<PropertyUser>(
      API_URL + "/api/user/updateUser",
      propertyUser,
      { observe: "response" }
    );
  }
  updateUser(applicationUser: ApplicationUser): Observable<any> {
    //Logger.log(applicationUser);
    return this.http.post<ApplicationUser>(
      API_URL + "/api/user/update",
      applicationUser,
      { observe: "response" }
    );
  }
  updateProfile(applicationUser: ApplicationUser): Observable<any> {
    return this.http.post<ApplicationUser>(
      API_URL + "/api/user/profileUpdate",
      applicationUser,
      { observe: "response" }
    );
  }

  updateProfileForPropertyUser(applicationUser: PropertyUser): Observable<any> {
    return this.http.post<PropertyUser>(
      API_URL + "/api/user/profileUpdate",
      applicationUser,
      { observe: "response" }
    );
  }

  updatePassword(applicationUser: ApplicationUser): Observable<any> {
    return this.http.post<ApplicationUser>(
      API_URL + "/api/user/updatePassword",
      applicationUser,
      { observe: "response" }
    );
  }
  updateProfilePicture(applicationUser: ApplicationUser): Observable<any> {
    return this.http.post<ApplicationUser>(
      API_URL + "/api/user/updateProfilePic",
      applicationUser,
      { observe: "response" }
    );
  }
  getAll(): Observable<ApplicationUser[]> {
    //Logger.log(API_URL + '/users');
    return this.http.get<ApplicationUser[]>(API_URL + "/api/user/findAll");
  }
  getAllUser(): Observable<PropertyUser[]> {
    //Logger.log(API_URL + '/users');
    return this.http.get<PropertyUser[]>(API_URL + "/api/user/findAll");
  }
  getAllOrganizationUser(organizationId: string): Observable<PropertyUser[]> {
    //Logger.log(API_URL + '/api/user/organisation/3405');
    return this.http.get<PropertyUser[]>(
      API_URL + "/api/user/organisation/" + organizationId
    );
  }
  getUserDetailsByUserName(userName: string): Observable<any> {
    return this.http.get<ApplicationUser>(
      API_URL + "/api/user/findByName/" + userName,
      { observe: "response" }
    );
  }
  getUserByUsername(userName: string): Observable<any> {
    return this.http.get<ApplicationUser>(
      API_URL + "/api/user/findByName/" + userName,
      { observe: "response" }
    );
  }
  getUserByUserId(userId: string): Observable<any> {
    return this.http.get<ApplicationUser>(
      API_URL + "/api/user/findById/" + userId,
      { observe: "response" }
    );
  }
  getOrganizationUserByUserId(userId: string): Observable<any> {
    return this.http.get<PropertyUser>(
      API_URL + "/api/user/findById/" + userId,
      { observe: "response" }
    );
  }

  getAllPropertyUser(propertyId: string): Observable<PropertyUser[]> {
    return this.http.get<PropertyUser[]>(
      API_URL + "/api/property/" + propertyId + "/users"
    );
  }


  getAllUserByPropertyId(propertyId: string): Observable<PropertyUser[]> {
    return this.http.get<PropertyUser[]>(
      API_URL + "/api/property/propertyId/" + propertyId + "/users"
    );
  }
}
