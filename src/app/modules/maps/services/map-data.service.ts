import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MapData} from "../entities/map-data";
import {environment} from "../../../../environments/environment";

@Injectable()
export class MapDataService {

  constructor(private http: HttpClient) {
  }

  getData(id: number): Observable<MapData> {
    const url: string = environment.apiUrl + 'map-data/';
    return this.http.get<MapData>(url + id);
  }
}
