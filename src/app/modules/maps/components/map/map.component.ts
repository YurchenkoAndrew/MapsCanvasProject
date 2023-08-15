import {AfterContentChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild,} from '@angular/core';
import {MapService} from '../../services/map.service';
import {MapItem} from '../../entities/mapItem';
import {Subscription} from 'rxjs';
import {MapData} from '../../entities/map-data';
import {MatDialog} from "@angular/material/dialog";
import {MapDataComponent} from "../map-data/map-data.component";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterContentChecked, OnDestroy {

  @ViewChild('canvasWrapper', {static: true})
  canvasWrapper!: ElementRef<HTMLDivElement>;
  // Достаем канвас из ДОМ
  @ViewChild('canvas', {static: true}) canvas!: ElementRef<HTMLCanvasElement>;

  deltaY: number = 1;

  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  startScale: number = 1;
  mapItem?: MapItem;
  mapItemSub: Subscription;
  mapItemImageSub?: Subscription;
  private ctx!: CanvasRenderingContext2D;
  image: HTMLImageElement = new Image();
  dragPosition = {x: 0, y: 0};

  constructor(private service: MapService, private dialog: MatDialog) {
    // Получаем карту
    this.mapItemSub = service.getMap(49).subscribe((response) => {
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

  ngOnDestroy(): void {
    // Отписываемся от наблюдателей
    if (this.mapItemSub) {
      this.mapItemSub.unsubscribe();
    }
    if (this.mapItemImageSub) {
      this.mapItemImageSub.unsubscribe();
    }
    this.canvas.nativeElement.removeEventListener<"mousemove">('mousemove', this.mouseMove.bind(this));
    this.canvas.nativeElement.removeEventListener<"dblclick">('dblclick', this.mouseClick.bind(this));
  }

  ngOnInit(): void {
    this.initCanvas();
  }

  ngAfterContentChecked(): void {
  }

  private initCanvas(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.image.onload = () => {
      // Масштабируем канвас по изображению и согласно размеру экрана
      const scaleWidth = this.windowWidth / this.image.width;
      const scaleHeight = this.windowHeight / this.image.height;
      this.startScale = parseFloat(
        Math.min(scaleWidth, scaleHeight).toFixed(2)
      );
      this.deltaY = this.startScale;
      this.canvas.nativeElement.width = this.image.width;
      this.canvas.nativeElement.height = this.image.height;
      // Применяем стилями масштабирование изображения и канваса
      this.canvas.nativeElement.style.transform = `scale(${this.deltaY}, ${this.deltaY})`;
      // Ставим изображение карты в канвас
      this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);
      // Сохраняем в стек текущее состояние
      this.ctx.save();
      // Добавляем объекты на канвас
      this.createMapObjects(this.mapItem?.map_data!);
    };
  }

  // Ставим объекты на канвас
  private createMapObjects(mapData: MapData[]): void {
    if (mapData.length > 0) {
      mapData.map((mapData: MapData) => {
        this.ctx.strokeStyle = 'blue';
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(
          mapData.left,
          mapData.top,
          mapData.width,
          mapData.height
        );
      });
    }
    // Возвращаем состояние из стека
    this.ctx.restore();
    // Слушаем движение мышки по канвасу
    this.canvas.nativeElement.addEventListener<"mousemove">('mousemove', this.mouseMove.bind(this));
    // Слушаем событие двойного клика по канвасу
    this.canvas.nativeElement.addEventListener<"dblclick">('dblclick', this.mouseClick.bind(this));
    // Слушаем события колесика мышки
    this.canvas.nativeElement.addEventListener<"wheel">('wheel', this.onMouseWheel.bind(this));
  }

  // Методы для кнопки, для мобильных устройств
  zoomAdd(): void {
    this.deltaY = parseFloat((this.deltaY + 0.1).toFixed(2));
    this.canvas.nativeElement.style.transform = `scale(${this.deltaY}, ${this.deltaY})`;
  }

  zoomRemove(): void {
    this.deltaY = parseFloat((this.deltaY - 0.1).toFixed(2));
    this.canvas.nativeElement.style.transform = `scale(${this.deltaY}, ${this.deltaY})`;
  }

  private onMouseWheel($event: WheelEvent): void {
    if ($event.deltaY > 0) {
      if (this.startScale == this.deltaY) {
        this.dragPosition = {x: 0, y: 0};
        return;
      }
      this.deltaY = parseFloat((this.deltaY - 0.05).toFixed(2));
    } else {
      if (this.deltaY >= 1) {
        return;
      }
      this.deltaY = parseFloat((this.deltaY + 0.05).toFixed(2));
    }

    this.canvas.nativeElement.style.transform = `scale(${this.deltaY}, ${this.deltaY})`;
  }

  private mouseMove($event: MouseEvent): void {
    this.objectCheck($event);
  }

  private mouseClick($event: MouseEvent): void {
    console.log('x = ' + $event.offsetX)
    console.log('y = ' + $event.offsetY)
    const id: number | void = this.objectCheck($event);
    if (id) {
      this.openMapData(id, $event);
    }
  }

  // Проверяем нахождение точек мыши в объекте
  private objectCheck($event: MouseEvent): number | void {
    const x = $event.offsetX;
    const y = $event.offsetY;
    for (const obj of this.mapItem?.map_data!) {
      if (
        x >= obj.left &&
        x <= obj.left + obj.width &&
        y >= obj.top &&
        y <= obj.top + obj.height
      ) {
        this.canvas.nativeElement.style.cursor = "pointer";
        return obj.id;
      } else {
        this.canvas.nativeElement.style.cursor = "default";
      }
    }
  }

  private openMapData(id: number, $event: MouseEvent): void {
    const dialogRef = this.dialog.open<MapDataComponent>(MapDataComponent, {data: {id: id, event: $event}})
  }
}
