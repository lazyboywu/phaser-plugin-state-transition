'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var tsify = require('tsify');
var header = require('gulp-header');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('build', function(){

    return browserify({
        basedir: '.',
        debug: false,
        entries: ['src/index.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('phaser-plugin-state-transition.js'))
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest("dist"))
    .pipe(buffer())
    .pipe(rename({suffix:'.min'}))
    .pipe(uglify())
    .pipe(header(banner, { pkg : pkg } ))
    .pipe(gulp.dest("dist"));
});

gulp.task('default', ['build']);
