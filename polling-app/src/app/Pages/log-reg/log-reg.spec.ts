import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogReg } from './log-reg';

describe('LogReg', () => {
  let component: LogReg;
  let fixture: ComponentFixture<LogReg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogReg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogReg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
