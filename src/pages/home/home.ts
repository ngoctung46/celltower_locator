import { Geolocation } from '@ionic-native/geolocation';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { cell } from '../../interfaces/cell.interface';
import { location } from '../../interfaces/location.interface';
import { LocationService } from '../../services/location.service';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import 'rxjs/add/operator/filter';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ 
    LocationService, 
    LaunchNavigator 
  ]
})
export class HomePage {
  title: string = "Get Location Cell Tower";
  data: any;
  model: cell = {
    MCC: 452,
    MNC: 1,
    LAC: 0,
    ID: 0,
    RNC: 0
  };
  loc: location;
  list: location[] = [];
  is3g = false;
  test: Number = 0;
  address: String = ``;
  currentPosition: String;
  destination: String;
  constructor (
    public navCtrl: NavController, 
    public locService: LocationService, 
    public launchNavigator: LaunchNavigator,
    public geoLocation: Geolocation
  ) {}

  navigate(start, end): void {
    let options: LaunchNavigatorOptions = {
      start: start,
      app: this.launchNavigator.APP.GOOGLE_MAPS
    };

    this.launchNavigator.navigate(end, options)
    .then(
      success => console.log('Launched navigator'),
      error => console.log('Error launching navigator', error)
    );
  }
  getLocation(): void {
    this.model.ID = +this.model.ID + (+this.model.RNC * 65536);
    this.locService.getLocation(this.model).subscribe(result => 
    {
      this.loc = result;
      this.list.push(this.loc);
      this.geoLocation.getCurrentPosition().then((resp) => {
        this.currentPosition = `${resp.coords.latitude},${resp.coords.longitude}`;
        this.destination = `${this.loc.location.lat},${this.loc.location.lng}`;
       }).catch((error) => {
         console.log('Error getting location', error);
       });
      if(this.loc != null){
        this.locService.getAddress(this.loc.location.lat, this.loc.location.lng).subscribe(
          res => {
            this.address = res.results[0].formatted_address || `Latitude: ${this.loc.location.lat} - Longitude: ${this.loc.location.lng}`;
        });
      }
      else {
        console.log("ERROR WHEN GETTING LOCATION");
      }
      this.reset(); 
    });    
  }

  getRncList(){
    this.locService.getRncList().then(data => this.data = data);
  }

  private reset(): void{
    this.model = {
      MCC: this.model.MCC,
      MNC: this.model.MNC,
      LAC: 0,
      ID: 0,
      RNC: 0
    };
  }
}
