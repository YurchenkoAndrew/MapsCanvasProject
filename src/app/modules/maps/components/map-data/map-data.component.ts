import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MapData} from "../../entities/map-data";
import {MapDataService} from "../../services/map-data.service";

@Component({
  selector: 'app-map-data',
  templateUrl: './map-data.component.html',
  styleUrls: ['./map-data.component.scss']
})
export class MapDataComponent {
  mapData?: MapData;

  constructor(private dialogRef: MatDialogRef<MapDataComponent>, @Inject(MAT_DIALOG_DATA) private data: number, private service: MapDataService) {
    this.service.getData(data).subscribe({
      next: (response: MapData) => {
        this.mapData = response;
      }
    })
  }

}
