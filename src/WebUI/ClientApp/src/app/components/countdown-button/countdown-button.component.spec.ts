import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountdownButtonComponent } from './countdown-button.component';

describe('CountdownButtonComponent', () => {
  let component: CountdownButtonComponent;
  let fixture: ComponentFixture<CountdownButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountdownButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountdownButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
