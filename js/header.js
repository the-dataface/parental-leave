
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
		  .attr('width', 90)
		  .attr('height', 50)
		  .style('left', (windowW / 2) - 45)
		  .append('a')
		  .attr('class', 'scroll-button')
		  .attr('href', '#scroll-location')
		  .append('path')
		  .attr('class', 'down-arrow')
		  .attr('d', 'M43 46c-1 0-2 0-2-1L2 6c-1-1-1-4 0-5 1-1 4-1 5 0L43 37 79 1c1-1 4-1 5 0 1 1 1 4 0 5L46 44C45 45 44 46 43 46 43 46 43 46 43 46z');
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