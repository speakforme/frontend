var gulp = require('gulp'),
  gp_concat = require('gulp-concat'),
  gp_rename = require('gulp-rename'),
  gp_uglify = require('gulp-uglify'),
  gp_yaml = require('gulp-yaml');

gulp.task('js:prod', function() {
  return gulp
    .src(['public/axios.min.js', 'public/vue.min.js', 'public/vue-i18n.js', 'public/vue-resource.js'])
    .pipe(gp_concat('app-single.js'))
    .pipe(gulp.dest('dist'))
    .pipe(gp_rename('app.min.js'))
    .pipe(gp_uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('locales', function() {
  return gulp
    .src('./_locales/*.yml')
    .pipe(gp_yaml({ schema: 'DEFAULT_SAFE_SCHEMA' }))
    .pipe(gulp.dest('./locales'));
});

gulp.task('default', ['locales', 'js:prod']);
