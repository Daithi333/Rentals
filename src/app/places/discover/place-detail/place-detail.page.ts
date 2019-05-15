import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;

  constructor(private navCtrl: NavController,
              private placesService: PlacesService,
              private route: ActivatedRoute) {
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
    this.navCtrl.navigateBack('/places/tabs/discover');
    // this.navCtrl.pop();
  }

}
