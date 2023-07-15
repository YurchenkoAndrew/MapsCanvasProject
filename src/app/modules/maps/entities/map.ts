import { MapData } from './map-data';

export interface Map {
  id: number;
  title: string;
  image: string;
  description: string;
  map_data: MapData[];
}
