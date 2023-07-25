import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MapsRoutingModule} from './maps-routing.module';
import {MapComponent} from './components/map/map.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {HttpClientModule} from '@angular/common/http';
import {MapService} from './services/map.service';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MapDataComponent} from './components/map-data/map-data.component';
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [MapComponent, MapDataComponent],
  imports: [
    CommonModule,
    MapsRoutingModule,
    MatGridListModule,
    HttpClientModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
  providers: [MapService],
})
export class MapsModule {
}
