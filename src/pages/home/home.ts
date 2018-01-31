import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { cell } from '../../interfaces/cell.interface';
import { location } from '../../interfaces/location.interface';
import { LocationService } from '../../services/location.service';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ LocationService ]
})
export class HomePage {
  title: string = "Get Location Cell Tower";
  model: cell = {
    MCC: 452,
    MNC: 2,
    LAC: 242,
    ID: 42173,
    RNC: 0
  };
  loc: location = {
    location: {
      lat: 0,
      lng: 0
    },
    accuracy: 0
  };
  is3g = false;
  test: Number = 0;
  address: String = ``;
  constructor(public navCtrl: NavController, public locService: LocationService) 
  {
    this.getLocation();
  }

  getLocation(): void {
    this.model.ID = +this.model.ID + (+this.model.RNC * 65536);
    this.locService.getLocation(this.model).subscribe(result => 
    {
      this.loc = result;
      this.locService.getAddress(this.loc.location.lat, this.loc.location.lng).subscribe(
        res => {
          this.address = res.results[0].formatted_address || `Latitude: ${this.loc.location.lat} - Longitude: ${this.loc.location.lng}`;
        });
      
    });    
  }
}
