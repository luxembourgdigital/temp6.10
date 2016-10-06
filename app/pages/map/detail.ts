import {NavController, NavParams, Platform} from 'ionic-angular';
import {Component} from '@angular/core';
import {Wordpress, Location} from '../../services/wordpress';
import {Config} from '../../config';
import {LaunchNavigator, EmailComposer, InAppBrowser} from 'ionic-native';


@Component({
    templateUrl: 'build/pages/map/detail.html',
    providers: [Wordpress]
})
export class MapDetailPage {

    location: Location
    map: google.maps.Map;

    public constructor(private nav: NavController, private wordpressService: Wordpress, navParams: NavParams, private config: Config, private platform: Platform) {
        this.location = navParams.get('location');

    }
    ionViewDidEnter() {


        this.map = new google.maps.Map(document.getElementById("detail-map"), {
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false
        });
        let position = new google.maps.LatLng(this.location.location.lat, this.location.location.long);

        this.map.setCenter(position);
        let marker = new google.maps.Marker({
            position,
            map: this.map,
            title: this.location.title.rendered,
            animation: google.maps.Animation.DROP,
            icon: 'img/marker.png'
        });

    }

    onMail() {

        if (this.platform.is('cordova')) {
            EmailComposer.open({
                to: [this.location.location.email]
            });
        } else {
            window.open("mailto:" + this.location.location.email);
        }
    }
    onWebsite() {
        if (this.platform.is('cordova')) {
            InAppBrowser.open(this.location.location.website);
        } else {
            window.open(this.location.location.website);
        }

    }
    onNavigate() {
        if (this.platform.is('cordova')) {
            LaunchNavigator.navigate([this.location.location.lat, this.location.location.long]);
        } else {
            window.open("http://maps.google.com/maps?daddr=" + this.location.location.lat + "," + this.location.location.long + "");
        }

    }
    onPhone() {
        window.open("tel:" + this.location.location.phone);
    }

}
