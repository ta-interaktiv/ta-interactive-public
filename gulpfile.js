var undef;
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

var now = new Date();

var env = process.env.ENV || 'dev';
var graphic = process.env.GRAPHIC || 'default';
var year = process.env.YEAR || now.getFullYear();

var devBase = 'http://localhost:9000/';

gulp.task('html', function () {

    var config;
    if (fs.existsSync('./content/' + year + '/' + graphic + '/config.json')) {
        config = require('./content/' + year + '/' + graphic + '/config.json');
    } else {
        config = require('./system/config.json');
    }

    if (env === 'dist') {
        gulp.src('./system/.htaccess')
            .pipe(gulp.dest('./builds/' + graphic + '/' + env));
    }

    if(env === 'dev') {
        var replaceURL = 'http://localhost:9000';
    } else {
        var replaceURL = '/'+year+'/'+graphic+'/';
        gulp.src('./system/.htaccess')
            .pipe(gulp.dest('./builds/' + graphic + '/' + env));
    }

    var baseUrl = env !== 'dev' ? config.distributionPath : devBase;

    return gulp.src('./system/index.html')
        .pipe(replace({
            regex: 'GULP_REPLACE_PROJECTID',
            replace: 'ta-interactive-' + graphic
        }))
        .pipe(replace({
            regex: 'GULP_REPLACE_CANONICALURL',
            replace: 'http://interaktiv.tagesanzeiger.ch/' + year + '/' + graphic + '/'
        }))
        .pipe(replace({
            regex: 'GULP_REPLACE_BASE',
            replace: baseUrl
        }))
        .pipe(replace({
            regex: 'GULP_REPLACE_TITLE',
            replace: config.title
        }))
        .pipe(replace({
            regex: 'GULP_REPLACE_MEDIANAME',
            replace: config.mediaName == undef ? 'Tages-Anzeiger' : config.mediaName
        }))
        .pipe(replace({
            regex: 'GULP_REPLACE_SHARETEXT',
            replace: config.shareText == undef ? '' : config.shareText
        }))
        .pipe(replace({
            regex: 'GULP_REPLACE_SHARELINK',
            replace: config.shareLink == undef ? baseUrl : config.shareLink
        }))
        .pipe(replace({
            regex: 'GULP_REPLACE_SHAREIMG',
            replace: config.shareImg == undef ? baseUrl + 'imgs/share_dummy.png' : config.shareImg
        }))
        .pipe(gulp.dest('./builds/' + graphic + '/' + env));
});


gulp.task('data', function () {
    if (fs.existsSync('./content/' + year + '/' + graphic + '/config.json')) {
        gulp.src('./content/' + year + '/' + graphic + '/config.json')
            .pipe(gulp.dest('./builds/' + graphic + '/' + env + '/data'));
    } else {
        gulp.src('./system/config.json')
            .pipe(gulp.dest('./builds/' + graphic + '/' + env + '/data'));
    }

    gulp.src('./system/data/**/*')
        .pipe(gulp.dest('./builds/' + graphic + '/' + env + '/data'));

    return gulp.src('./content/' + year + '/' + graphic + '/data/**/*')
        .pipe(gulp.dest('./builds/' + graphic + '/' + env + '/data'));
});

gulp.task('imgs', function () {
    gulp.src('./system/imgs/**/*')
        .pipe(gulp.dest('./builds/' + graphic + '/' + env + '/imgs'));

    return gulp.src('./content/' + year + '/' + graphic + '/imgs/**/*')
        .pipe(gulp.dest('./builds/' + graphic + '/' + env + '/imgs'));
});


gulp.task('css', function () {

    return streamqueue({objectMode: true},
        gulp.src('node_modules/ta-semantic-ui/semantic/dist/semantic.min.css'),
        gulp.src(['./system/src/sass/main.scss']).pipe(sass()),
        gulp.src(['./content/' + year + '/' + graphic + '/**/*.scss']).pipe(sass()),
        gulp.src(['./content/' + year + '/' + graphic + '/**/*.css'])
    )
        .pipe(concat('styles.css'))
        .pipe(gulpif(env !== 'dev', streamify(minifyCSS())))
        .pipe(gulp.dest('./builds/' + graphic + '/' + env + '/css'));

});

gulp.task('scss', function () {
    return gulp.src(['./content/' + year + '/' + graphic + '/**/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest('./content/' + year + '/' + graphic));
});

gulp.task('scss-watch', function () {
    gulp.watch('./content/' + year + '/' + graphic + '/**/*.scss', ['scss']);
})

gulp.task('js', function () {

    // compile system
    browserify('./system/src/js/main', {debug: env === 'dev'})
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulpif(env !== 'dev', streamify(uglify())))
        .pipe(gulp.dest('./builds/' + graphic + '/' + env + '/js'));

    // compile templates
    var templates = gulp.src(['./system/src/templates/**/*.jshtml', './content/' + year + '/' + graphic + '/**/*.jshtml'])
        .pipe(html2tpl('templates.js'))
        .pipe(gulp.dest('./builds/' + graphic + '/' + env + '/js'));

    // compile custom code
    return browserify('./content/' + year + '/' + graphic + '/app', {debug: env === 'dev'})
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulpif(env !== 'dev', streamify(uglify())))
        .pipe(gulp.dest('./builds/' + graphic + '/' + env + '/js'));

});


gulp.task('watch', function () {

    // system
    gulp.watch('system/*.html', ['html']);
    gulp.watch('system/data/**/*', ['data']);
    gulp.watch('system/config.json', ['data']);
    gulp.watch('system/imgs/**/*', ['imgs']);
    gulp.watch('system/src/sass/**/*.scss', ['css']);
    gulp.watch('system/src/js/**/*.js', ['js']);
    gulp.watch('system/src/templates/**/*.jshtml', ['js']);

    // content
    gulp.watch('content/' + year + '/' + graphic + '/data/**/*', ['data']);
    gulp.watch('content/' + year + '/' + graphic + '/config.json', ['html', 'data']);
    gulp.watch('content/' + year + '/' + graphic + '/imgs/**/*', ['imgs']);
    gulp.watch('content/' + year + '/' + graphic + '/**/*.js', ['js']);
    gulp.watch('content/' + year + '/' + graphic + '/**/*.jshtml', ['js']);
    gulp.watch('content/' + year + '/' + graphic + '/**/*.css', ['css']);
    gulp.watch('content/' + year + '/' + graphic + '/**/*.scss', ['css']);
});


gulp.task('connect', function () {
    connect.server({
        root: ['builds/' + graphic + '/' + env],
        fallback: 'builds/' + graphic + '/' + env + '/index.html',
        port: 9000,
        livereload: false
    });
});

gulp.task('default', ['html', 'data', 'imgs', 'css', 'js', 'watch', 'connect'], function () {

});

/**
 * Builds the project without watching for changes and without connecting.
 * Useful for building the distribution version.
 */
gulp.task('build', ['html', 'data', 'imgs', 'css', 'js'], function () {

});