import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonItemSliding } from '@ionic/angular';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  @ViewChild('slidingItem') slidingItem: IonItemSliding;
  offers: Place[];
  private placesSub: Subscription;

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    // this.offers = this.placesService.places;
    this.placesSub = this.placesService.places.subscribe( places => {
      this.offers = places;
    });
  }

  onEdit(offerId: string) {
    console.log('Editing item ', offerId);
  }

  ionViewDidLeave() {
    this.slidingItem.close();
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
