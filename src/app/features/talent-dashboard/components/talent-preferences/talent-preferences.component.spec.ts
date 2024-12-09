import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentPreferencesComponent } from './talent-preferences.component';

describe('TalentPreferencesComponent', () => {
  let component: TalentPreferencesComponent;
  let fixture: ComponentFixture<TalentPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TalentPreferencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalentPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
