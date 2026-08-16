import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class DocumentsService {
  private api = "http://localhost:3000/api/documents";

  constructor(private http: HttpClient) {}

  list(): Observable<any> {
    return this.http.get(this.api);
  }

  getOne(id: string): Observable<any> {
    return this.http.get(this.api + "/" + id);
  }

  create(title: string, type: string, templateId?: string): Observable<any> {
    return this.http.post(this.api, { title, type, templateId });
  }

  updateTitle(id: string, title: string): Observable<any> {
    return this.http.put(this.api + "/" + id, { title });
  }

  duplicate(id: string): Observable<any> {
    return this.http.post(this.api + "/" + id + "/duplicate", {});
  }

  remove(id: string): Observable<any> {
    return this.http.delete(this.api + "/" + id);
  }

  addSection(docId: string, type: string, title: string, order: number): Observable<any> {
    return this.http.post(this.api + "/" + docId + "/sections", { type, title, order });
  }

  updateSectionTitle(docId: string, sectionId: string, title: string): Observable<any> {
    return this.http.patch(this.api + "/" + docId + "/sections/" + sectionId, { title });
  }

  removeSection(docId: string, sectionId: string): Observable<any> {
    return this.http.delete(this.api + "/" + docId + "/sections/" + sectionId);
  }

  addItem(docId: string, sectionId: string, text: string): Observable<any> {
    return this.http.post(this.api + "/" + docId + "/sections/" + sectionId + "/items", { text });
  }

  updateItem(docId: string, sectionId: string, itemId: string, text: string): Observable<any> {
    return this.http.patch(this.api + "/" + docId + "/sections/" + sectionId + "/items/" + itemId, { text });
  }

  removeItem(docId: string, sectionId: string, itemId: string): Observable<any> {
    return this.http.delete(this.api + "/" + docId + "/sections/" + sectionId + "/items/" + itemId);
  }

logExport(docId: string): Observable<any> {
  return this.http.post(this.api + "/" + docId + "/export", {});
}

  listVersions(docId: string): Observable<any> {
    return this.http.get(this.api + "/" + docId + "/versions");
  }

  createVersion(docId: string): Observable<any> {
    return this.http.post(this.api + "/" + docId + "/versions", {});
  }

  restoreVersion(docId: string, versionId: string): Observable<any> {
    return this.http.post(this.api + "/" + docId + "/versions/" + versionId + "/restore", {});
  }
}