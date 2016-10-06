import {Page, ViewController, Slides, NavController, Storage, LocalStorage} from 'ionic-angular';
import {Component, ViewChild} from '@angular/core';
import {MapCategoriesPage} from '../../pages';

interface Slide {
    title: string;
    description: string;
    image: string;
}

@Component({
    templateUrl: 'build/pages/tutorial/tutorial.html'
})
export class TutorialPage {

    slideOptions = {
        pager: true
    };
    storage: Storage = new Storage(LocalStorage);
    @ViewChild('slider') slider: Slides;

    constructor(private nav: NavController) {

    }
    ionViewDidEnter() {
        this.storage.set('app.tutorial', 1);
    }
    onNext() {
        this.slider.slideNext(500);
    }
    onStart() {
        this.nav.setRoot(MapCategoriesPage);
    }



}
