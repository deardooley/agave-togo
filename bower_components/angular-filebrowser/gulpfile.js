'use strict';

// Require
var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');  // caches the templates with $templateCache
var uglify = require('gulp-uglify');                        // minifies JavaScript
var minifyCss = require('gulp-minify-css');                 // minifies CSS
var concat = require('gulp-concat');                        // concat JavaScript
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var del = require('del');
var path = require('path');

// Vars
var src = 'src/';
var dst = 'dist/';
var tplPath = 'src/templates'; //must be same as fileManagerConfig.tplPath
var jsFile = 'agave-angular-filemanager.min.js';
var cssFile = 'agave-angular-filemanager.min.css';

gulp.task('clean', function (cb) {
  del(dst + '/*', cb);
});

gulp.task('cache-templates', function () {
  return gulp.src(tplPath + '/*.html')
    .pipe(templateCache(jsFile, {
      module: 'FileManagerApp',
      base: function(file) {
        return tplPath + '/' + path.basename(file.history[0]);
      }
    }))
    .pipe(gulp.dest(dst));
});

gulp.task('concat-uglify-js', ['cache-templates'], function() {
  return gulp.src([
    src + 'js/app.js',
      src + 'js/*/*.js',
      dst + '/' + jsFile
    ])
    .pipe(concat(jsFile))
      .pipe(uglify({
        mangle: false
      }))
    .pipe(gulp.dest(dst));
});

gulp.task('sass', function () {
  gulp.src('./src/css/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('./src/css'));
});

gulp.task('minify-css', ['sass'], function() {
  return gulp.src(src + 'css/*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(concat(cssFile))
    .pipe(gulp.dest(dst));
});

gulp.task('css', ['minify-css'],function () {
  gulp.src(['./src/css/*.css'])
      .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src(['./src/*.js', './src/**/*.js'])
      .pipe(connect.reload());
});

gulp.task('html', function () {
  gulp.src(['./*.html', './src/templates/*.html'])
      .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('./src/css/*.scss', ['sass', 'css']);
  gulp.watch(['./src/*.js','./src/**/*.js'], ['js']);
  gulp.watch(['./*.html', './src/templates/*.html'], ['html']);
});

gulp.task('connect', function() {
  connect.server({
    livereload: true,
    port: 9000,
    https: false,
  });
});


gulp.task('localhost', ['connect', 'watch']);

gulp.task('default', ['concat-uglify-js', 'minify-css']);
gulp.task('build', ['default']);
