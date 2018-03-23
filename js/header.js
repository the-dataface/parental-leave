
// window width and height (from previous DataFace projects)
var windowW = window.innerWidth;
var headerWindowW = window.innerWidth
var windowH = window.innerHeight;

// what size screen?
var large_screen = false;
var medium_screen = false;
var small_screen = false;

if (windowW > 1000) {
	large_screen = true;
} else if (windowW > 763) {
	medium_screen = true;
} else {
	small_screen = true;
}

function header() {
	d3.select('#pL-full-header-container')
	  .style('height', windowH + 'px');
	
	d3.select('.down-arrow-svg').remove();

	if (small_screen) {
		d3.select('#pL-full-header-container')
		  .append('svg')
		  .attr('class', 'down-arrow-svg')
		  .attr('width', 40)
		  .attr('height', 20)
		  .style('left', (windowW / 2) - 20)
		  .append('a')
		  .attr('class', 'scroll-button')
		  .attr('href', '#scroll-location')
		  .append('path')
		  .attr('class', 'down-arrow')
		  .attr('d', 'M18.485 19.5c-.398 0-.779-.213-1.061-.494L.814 2.369c-.586-.586-.586-1.549 0-2.134.585-.586 1.536-.593 2.121-.007L18.478 15.765 33.807.229c.582-.59 1.532-.597 2.122-.016.59 .582.595 1.531.014 2.121L19.553 18.999C19.272 19.283 18.89 19.5 18.49 19.5 18.488 19.5 18.487 19.5 18.485 19.5z');

	} else if (medium_screen) {
		d3.select('#pL-full-header-container')
		  .append('svg')
		  .attr('class', 'down-arrow-svg')
		  .attr('width', 50)
		  .attr('height', 30)
		  .style('left', (windowW / 2) - 25)
		  .append('a')
		  .attr('class', 'scroll-button')
		  .attr('href', '#scroll-location')
		  .append('path')
		  .attr('class', 'down-arrow')
		  .attr('d', 'M24.646 26c-.53 0-1.039-.284-1.414-.659L1.086 3.158c-.781-.781-.781-2.066 0-2.846.78-.781 2.048-.791 2.828-.009L24.637 21.02 45.076.305c.776-.787 2.042-.796 2.829-.021.786 .776.794 2.042.019 2.828L26.07 25.332C25.696 25.711 25.186 26 24.653 26 24.651 26 24.649 26 24.646 26z');
	} else {
		d3.select('#pL-full-header-container')
		  .append('svg')
		  .attr('class', 'down-arrow-svg')
		  .attr('width', 100)
		  .attr('height', 60)
		  .style('left', (windowW / 2) - 50)
		  .append('a')
		  .attr('class', 'scroll-button')
		  .attr('href', '#scroll-location')
		  .append('path')
		  .attr('class', 'down-arrow')
		  .attr('d', 'M49.292 52c-1.06 0-2.078-.568-2.828-1.318L2.172 6.316c-1.562-1.562-1.562-4.132 0-5.692 1.56-1.562 4.096-1.582 5.656-.018L49.274 42.04 90.152.61c1.552-1.574 4.084-1.592 5.658-.042 1.572 1.552 1.588 4.084.038 5.656L52.14 50.664C51.392 51.422 50.372 52 49.306 52 49.302 52 49.298 52 49.292 52z');
	}

	$(".scroll-button").click(function() {
		$('html,body').animate({
			scrollTop: $("#scroll-location").offset().top},
			'slow');
	});
}

header()

// on resize
window.addEventListener('resize', resize)

function resize() {
	if (headerWindowW != window.innerWidth) {
		windowW = window.innerWidth;
		headerWindowW = window.innerWidth;
		windowH = window.innerHeight;

		// what size screen?
		large_screen = false;
		medium_screen = false;
		small_screen = false;

		if (windowW > 1000) {
			large_screen = true;
		} else if (windowW > 763) {
			medium_screen = true;
		} else {
			small_screen = true;
		}

		header()
	}
}