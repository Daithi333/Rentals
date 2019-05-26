import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>(
    [
      new Place(
        'p1',
        'Manhattan Loft',
        'In the heart of New York City!',
        'https://mymodernmet.com/wp/wp-content/uploads/archive/82vIX0Z3jh0RiK97NAZ-_1082072560.jpeg',
        300.00,
        new Date ('2019-01-01'),
        new Date ('2025-12-31'),
        'abc'
      ),
      new Place(
        'p2',
        'Amour Toujours',
        'Rustic French cottage in romantic rural village setting',
        'https://www.phgmag.com/wp-content/uploads/2018/06/PHG0718Art5_Pavalonis01.jpg',
        190,
        new Date ('2019-01-01'),
        new Date ('2025-12-31'),
        'xyz'
      ),
      new Place(
        'p3',
        'Beachfront Villa',
        'Beautiful modern, secluded villa overlooking private beach',
        'https://d3e7bfg0h5jt4g.mrandmrssmith.com/images/1482x988/3620374-mia-resort-five-bedroom-beachfront-villa-nha-trang-vietnam.jpg',
        150,
        new Date ('2019-01-01'),
        new Date ('2025-12-31'),
        'ghi'
      ),
  ]
  );

  constructor(private authService: AuthService) {}

  get places() {
    // return [...this._places];
    // gettable places returns a suscribible Subject (subscription only, cannot be used to view new events)
    return this._places.asObservable();
  }

  getPlace(id: string) {
    // return {...this._places.find(p => p.id === id)};
    return this.places.pipe(
      take(1),
      map(places => {
        return {...places.find(p => p.id === id) };
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://www.squareyards.com/blog/wp-content/uploads/2015/06/Holiday-Home.png',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    // this._places.push(newPlace);
    // instead of pushing to array, now the data is stored in BehaviourSubject,
    // so use next to emit new event which ios array of places + new
    // take - look at places subject, suscribe to it, only take 1 object and then cancel the subscription
    this.places.pipe(take(1)).subscribe(places => {
      this._places.next(places.concat(newPlace));
    });
  }
}
