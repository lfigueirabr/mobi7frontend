import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Posicao } from '../model/posicao';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PosicaoService {

  private posUrl: string;
  private placasUrl: string;

  constructor(private http: HttpClient) {
    this.posUrl = 'http://localhost:8080/posicao';
    this.placasUrl = 'http://localhost:8080/posicao/placas';
  }

  public findPlacas(): Observable<String[]> {
    return this.http.get<String[]>(this.placasUrl);
  }

  public findPosicoes(placa: string, data: Date): Observable<Posicao[]> {
    let params = new HttpParams();
    if (placa !== undefined) {
      params = params.set('placa', placa);
    }
    if (data !== undefined) {
      params = params.set('data', data.getMonth()+1 + "/" + data.getDate() + "/" + data.getFullYear());
    }

    return this.http.get<Posicao[]>(this.posUrl, { params });
  }
}
