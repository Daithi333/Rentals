import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { BookingService } from './booking.service';
import { Booking } from './booking.model';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  private bookingsSub: Subscription;

  constructor(private bookingService: BookingService,
              private router: Router,
              private loadingController: LoadingController) {
  }

  ngOnInit() {
    this.bookingsSub = this.bookingService.bookings
      .subscribe(bookings => {
        this.loadedBookings = bookings;
      });
  }

  onCancelBooking(bookingId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.loadingController.create({
      message: 'Cancelling booking...'
    }).then(loadingEl => {
      loadingEl.present();
      this.bookingService.cancelBooking(bookingId)
        .subscribe(() => {
          loadingEl.dismiss();
        });
    });
    
  }

  ngOnDestroy() {
    if (this.bookingsSub) {
      this.bookingsSub.unsubscribe();
    }
  }

}
