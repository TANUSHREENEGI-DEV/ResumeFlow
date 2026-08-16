import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ApplicationsService {
  private api = "http://localhost:3000/api/applications";

  constructor(private http: HttpClient) {}

  list(): Observable<any> {
    return this.http.get(this.api);
  }
create(company: string, role: string): Observable<any> {
  return this.http.post(this.api, { company, role });
}

  updateStatus(id: string, status: string): Observable<any> {
    return this.http.patch(this.api + "/" + id, { status });
  }

  remove(id: string): Observable<any> {
    return this.http.delete(this.api + "/" + id);
  }
}