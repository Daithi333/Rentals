import { Component, OnInit, ViewChild } from '@angular/core';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  @ViewChild('slidingItem') slidingItem: IonItemSliding;
  offers: Place[];

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.offers = this.placesService.places;
  }

  onEdit(offerId: string) {
    console.log('Editing item ', offerId);
  }

  ionViewDidLeave() {
    this.slidingItem.close();
  }
}
