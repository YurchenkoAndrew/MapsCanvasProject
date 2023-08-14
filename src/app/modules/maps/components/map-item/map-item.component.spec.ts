import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MapItemComponent} from './map-item.component';

describe('MapItemComponent', () => {
  let component: MapItemComponent;
  let fixture: ComponentFixture<MapItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapItemComponent]
    });
    fixture = TestBed.createComponent(MapItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
