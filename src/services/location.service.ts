import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { cell } from '../interfaces/cell.interface';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class LocationService {
    data: any = null;
    private API = `AIzaSyD93s62Pyhhg7NLtxzZ7Aem_sqNQSxgFQI`;
    private sheetId = `2PACX-1vSoVHxQdk9sIs9bDw_IQPNOF9YVnNfZSwlT2-HDC-F326Gkchs5bKf1cn2HJWnYgQqc6-SJo06PsHtU`;
    private sheetBaseURI = `https://spreadsheets.google.com/feeds/list/${this.sheetId}/od6/public/values?alt=json';`
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
        var API = `AIzaSyBoMCg1eMFRi0OJ5B8SHzA1ciGFFuZ1dUs`;
        var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API}`;
        return this.http.get(url);
    }


    getRncList() {
        if (this.data) {
            // already loaded data
            return Promise.resolve(this.data);
        }

        // don't have the data yet
        return new Promise(resolve => {
            // We're using Angular Http provider to request the data,
            // then on the response it'll map the JSON data to a parsed JS object.
            // Next we process the data and resolve the promise with the new data.
            this.http.get<any>(this.sheetBaseURI)
                .subscribe(data => {
                    console.log('Raw Data', data);
                    this.data = data.feed.entry;

                    let returnArray: Array<any> = [];
                    if (this.data && this.data.length > 0) {
                        this.data.forEach((entry, index) => {
                            var obj = {};
                            for (let x in entry) {
                                if (x.includes('gsx$') && entry[x].$t) {
                                    obj[x.split('$')[1]] = entry[x]['$t'];
                                    console.log( x.split('$')[1] + ': ' + entry[x]['$t'] );
                                }
                            }
                            returnArray.push(obj);
                        });
                    }
                    resolve(returnArray);
                });
        });
    }
}
