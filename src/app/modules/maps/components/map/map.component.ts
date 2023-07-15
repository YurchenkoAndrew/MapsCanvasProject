import {
  AfterContentChecked,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MapService } from '../../services/map.service';
import { Map } from '../../entities/map';
import { Subscription } from 'rxjs';
import { MapData } from '../../entities/map-data';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterContentChecked, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  deltaY: number = 1;
  @HostListener('wheel', ['$event']) onMousWheel($event: WheelEvent) {
    if ($event.deltaY > 0) {
      if(this.startScale == this.deltaY){
        return
      }
      this.deltaY = parseFloat((this.deltaY - 0.05).toFixed(2));
    } else {
      this.deltaY = parseFloat((this.deltaY + 0.05).toFixed(2));
    }
    console.log($event.clientX);
    // this.canvas.nativeElement.style.transformOrigin = this.pointToZoomX + "px " + this.pointToZoomY + "px";
    this.canvas.nativeElement.style.transform = `scale(${this.deltaY}, ${this.deltaY})`;
  }

  @ViewChild('canvasWrapper', { static: true })
  canvasWrapper!: ElementRef<HTMLDivElement>;
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  startScale: number = 1;
  mapItem?: Map;
  mapItemSub: Subscription;
  mapItemImageSub?: Subscription;
  private ctx!: CanvasRenderingContext2D;
  image: HTMLImageElement = new Image();
  imageUrl!: string;
  pointToZoomX = 10;
  pointToZoomY = 10;

  constructor(private service: MapService) {
    this.mapItemSub = service.getMap(36).subscribe((response) => {
      this.mapItem = response;
      this.mapItemImageSub = service.getImageMap(response.image).subscribe({
        next: (response: Blob) => {
          this.image.src = URL.createObjectURL(response);
        },
        error: () => {},
        complete: () => {},
      });
    });
  }
  ngOnDestroy(): void {
    if (this.mapItemSub) {
      this.mapItemSub.unsubscribe;
    }
    if (this.mapItemImageSub) {
      this.mapItemImageSub.unsubscribe;
    }
  }
  ngOnInit(): void {
    this.initCanvas();
  }
  ngAfterContentChecked(): void {
    this.canvas.nativeElement.addEventListener('mousemove', this.mouseMove);
  }

  private initCanvas(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.image.onload = () => {
      const scaleWidth = this.windowWidth / this.image.width;
      const scaleHeight = this.windowHeight / this.image.height;
      this.startScale = parseFloat((Math.min(scaleWidth, scaleHeight)).toFixed(2));
      this.deltaY = this.startScale;
      this.canvas.nativeElement.width = this.image.width;
      this.canvas.nativeElement.height = this.image.height;
      this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);
      this.canvas.nativeElement.style.transform = `scale(${this.startScale}, ${this.startScale})`;
      this.ctx.save();
      // console.log(this.image.width);
      // console.log(this.image.height);
      this.createMapObjects(this.mapItem?.map_data!);
    };
  }

  private dimensionCalculations(
    windowWidth: number,
    windowHeight: number,
    imageWidth: number,
    imageHeight: number
  ): void {
    const aspectRatio = imageWidth / imageHeight;
    console.log(aspectRatio);
    const windowRatio = windowWidth / windowHeight;
    console.log(windowRatio);
    if (windowRatio > aspectRatio) {
      this.image.width = windowWidth;
      this.image.height = windowWidth / aspectRatio;
    } else {
      this.image.width = windowHeight * aspectRatio;
      this.image.height = windowHeight;
    }
  }

  private createMapObjects(mapData: MapData[]): void {
    if (mapData.length > 0) {
      mapData.map((mapData: MapData) => {
        this.ctx.strokeStyle = 'blue';
        this.ctx.lineWidth = 10;
        this.ctx.strokeRect(
          mapData.left,
          mapData.top,
          mapData.width,
          mapData.height
        );
      });
    }
    this.ctx.restore();
  }
  zoomAdd(): void {
    this.deltaY = parseFloat((this.deltaY + 0.1).toFixed(2));
    this.canvas.nativeElement.style.transform = `scale(${this.deltaY}, ${this.deltaY})`;
  }
  zoomRemove(): void {
    this.deltaY = parseFloat((this.deltaY - 0.1).toFixed(2));
    this.canvas.nativeElement.style.transform = `scale(${this.deltaY}, ${this.deltaY})`;
    console.log(this.startScale);
    console.log(this.deltaY);
  }

  private mouseMove($event: MouseEvent): void {
    // this.pointToZoomX = $event.offsetX;
    // this.pointToZoomY = $event.offsetY;
    // console.log(this.pointToZoomX + '-' + this.pointToZoomY);
  }
}
