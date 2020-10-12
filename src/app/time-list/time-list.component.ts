import { Component, OnInit } from '@angular/core';
import { PosicaoService } from '../service/posicao.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { Posicao } from '../model/posicao';
import { POI } from '../model/poi';
import { POIService } from '../service/poi.service';

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
      this.calcTime();
    });

  }

  dateChange(event: MatDatepickerInputEvent<string>) {
    this.date = new Date(event.value);
  }

  calcTime() {
    let dist: number;
    let matches = new Map<POI, Posicao[]>(); // positions within poi radius range <poi, position[]>
    let arr: Posicao[];
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
    //console.log(matches);
    let sum: number; // hours
    for (let key of matches.keys()) { // for each POI
      sum = 0;
      for (let pos of matches.get(key)) { // sum pos time
        if (pos.velocidade > 0 && pos.ignicao === true) { // d = s * t (distance m = speed km/h * time s) => time s = distance m / speed km/h
          sum += (key.raio/1000) / pos.velocidade;
        }
      }
      //console.log(key.nome + ": " + sum);
    }
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
