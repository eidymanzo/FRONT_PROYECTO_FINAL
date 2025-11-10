import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgServe } from './ng-serve';

describe('NgServe', () => {
  let component: NgServe;
  let fixture: ComponentFixture<NgServe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgServe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgServe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
