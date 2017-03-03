/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { O2chartComponent } from './o2chart.component';

describe('O2chartComponent', () => {
  let component: O2chartComponent;
  let fixture: ComponentFixture<O2chartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ O2chartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(O2chartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
