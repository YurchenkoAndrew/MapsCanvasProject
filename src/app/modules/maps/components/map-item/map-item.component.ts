import {Component, ElementRef, OnInit, ViewChild,} from '@angular/core';
import {MapService} from '../../services/map.service';
import {MapItem} from '../../entities/mapItem';
import {Subscription} from 'rxjs';
import {MapData} from '../../entities/map-data';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-map-item',
  templateUrl: './map-item.component.html',
  styleUrls: ['./map-item.component.scss']
})
export class MapItemComponent implements OnInit {
  @ViewChild('canvasWrapper', {static: true})
  canvasWrapper!: ElementRef<HTMLDivElement>;
  // Достаем канвас из ДОМ
  @ViewChild('canvasBg', {static: true}) canvasBg!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasObjects', {static: true}) canvasObjects!: ElementRef<HTMLCanvasElement>;

  deltaY: number = 1;

  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  startScale: number = 1;
  mapItem?: MapItem;
  mapItemSub?: Subscription;
  mapItemImageSub?: Subscription;
  private ctxBg!: CanvasRenderingContext2D;
  private ctxObjects!: CanvasRenderingContext2D;
  image: HTMLImageElement = new Image();
  dragPosition = {x: 0, y: 0};

  constructor(private service: MapService, private dialog: MatDialog) {
    // Получаем карту
    this.mapItemSub = service.getMap(36).subscribe((response) => {
      this.mapItem = response;
      this.mapItem.map_data.reverse();
      // Получаем изображение для карты
      this.mapItemImageSub = service.getImageMap(response.image).subscribe({
        next: (response: Blob) => {
          this.image.src = URL.createObjectURL(response);
        },
        error: () => {
        },
        complete: () => {
        },
      });
    });
  }

  ngOnInit(): void {
    this.initCanvas();
  }

  private initCanvas(): void {
    this.ctxBg = this.canvasBg.nativeElement.getContext('2d')!;
    this.ctxObjects = this.canvasObjects.nativeElement.getContext('2d')!;
    this.image.onload = () => {
      this.canvasWrapper.nativeElement.style.width = this.windowWidth + 'px';
      this.canvasWrapper.nativeElement.style.height = this.windowHeight + 'px';
      // Масштабируем канвас по изображению и согласно размеру экрана
      const scaleWidth = this.windowWidth / this.image.width;
      const scaleHeight = this.windowHeight / this.image.height;
      this.startScale = parseFloat(
        Math.min(scaleWidth, scaleHeight).toFixed(2)
      );
      this.deltaY = this.startScale;
      this.canvasBg.nativeElement.width = this.image.width;
      this.canvasBg.nativeElement.height = this.image.height;
      this.canvasObjects.nativeElement.width = this.image.width;
      this.canvasObjects.nativeElement.height = this.image.height;
      // Ставим изображение карты в канвас
      this.ctxBg.drawImage(this.image, 0, 0, this.image.width, this.image.height);
      // Сохраняем в стек текущее состояние
      this.ctxBg.save();
      // Добавляем объекты на канвас
      this.createMapObjects(this.mapItem?.map_data!);
    };
  }

  // Ставим объекты на канвас
  private createMapObjects(mapData: MapData[]): void {
    if (mapData.length > 0) {
      mapData.map((mapData: MapData) => {
        this.ctxObjects.strokeStyle = 'blue';
        this.ctxObjects.lineWidth = 5;
        this.ctxObjects.strokeRect(
          mapData.left,
          mapData.top,
          mapData.width,
          mapData.height
        );
      });
    }
  }

  // Методы для кнопки, для мобильных устройств
  zoomAdd(): void {
    this.deltaY = parseFloat((this.deltaY + 0.1).toFixed(2));
    this.canvasBg.nativeElement.style.transform = `scale(${this.deltaY}, ${this.deltaY})`;
  }

  zoomRemove(): void {
    this.deltaY = parseFloat((this.deltaY - 0.1).toFixed(2));
    this.canvasBg.nativeElement.style.transform = `scale(${this.deltaY}, ${this.deltaY})`;
  }

}
