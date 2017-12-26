(function() {
  'use strict';

  var gulp = require('gulp');
  var inline = require('gulp-inline-source');
  var htmlmin = require('gulp-htmlmin');
  var less = require('gulp-less');

  /**
   *
   */
  gulp.task('watch', function() {
    gulp.watch(__dirname + '/src/**/*.less', ['css', 'html']);
    gulp.watch(__dirname + '/src/**/*.js', ['html']);
    gulp.watch(__dirname + '/src/**/*.html', ['html']);
  });

  /**
   *
   */
  gulp.task('css', function(){
    gulp.src(__dirname + '/src/**/*.less')
      .pipe(less().on('error', handleError))
      .pipe(gulp.dest(function(file){
        return file.base;
      }));
  });

  /**
   *
   */
  gulp.task('html', ['css'], function () {
    setTimeout(function(){
      return gulp.src('./src/*.html')
        .pipe(inline({compress:true}))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(__dirname));
    }, 100);
  });

  /**
   * @param err
   */
  function handleError(err) {
    var gutil = require('gulp-util');

    gutil.log(gutil.colors.red(err));
    this.emit('end');
  }

}());
