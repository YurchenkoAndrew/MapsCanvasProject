import {MapData} from './map-data';

export interface MapItem {
  id: number;
  title: string;
  image: string;
  description: string;
  map_data: MapData[];
}
