import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollDashboard } from './poll-dashboard';

describe('PollDashboard', () => {
  let component: PollDashboard;
  let fixture: ComponentFixture<PollDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
