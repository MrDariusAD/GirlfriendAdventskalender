import { Injectable } from "@angular/core";
import { DoorContent } from "../models/door-content.model";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { dummyDoorContent } from "./dummy-door-content.model";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DoorContentService {
  private cache: DoorContent[] = [];

  private baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public getDoorContent(doorNumber: string): Observable<DoorContent> {
    if (!this.baseUrl || this.baseUrl === "") {
      return of<DoorContent>(dummyDoorContent);
    }
    if (this.cache[doorNumber]) {
      return of(this.cache[doorNumber]);
    }
    return this.httpClient
      .get<DoorContent>(`${this.baseUrl}/api/DoorContent/${doorNumber}`)
      .pipe(
        tap((x) => {
          this.cache[doorNumber] = x;
        })
      );
  }

  public getUnlockDates() {
    return this.httpClient.get<DoorContent[]>(`${this.baseUrl}/api/DoorContent/`);
  }

  public createDoorContent(doorContent: DoorContent): Observable<DoorContent> {
    return this.httpClient.put<DoorContent>(
      `${this.baseUrl}/api/DoorContent/${doorContent.id}`,
      doorContent
    ).pipe(tap(x=> {
      console.log(`Setting ${doorContent.id} to`, doorContent);
      this.cache[doorContent.id] = doorContent;
    }));
  }

  public editDoorContent(doorContent: DoorContent): Observable<DoorContent> {
    return this.httpClient.post<DoorContent>(
      `${this.baseUrl}/api/DoorContent/${doorContent.id}`,
      doorContent
    ).pipe(tap(x=> {
      console.log(`Setting ${doorContent.id} to`, doorContent);
      this.cache[doorContent.id] = doorContent;
    }));
  }
}
