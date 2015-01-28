var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    browserSync = require('browser-sync'),
    express = require('express'),
    minimist = require('minimist'),
    minifyCss = require('gulp-minify-css'),
    buffer = require('gulp-buffer'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    plugins = require('gulp-load-plugins')(),
    uncss = require('gulp-uncss'),
    csso = require('gulp-csso'),
    options = minimist(process.argv),
    enviroment = options.enviroment || 'development',
    server,
    handleError,
    reload;

handleError = function (err) {
    console.log(err.toString());
    this.emit('end');
};

reload = function () {
    if (server) {
        return browserSync.reload({stream: true});
    }
    return gutil.noop();
};

gulp.task('styles', function () {
    return gulp.src('files path')
        .pipe(plugins.sass()).on('error', handleError)
        .pipe(enviroment === 'production' ? plugins.minifyCss() : gutil.noop())
        .pipe(gulp.dest('destination path'))
        .pipe(reload());
});

gulp.task('scripts', function () {
    return browserify('main file path')
        .bundle().on('error', handleError)
        .pipe(source('bundle.js'))
        .pipe(enviroment === 'production' ? buffer() : gutil.noop())
        .pipe(enviroment === 'production' ? uglify() : gutil.noop())
        .pipe(gulp.dest('destination path'))
        .pipe(reload());
});

gulp.task('images', function () {
    return gulp.src('files path')
        .pipe(imagemin())
        .pipe(gulp.dest('destination path'))
        .pipe(reload());
});

gulp.task('uncss', function() {
    return gulp.src('_site/css/main.css')
    .pipe(uncss({
        html: ['_site/**/*.html']
    }))
    .pipe(gulp.dest('./uncss/'));
});

gulp.task('csso', function() {
    return gulp.src('./uncss/main.css')
    .pipe(csso())
    .pipe(gulp.dest('./csso/'));
});

gulp.task('copy', function() {
    gulp.src('csso/main.css')
    .pipe(gulp.dest('dist'));
});

gulp.task('default',['uncss', 'csso', 'copy']);

gulp.task('server', function () {
    server = express();
    server.use(express.static('static folder'));
    server.listen(5000);
    browserSync({proxy: 'localhost:5000'});
});
