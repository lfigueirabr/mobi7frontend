import { Component, OnInit } from '@angular/core';
import { PosicaoService } from '../service/posicao.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Posicao } from '../model/posicao';
import { POI } from '../model/poi';
import { POIService } from '../service/poi.service';
import { Tempo } from '../model/tempo';

@Component({
  selector: 'app-time-list',
  templateUrl: './time-list.component.html',
  styleUrls: ['./time-list.component.css']
})
export class TimeListComponent implements OnInit {

  placas: String[];
  date: Date;
  posicoes: Posicao[];
  selected: string;
  pois: POI[];
  tempos: Tempo[];
  showTables: boolean = false;

  constructor(private posicaoService: PosicaoService, private poiService: POIService) { }

  ngOnInit(): void {
    this.posicaoService.findPlacas().subscribe(data => {
      this.placas = data;
    });
    this.poiService.findAll().subscribe(data => {
      this.pois = data;
    });
  }

  search() {
    this.posicaoService.findPosicoes(this.selected, this.date).subscribe(data => {
      this.posicoes = data;
      if (this.posicoes !== null) {
        this.calcTime();
      }
    });

  }

  dateChange(event: MatDatepickerInputEvent<string>) {
    if (event.value !== null) {
      this.date = new Date(event.value);
    } else {
      this.date = undefined;
    }
  }

  resetPlaca() {
   this.selected = undefined;
  }

  calcPositionWithinPoiRange() {
    let dist: number;
    let arr: Posicao[];
    let matches = new Map<POI, Posicao[]>(); // positions within poi radius range
    for (let poi of this.pois) {
      for (let pos of this.posicoes) {
        dist = this.distanceInKmBetweenEarthCoordinates(poi.latitude, poi.longitude, pos.latitude, pos.longitude);
        if (dist !== undefined && dist*1000 < poi.raio) {
          if (matches.has(poi)) {
            arr = matches.get(poi);
            arr.push(pos);
            matches.set(poi, arr);
          } else {
            matches.set(poi, [pos]);
          }
          //console.log("match " + poi.nome + " with " + pos.id + ". Distance from POI center to pos is " + dist*1000 + " meters.");
        }
      }
    }
    return matches;
  }

  putCarWithPos(matches: Map<POI, Posicao[]>) {
    let placaPOIs = new Map<string, Map<POI, Posicao>[]>(); // correspondence of a car and its positions (with POI information)
    let tmpMap: Map<POI, Posicao>;
    let arrTmp: Map<POI, Posicao>[];
    for (let key of matches.keys()) { // for each POI
      for (let pos of matches.get(key)) { // for each pos of a POI
        tmpMap = new Map<POI, Posicao>();
        tmpMap.set(key, pos);
        if (!placaPOIs.has(pos.placa)) {
          placaPOIs.set(pos.placa, [tmpMap]); // init array
        } else {
          arrTmp = placaPOIs.get(pos.placa);
          arrTmp.push(tmpMap);
          placaPOIs.set(pos.placa, arrTmp);
        }
      }
    }
    return placaPOIs;
  }

  calcTime() {
    let matches = this.calcPositionWithinPoiRange(); // Map<POI, Posicao[]>

    let placaPOIs = this.putCarWithPos(matches); // Map<string, Map<POI, Posicao>[]>

    let POIsum: Map<POI, number>;
    let lastPos: Posicao;
    let lastPOI: POI;
    this.tempos = [];
    for (let placa of placaPOIs.keys()) {
      POIsum = new Map<POI, number>();
      for (let poiPos of placaPOIs.get(placa)) { // iterate Array of Map<POI, Posicao> - process all pos from placa (car)
        for (let [poi, pos] of poiPos) { // just one entry
          if (!POIsum.has(poi)) {
            POIsum.set(poi, 0);
          } else {
            if (poi.nome === lastPOI.nome) {
              // time difference in minutes
              let diff = Math.ceil(Math.abs((new Date(pos.data)).getTime() - (new Date(lastPos.data)).getTime()) / (1000 * 60));
              POIsum.set(poi, POIsum.get(poi) + diff);
            }
          }
          lastPos = pos;
          lastPOI = poi;
        }
      }
      for (let [poi, sum] of POIsum) {
        this.tempos.push(new Tempo(placa, poi.nome, sum));
        //console.log("placa " + placa + ": " + poi.nome + " " + sum + " min. " + this.tempos.length);
      }
    }

    this.showTables = true;
  }

  degreesToRadians(degrees: number) {
    return degrees * Math.PI / 180;
  }

  distanceInKmBetweenEarthCoordinates(lat1: number, lon1: number, lat2: number, lon2: number) {
    let earthRadiusKm = 6371;

    let dLat = this.degreesToRadians(lat2-lat1);
    let dLon = this.degreesToRadians(lon2-lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return earthRadiusKm * c;
  }
}
