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
  event: MouseEvent;

  constructor(private dialogRef: MatDialogRef<MapDataComponent>, @Inject(MAT_DIALOG_DATA) private data: {
    id: number,
    event: MouseEvent
  }, private service: MapDataService) {
    this.event = data.event;
    this.service.getData(data.id).subscribe({
      next: (response: MapData) => {
        this.mapData = response;
      }
    })
  }

}
