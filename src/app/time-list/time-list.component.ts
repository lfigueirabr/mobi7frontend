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
    console.log(this.pois);
    console.log(this.posicoes);
  }
}
