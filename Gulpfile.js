var gulp = require('gulp'),
  gp_concat = require('gulp-concat'),
  gp_rename = require('gulp-rename'),
  gp_uglify = require('gulp-uglify');

gulp.task('js', function() {
  return gulp
    .src(['public/vue.min.js', 'public/vue-i18n.js', 'public/vue-resource.js'])
    .pipe(gp_concat('app-single.js'))
    .pipe(gulp.dest('dist'))
    .pipe(gp_rename('app.min.js'))
    .pipe(gp_uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['js']);
