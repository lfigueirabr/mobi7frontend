import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { POI } from '../model/poi';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class POIService {

  private poiUrl: string;

  constructor(private http: HttpClient) {
    this.poiUrl = 'http://localhost:8080/pois';
  }

  public findAll(): Observable<POI[]> {
    return this.http.get<POI[]>(this.poiUrl);
  }
}
