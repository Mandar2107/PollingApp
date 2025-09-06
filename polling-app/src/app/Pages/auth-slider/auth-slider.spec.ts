import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSlider } from './auth-slider';

describe('AuthSlider', () => {
  let component: AuthSlider;
  let fixture: ComponentFixture<AuthSlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthSlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
