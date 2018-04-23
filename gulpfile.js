const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const del = require('del');
const config = require('./gulp.config')();
const runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');


gulp.task('clean', function (callback) {
    return del([config.build.buildDirectory], callback);
});

gulp.task('build', function (done) {
    runSequence('clean', 'transpile', function () {
        done();
    })
});

gulp.task("transpile", function () {
    const tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject());
    return tsResult
        .pipe(sourcemaps.write('', {
            sourceRoot: (file) => {
                return "../src";
            }
        }))
        .pipe(gulp.dest(config.build.buildDirectory));
});
