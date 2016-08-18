var path = require('path');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var replace = require('gulp-regex-replace');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var fs = require('fs');
var streamqueue = require('streamqueue');
var gulpif = require('gulp-if');
var html2tpl = require('gulp-html2tpl');

var env = 'dev';
var devBase = 'http://localhost:9000/';

gulp.task('html', function(){

    return gulp.src('./index.html')
        .pipe(replace({
            regex:'GULP_REPLACE_PROJECTID',
            replace: 'ta-interactive-content-system'
        }))
        .pipe(replace({
            regex:'GULP_REPLACE_BASE',
            replace: devBase
        }))
        .pipe(replace({
            regex:'GULP_REPLACE_TITLE',
            replace: 'Interaktive Inhalte - das System'
        }))
        .pipe(gulp.dest('./builds/'+env));
});


gulp.task('data', function(){
    
    gulp.src('./config.json')
        .pipe(gulp.dest('./builds/'+env+'/data'));

    return gulp.src('./data/**/*')
        .pipe(gulp.dest('./builds/'+env+'/data'));

});

gulp.task('imgs', function(){
    return gulp.src('./imgs/**/*')
        .pipe(gulp.dest('./builds/'+env+'/imgs'));
});


gulp.task('css', function(){

    return streamqueue({ objectMode: true },
            gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css']),
            gulp.src(['./src/sass/main.scss']).pipe(sass())
        )
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('./builds/'+env+'/css'));

});

gulp.task('js', function(){

    // compile system
    browserify('./src/js/main', { debug: env === 'dev' })
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./builds/'+env+'/js'));

    // compile templates
    var templates = gulp.src(['./src/templates/**/*.jshtml'])
        .pipe(html2tpl('templates.js'))
        .pipe(gulp.dest('./builds/'+env+'/js'));

    // compile custom code
    return browserify('./prototype/app', { debug: env === 'dev' })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulpif(env !== 'dev', streamify(uglify())))
        .pipe(gulp.dest('./builds/'+env+'/js'));

});

/*
gulp.task('spin', function(){
    return gulp.src('spin.js')
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('builds/test/js'));
});
*/

gulp.task('watch', function(){

    // system
    gulp.watch('*.html', ['html']);
    gulp.watch('data/**/*', ['data']);
    gulp.watch('config.json', ['data']);
    gulp.watch('imgs/**/*', ['imgs']);
    gulp.watch('src/sass/**/*.scss', ['css']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/templates/**/*.jshtml', ['js']);

});


gulp.task('connect', function(){
    connect.server({
        root: ['builds/'+env],
        fallback: 'builds/'+env+'/index.html',
        port: 9000,
        livereload: false
    });
});

gulp.task('default', ['html', 'data', 'imgs', 'css', 'js', 'watch', 'connect'], function(){

});