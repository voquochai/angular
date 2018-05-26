import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KidCreateComponent } from './kid-create.component';

describe('KidCreateComponent', () => {
  let component: KidCreateComponent;
  let fixture: ComponentFixture<KidCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KidCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KidCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
