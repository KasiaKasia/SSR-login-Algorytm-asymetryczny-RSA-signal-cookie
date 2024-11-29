import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanActivateExample1Component } from './can-activate-example-1.component';

describe('CanActivateExample1Component', () => {
  let component: CanActivateExample1Component;
  let fixture: ComponentFixture<CanActivateExample1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanActivateExample1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanActivateExample1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
