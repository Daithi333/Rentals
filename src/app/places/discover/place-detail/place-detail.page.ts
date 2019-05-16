import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';

import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;

  constructor(private navCtrl: NavController,
              private placesService: PlacesService,
              private route: ActivatedRoute,
              private modalController: ModalController) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
    });
  }

  // Navigation notes: Angular router will play wrong animation for back if a nested paged is reloaded; so use Ionic NavController
  // Pop will only work if other pages on the stack.
  onBookPlace() {
    // this.router.navigateByUrl('places/tabs/discover');
    // this.navCtrl.navigateBack('/places/tabs/discover');
    // this.navCtrl.pop();
    // create modal Controller gives us a promise which we can use present to show, like the alert controller
    this.modalController.create({
      component: CreateBookingComponent,
      componentProps: {selectedPlace: this.place}
    })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
    })
    .then(resultData => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        console.log('Booked!');
      }
    });
  }

}
