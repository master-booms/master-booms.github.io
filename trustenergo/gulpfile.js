var 	gulp         = require('gulp'),
		sass         = require('gulp-sass'),	
		cleanCSS     = require('gulp-clean-css'),
		rename       = require('gulp-rename'),
		browserSync  = require('browser-sync').create(),
		concat       = require('gulp-concat'),
		uglify       = require('gulp-uglify'),
		autoprefixer = require('gulp-autoprefixer');


gulp.task('browser-sync', ['styles', 'scripts'], function() {
	browserSync.init({
		server: {
			baseDir: "./app"
		},
		notify: false
	});
});

gulp.task('styles', function () {
	return gulp.src('sass/*.sass')
	.pipe(sass({
		includePaths: require('node-bourbon').includePaths
	}).on('error', sass.logError))
	//.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer({browsers: ['last 3 versions'], cascade: false}))
	//.pipe(cleanCSS())
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream());
});





gulp.task('scripts', function() {
	return gulp.src([
		// './app/libs/modernizr/modernizr.js',
		'./app/libs/jquery/jquery-1.11.2.min.js',
		//'./app/libs/jquery.nicescroll/jquery.nicescroll.js',
		//'./app/libs/select/select2.min.js',
		//'./app/libs/bxslider/jquery.bxslider.js',
		//'./app/libs/magnific-popup/dist/jquery.magnific-popup.js',
		//'./app/libs/slider/owl.carousel.min.js',
		//'./app/libs/form/jquery.form.js',
		//'./app/libs/bPopup/jquery.bpopup.js'

		// './app/libs/jquery-ui/jquery-ui.min.js',
		// './app/libs/limit/jquery.limit.js',
		// './app/libs/label_better/jquery.label_better.js',
		// './app/libs/waypoints/waypoints.min.js',
		// './app/libs/animate/animate-css.js',
		// './app/libs/plugins-scroll/plugins-scroll.js',
		// './app/libs/bpopup/jquery.bpopup.min.js'
		

		])
	.pipe(concat('libs.js'))
		// .pipe(uglify()) //Minify libs.js
		.pipe(gulp.dest('./app/js/'));
	});










gulp.task('watch', function () {
	gulp.watch('sass/*.sass', ['styles']);
	gulp.watch('app/libs/**/*.js', ['scripts']);
	gulp.watch('app/js/*.js').on("change", browserSync.reload);
	gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);
