import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialLoginCallbackComponent } from './social-login-callback-component.component';

describe('SocialLoginCallbackComponentComponent', () => {
  let component: SocialLoginCallbackComponent;
  let fixture: ComponentFixture<SocialLoginCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialLoginCallbackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialLoginCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
