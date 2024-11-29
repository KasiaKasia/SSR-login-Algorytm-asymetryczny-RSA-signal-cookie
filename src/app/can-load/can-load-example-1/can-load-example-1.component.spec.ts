import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanLoadExample1Component } from './can-load-example-1.component';

describe('CanLoadExample1Component', () => {
  let component: CanLoadExample1Component;
  let fixture: ComponentFixture<CanLoadExample1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanLoadExample1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanLoadExample1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
