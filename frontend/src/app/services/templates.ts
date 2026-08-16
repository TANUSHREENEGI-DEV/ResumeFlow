import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class TemplatesService {
  private api = "http://localhost:3000/api/templates";

  constructor(private http: HttpClient) {}

  list(): Observable<any> {
    return this.http.get(this.api);
  }
}