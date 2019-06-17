import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { PlaceLocation } from './location.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  get places() {
    // return [...this._places];
    // gettable places returns a subscribable Subject (subscription only, cannot be used to view new events)
    return this._places.asObservable();
  }

  fetchPlaces() {
    return this.http
      .get<{[key: string]: PlaceData }>('https://udemy-rentals-app.firebaseio.com/offered-places.json')
      .pipe(
        map(resData => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId,
                  resData[key].location
                )
              );
            }
          }
          return places;
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }
  // could use another method to fetch from server only whenplace data is not available locally
  // getPlace(id: string) {
  //   // return {...this._places.find(p => p.id === id)};
  //   return this.places.pipe(
  //     take(1),
  //     map(places => {
  //       return {...places.find(p => p.id === id) };
  //     })
  //   );
  // }

  getPlace(id: string) {
    return this.http
    .get<PlaceData>(
      `https://udemy-rentals-app.firebaseio.com/offered-places/${id}.json`
    )
    .pipe(
      map(placeData => {
        return new Place(
          id,
          placeData.title,
          placeData.description,
          placeData.imageUrl,
          placeData.price,
          new Date(placeData.availableFrom),
          new Date(placeData.availableTo),
          placeData.userId,
          placeData.location
        );
      })
    );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.http.post<{imageUrl: string, imagePath: string}>(
      'https://us-central1-udemy-rentals-app.cloudfunctions.net/storeImage', 
      uploadData
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date,
    location: PlaceLocation,
    imageUrl: string
  ) {
    let generatedId: string;
    let newPlace: Place;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('no user Found!');
        }
        newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          imageUrl,
          price,
          dateFrom,
          dateTo,
          userId,
          location
        );
        return this.http.post<{name: string}>(
          'https://udemy-rentals-app.firebaseio.com/offered-places.json',
          { ...newPlace, id: null }
        );
      }),
      switchMap(responseData => {
        generatedId = responseData.name;
        return this.places;
      }),
      take(1),
      tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );

    // this._places.push(newPlace);
    // instead of pushing to array, now the data is stored in BehaviourSubject,
    // so use next to emit new event which is array of places + new
    // take - look at places subject, subscribe to it, only take 1 object and then cancel the subscription
    // return added so the new offer page's loading controller would know when the task was completed
    // tap() allows access to without completing / consuming the observable
    // return this.places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //     this._places.next(places.concat(newPlace));
    //   })
    // );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places); // of creates an observable of the object it was called on. (switchMap needs to return one)
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location
        );
        return this.http.put(
          `https://udemy-rentals-app.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
    // return observable so in edit-offer page we can see when operation is completed
    // return this.places.pipe(take(1), delay(1000), tap(places => {
    //   const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
    //   const updatedPlaces = [...places];
    //   const oldPlace = updatedPlaces[updatedPlaceIndex];
    //   updatedPlaces[updatedPlaceIndex] = new Place(
    //     oldPlace.id,
    //     title,
    //     description,
    //     oldPlace.imageUrl,
    //     oldPlace.price,
    //     oldPlace.availableFrom,
    //     oldPlace.availableTo,
    //     oldPlace.userId
    //   );
    //   this._places.next(updatedPlaces);
    // }));
  }
}
