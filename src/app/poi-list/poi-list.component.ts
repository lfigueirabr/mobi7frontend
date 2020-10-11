import { Component, OnInit } from '@angular/core';
import { POI } from '../model/poi';
import { POIService } from '../service/poi.service';

@Component({
  selector: 'app-poi-list',
  templateUrl: './poi-list.component.html',
  styleUrls: ['./poi-list.component.css']
})
export class PoiListComponent implements OnInit {

  pois: POI[];

  constructor(private poiService: POIService) { }

  ngOnInit(): void {
    this.poiService.findAll().subscribe(data => {
      this.pois = data;
    });
  }

}
