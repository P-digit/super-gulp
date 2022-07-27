/*

const gulp = require("gulp");
const gpug = require("gulp-pug");
const del = require("del");
const ws = require("gulp-webserver");
const image = require("gulp-imagemin");
const sass = require("gulp-sass");
*/

import gulp from "gulp";
import gpug from "gulp-pug";
import del from "del";
import ws from "gulp-webserver";
import image from "gulp-image";
import gsass from "gulp-sass";
import nsass from "node-sass";
import autoprefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";
import bro from "gulp-bro";
import babelify from "babelify";

const sass = gsass(nsass);

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build",
  },
  img: {
    src: "src/img/*",
    dest: "build/img",
  },
  scss: {
    src: "src/scss/style.scss",
    dest: "build/css",
    watch: "src/scss/**/*.scss",
  },
  js: {
    src: "src/js/main.js",
    dest: "build/js",
    watch: "src/js/*.js",
  },
};
const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del(["build"]);

const img = () =>
  gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro(babelify.configure({ presets: ["@babel/present-env"] }), [
        "uglifyify",
        { global: true },
      ])
    )
    .pipe(gulp.dest(routes.js.dest));
const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({ browsers: ["last 2 versions"] }))
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));

const webserver = () =>
  gulp.src("build").pipe(ws({ livereload: true, open: true }));

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles, js]);

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
};

const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);
