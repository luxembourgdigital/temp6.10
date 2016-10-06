import {NavController, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import {Wordpress, Post} from '../../services/wordpress';
import {WordpressContent} from '../../components/wordpress-content';

@Component({
    templateUrl: 'build/pages/posts/detail.html',
    providers: [Wordpress],
    directives: [WordpressContent]
})
export class PostDetailPage {

    post: Post;

    constructor(private nav: NavController, navParams: NavParams) {
        this.post = navParams.get('post');
    }

}
