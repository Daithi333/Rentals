import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { BookingService } from '../../../bookings/booking.service';
import { AuthService } from '../../../auth/auth.service';
import { MapModalComponent } from '../../../shared/map-modal/map-modal.component';


@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  isLoading = false;
  private placeSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private placesService: PlacesService,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private bookingService: BookingService,
    private loadingController: LoadingController,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoading = true;
      let fetchedUserId: string;
      this.authService.userId.pipe(
        take(1),
        switchMap(userId => {
          if (!userId) {
            throw new Error('no user Found!');
          }
          fetchedUserId = userId;
          return this.placesService.getPlace(paramMap.get('placeId'));
        })
      )
      .subscribe(place => {
        this.place = place;
        this.isBookable = place.userId !== fetchedUserId;
        this.isLoading = false;
        }, error => {
          this.alertController.create({
            header: 'An error occurred!',
            message: 'Could not load place.',
            buttons: [
              {
                text: 'Okay',
                handler: () => {
                  this.router.navigate(['/places/tabs/discover']);
                }
              }
            ]
          }).then(alertEl => {
            alertEl.present();
          });
        });
    });
  }

  // Navigation notes: Angular router will play wrong animation for back if a nested paged is reloaded; so use Ionic NavController
  // Pop will only work if other pages on the stack.
  onBookPlace() {
    // this.router.navigateByUrl('places/tabs/discover');
    // this.navCtrl.navigateBack('/places/tabs/discover');
    // this.navCtrl.pop();
    // create modal Controller gives us a promise which we can use present to show, like the alert controller
    this.actionSheetController.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
  }
  // TS type assignment - 'mode' has to be either strings 'select' or 'random'
  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalController.create({
      component: CreateBookingComponent,
      componentProps: { selectedPlace: this.place, selectedMode: mode }
    })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resultData => {
        // console.log(resultData.data, resultData.role);
        if (resultData.role === 'confirm') {
          this.loadingController
            .create({ message: 'Booking place...' })
            .then(loadingEl => {
              loadingEl.present();
              const data = resultData.data.bookingData;
              this.bookingService.addBooking(
                this.place.id,
                this.place.title,
                this.place.imageUrl,
                data.firstName,
                data.lastName,
                data.guestNumber,
                data.startDate,
                data.endDate
              )
              .subscribe(() => {
                loadingEl.dismiss();
              });
            });
        }
      });
  }

  onShowFullMap() {
    this.modalController
    .create({
      component: MapModalComponent,
      componentProps: {
        center: { lat: this.place.location.lat, lng: this.place.location.lng },
        selectable: false,
        closeButtonText: 'Close',
        title: this.place.location.address,
        zoom: 15
      }
    })
      .then(modalEl => {
        modalEl.present();
      });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

}
