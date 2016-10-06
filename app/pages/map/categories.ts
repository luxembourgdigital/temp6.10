import {NavController, NavParams, Storage, LocalStorage, MenuController, Events} from 'ionic-angular';
import {Component} from '@angular/core';
import {Wordpress, Category} from '../../services/wordpress';
import {Config} from '../../config';
import {MapPage} from './map';

@Component({
    templateUrl: 'build/pages/map/categories.html',
    providers: [Wordpress]
})

export class MapCategoriesPage {

    categories: Array<Category>;
    storage: Storage = new Storage(LocalStorage);
    tutorial: boolean = false;

    public constructor(private nav: NavController, private wordpressService: Wordpress, navParams: NavParams, private config: Config, private menu: MenuController, public events: Events) {
        this.onRefresh(null);
        this.storage.get('app.tutorial.menu').then(tutorial => {
            this.tutorial = (tutorial) ? true : false;
        })

        events.subscribe('menu:opened', (userEventData) => {
            this.storage.set('app.tutorial.menu', "1");
            this.tutorial = true;
        });
    }
    onRefresh(refresher) {

        this.wordpressService.getLocationCategoires().then(
            categories => {
                console.log(categories);
                this.categories = categories
            }
        );
    }
    onMenu() {
        this.menu.open();
    }
    onDetail(event, category) {
        this.nav.push(MapPage, {
            category: category
        });
    }
    getCategoryIcon(categoryId) {
        let icon = this.config.map_categories[categoryId];
        if (!icon) {
            icon = this.config.map_default_category;
        }
        return icon
    }

}
