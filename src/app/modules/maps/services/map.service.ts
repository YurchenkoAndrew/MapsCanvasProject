import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Map } from '../entities/map';
import { environment } from 'src/environments/environment';

@Injectable()
export class MapService {
  constructor(private http: HttpClient) {}

  getMap(id: number): Observable<Map> {
    return this.http.get<Map>(environment.apiUrl + 'map/' + id);
  }

  getImageMap(path: string): Observable<Blob> {
    return this.http.post(
      environment.apiUrl + 'map/download/image-map',
      { path: path },
      { responseType: 'blob' }
    );
  }
}
