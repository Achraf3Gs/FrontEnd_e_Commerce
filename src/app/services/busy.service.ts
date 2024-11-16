import { NgxSpinnerService } from 'ngx-spinner';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  private busyRequestCount = 0;

  constructor(private spinnerService: NgxSpinnerService) {}

  busy() {
    this.busyRequestCount++;
    if (this.busyRequestCount === 1) {
      // Show the spinner with the specified type
      this.spinnerService.show(undefined, {
        type: 'line-scale-pulse-out-rapid', // Specify the animation type
        bdColor: 'rgba(0,0,0,0.8)', // Background color
        color: '#fff', // Spinner color
        size: 'medium', // Size: small, medium, or large
      });
    }
  }

  idle() {
    if (this.busyRequestCount > 0) {
      this.busyRequestCount--;
    }
    if (this.busyRequestCount === 0) {
      this.spinnerService.hide();
    }
  }
}
