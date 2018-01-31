import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { location} from '../interfaces/location.interface';
import { cell } from '../interfaces/cell.interface';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class LocationService {
    private API = `AIzaSyD93s62Pyhhg7NLtxzZ7Aem_sqNQSxgFQI`;
    private baseUrl = `https://www.googleapis.com/geolocation/v1/geolocate?key=${this.API}`;
    constructor(private http: HttpClient) { }

    getLocation(cellTower: cell): Observable<any> {
        var postBody = {
            "cellTowers": [
                {
                  "cellId": cellTower.ID,
                  "locationAreaCode": cellTower.LAC,
                  "mobileCountryCode": cellTower.MCC,
                  "mobileNetworkCode": cellTower.MNC
                }
              ]
        };
        var httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.post<any>(this.baseUrl, postBody, httpOptions);
    }

    getAddress(lat: Number, lng: Number): Observable<any> {
        var address: string = "";
        var API = `AIzaSyBoMCg1eMFRi0OJ5B8SHzA1ciGFFuZ1dUs`;
        var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API}`;
        return this.http.get(url);
    }

}