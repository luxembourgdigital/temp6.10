var gulp = require('gulp'),
    gulpWatch = require('gulp-watch'),
    del = require('del'),
    runSequence = require('run-sequence'),
    argv = process.argv;


/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
gulp.task('serve:before', ['watch']);
gulp.task('emulate:before', ['build']);
gulp.task('deploy:before', ['build']);
gulp.task('build:before', ['build']);

// we want to 'watch' when livereloading
var shouldWatch = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;
gulp.task('run:before', [shouldWatch ? 'watch' : 'build']);

/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
var buildBrowserify = require('ionic-gulp-browserify-typescript');
var buildSass = require('ionic-gulp-sass-build');
var copyHTML = require('ionic-gulp-html-copy');
var copyFonts = require('ionic-gulp-fonts-copy');
var copyScripts = require('ionic-gulp-scripts-copy');

var isRelease = argv.indexOf('--release') > -1;

gulp.task('watch', ['clean'], function(done) {
    runSequence(
        ['sass', 'html', 'fonts', 'scripts'],
        function() {
            gulpWatch('app/**/*.scss', function() {
                gulp.start('sass');
            });
            gulpWatch('app/**/*.html', function() {
                gulp.start('html');
            });
            buildBrowserify({
                watch: true
            }).on('end', done);
        }
    );
});

gulp.task('build', ['clean'], function(done) {
    runSequence(
        ['sass', 'html', 'fonts', 'scripts'],
        function() {
            buildBrowserify({
                minify: isRelease,
                browserifyOptions: {
                    debug: !isRelease
                },
                uglifyOptions: {
                    mangle: false
                }
            }).on('end', done);
        }
    );
});

gulp.task('sass', buildSass);
gulp.task('html', copyHTML);
gulp.task('fonts', copyFonts);
gulp.task('scripts', copyScripts);
gulp.task('clean', function() {
    return del('www/build');
});


/**
 * Custom Tasks
 *
 */
var shell = require('gulp-shell'),
    scp = require('gulp-scp2');
gulp.task('release', ['release-web', 'release-android'], function() {

})

gulp.task('release-web', ['build'], function() {
    gulp.src('./www/**')
        .pipe(scp({
            host: '192.168.1.2',
            username: 'root',
            dest: '/var/www/html',
            privateKey: require('fs').readFileSync('~/.ssh/id_rsa')
        }))
        .on('error', function(err) {
            console.log(err);
        });
});

gulp.task('release-android', ['build-android'], function() {

    gulp.src('./platforms/android/build/outputs/apk/app.apk')
        .pipe(scp({
            host: '192.168.1.2',
            username: 'root',
            dest: '/var/www/html',
            privateKey: require('fs').readFileSync('~/.ssh/id_rsa')
        }))
        .on('error', function(err) {
            console.log(err);
        });
})
gulp.task('build-android', [], shell.task([
    'ionic build android',
    'mv ./platforms/android/build/outputs/apk/android-armv7-debug.apk ./platforms/android/build/outputs/apk/app.apk'
]));
