import { Injectable } from '@angular/core';

import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
      new Place(
        'p1', 
        'Manhattan Loft', 
        'In the heart of New York City!', 
        'https://mymodernmet.com/wp/wp-content/uploads/archive/82vIX0Z3jh0RiK97NAZ-_1082072560.jpeg', 300.00
      ),
      new Place(
        'p2', 
        'Amour Toujours', 
        'Rustic French cottage in romantic rural village setting', 
        'https://www.phgmag.com/wp-content/uploads/2018/06/PHG0718Art5_Pavalonis01.jpg', 
        190
      ),
      new Place(
        'p3', 
        'Beachfront Villa', 
        'Beautiful modern, secluded villa overlooking private beach', 
        'https://d3e7bfg0h5jt4g.mrandmrssmith.com/images/1482x988/3620374-mia-resort-five-bedroom-beachfront-villa-nha-trang-vietnam.jpg', 
        150
      ),
  ];

  get places() {
    return [...this._places];
  }

  constructor() {}

  getPlace(id: string) {
    return {...this._places.find(p => p.id === id)};
  }
}
