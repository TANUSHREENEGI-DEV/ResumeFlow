import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class SharesService {
  private api = "http://localhost:3000/api/shares";

  constructor(private http: HttpClient) {}

  list(): Observable<any> {
    return this.http.get(this.api);
  }
create(documentId: string): Observable<any> {
  return this.http.post(this.api, { documentId });
}
  remove(id: string): Observable<any> {
    return this.http.delete(this.api + "/" + id);
  }
}