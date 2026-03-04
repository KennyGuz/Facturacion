import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesasForm } from './mesas-form';

describe('MesasForm', () => {
  let component: MesasForm;
  let fixture: ComponentFixture<MesasForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesasForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesasForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
