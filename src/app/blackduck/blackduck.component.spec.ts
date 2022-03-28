import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackduckComponent } from './blackduck.component';

describe('BlackduckComponent', () => {
  let component: BlackduckComponent;
  let fixture: ComponentFixture<BlackduckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlackduckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlackduckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
