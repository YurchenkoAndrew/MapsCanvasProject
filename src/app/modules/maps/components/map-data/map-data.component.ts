import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-map-data',
  templateUrl: './map-data.component.html',
  styleUrls: ['./map-data.component.scss']
})
export class MapDataComponent {
  constructor(private dialogRef: MatDialogRef<MapDataComponent>, @Inject(MAT_DIALOG_DATA) public data: number) {
  }

}
