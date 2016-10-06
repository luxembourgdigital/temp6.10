import {Storage, LocalStorage, AlertController, LoadingController} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Config} from '../config';
import {Network} from 'ionic-native';
import 'rxjs/Rx';

export interface Category {
    id: number
    name: string
    slug: string
}

export class Post {
    id: number
    title: { rendered: string }
    subtitle: string
    excerpt: { rendered: string }
    content: { rendered: string }
}

export class Page extends Post {
    parent: number;
}

export class Location extends Post {
    parent: number
    location: { lat: number, long: number, address: string, phone: string, email: string, website: string, fax: string }
    distance: number
}

@Injectable()
export class Wordpress {

    storage: Storage = new Storage(LocalStorage);

    constructor(
        private http: Http,
        private config: Config,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController
    ) {}

    private loadFromCache<T>(key) {
        return new Promise((resolve: (values: T) => void, reject) => {
            if(!this.config.cache) {
                resolve(null);
                return;
            }
            this.storage.get(key).then(data => {
                if (data == null) {
                    resolve(null);
                } else {
                    let object = JSON.parse(data);
                    let nowDate = new Date();
                    let cacheDate = new Date(object.date);
                    if ((cacheDate.getTime() + this.config.cache_expire) < nowDate.getTime()) {
                        resolve(null);
                    } else {
                        resolve(object.bag);
                    }
                }
            });
        })
    }
    private saveCache(key, object) {
        let cacheBag = {
            date: new Date(),
            bag: object
        };
        this.storage.set(key, JSON.stringify(cacheBag));
    }
    private handleError() {

        let alert = this.alertCtrl.create({
            title: 'Fehler',
            subTitle: 'Fehler beim Laden. Bitte überprüfen Sie Ihre Internet-Verbindung.',
            buttons: ['OK']
        });
        alert.present();
    }
    private getAll<T>(url, hasLoading: boolean = true) {
        return new Promise((resolve: (values: T) => void, reject) => {
            if (Network.connection == 'none') {
                this.loadFromCache<T>(url).then(object => {
                    if (object == null) {
                        reject();
                        this.handleError();
                    } else {
                        resolve(object);
                    }
                });
            } else {
                this.loadFromCache<T>(url).then(object => {
                    let loading = null;
                    if (object == null) {

                        if (hasLoading) {
                            loading = this.loadingCtrl.create();
                            loading.present();
                        }

                        this.http.get(this.config.wordpress_endpoint + url).toPromise().then(response => {
                            if (response.status == 200) {
                                this.saveCache(url, response.json())
                                resolve(response.json());
                                if (hasLoading) loading.dismiss();
                            } else {
                                reject();
                                if (hasLoading) loading.dismiss();
                                this.handleError();
                            }

                        }, error => {
                            reject();
                            if (hasLoading) loading.dismiss();
                            this.handleError();
                        })
                    } else {
                        resolve(object);
                    }
                })
            }

        })


    }

    getPosts(filter: string = "") {
        return this.getAll<Array<Post>>('wp/v2/posts?per_page=100&' + filter)
    }
    getPage(pageId: number) {
        return this.getAll<Page>('wp/v2/pages/' + pageId)
    }
    getPagesBySlug(slug: string) {
        return this.getAll<Array<Page>>('wp/v2/pages?slug=' + slug)
    }
    getPages(parentId: number, hasLoading: boolean = true) {
        return this.getAll<Array<Page>>('wp/v2/pages?parent=' + parentId, hasLoading)
    }
    getLocationCategoires() {
        return this.getAll<Array<Category>>('wp/v2/location-categories?per_page=100')
    }
    getLocations(categorySlug: string) {
        return this.getAll<Array<Location>>('wp/v2/locations?per_page=100&filter[location_categories]=' + categorySlug);
    }

}
