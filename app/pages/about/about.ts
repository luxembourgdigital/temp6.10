import {NavController, NavParams, Platform, Page} from 'ionic-angular';
import {Component} from '@angular/core';
import {Config} from '../../config';
import {Wordpress, Page as WordpressPage} from '../../services/wordpress';
import {WordpressContent} from '../../components/wordpress-content';

@Component({
    templateUrl: 'build/pages/about/about.html',
    providers: [Wordpress],
    directives: [WordpressContent]
})

export class AboutPage {

    page: WordpressPage;

    public constructor(
        private nav: NavController,
        private navParams: NavParams,
        private platform: Platform,
        private config: Config,
        private wordpressService: Wordpress
    ) {}
    ionViewDidEnter() {
        this.wordpressService.getPage(this.config.wordpress_aboutPageId).then(page => this.page = page);
    }

}
