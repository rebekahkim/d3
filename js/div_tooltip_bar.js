var w = 600;
var h = 500;

var numBars = 20;
var barRange = 100;

var dataset = [];


for (i = 0 ; i <= numBars ; i++) {
	var newNum = Math.floor((Math.random() * barRange));
	dataset.push(newNum);
}

var xScale = d3.scale.ordinal()
					.domain(d3.range(dataset.length))
					.rangeRoundBands([0, w], 0.05);			// rangeBands() calculates length '[..]/domain' of bands with 															// 0.05 padding in between

var yScale = d3.scale.linear()
					.domain([0, d3.max(dataset)])	
					.range([0, h]);

var svg = d3.select('body')
			.append("svg")
			.attr('width', w)
			.attr('height', h);


svg.selectAll('rect')			
	.data(dataset)
	.enter()
	.append('rect')
	.attr('x', function(d, i ) {
		return xScale(i);
	})
	.attr('y' , function(d) {return h - yScale(d);} )
	.attr('height', function(d) {return yScale(d);})
	.attr('width', xScale.rangeBand())		
	.attr('fill' , function(d) {return "rgb(0, 0, " + (d) * 2 + ")";})
	.on('mouseover', function(d) {
		var xPosition = parseFloat(d3.select(this).attr('x')) + xScale.rangeBand() / 2;
		var yPosition = parseFloat(d3.select(this).attr('y'));			// Don't tinker with yposition here; it's futile (see svg txt below)

		// Updating tooltip position and value...
		d3.select("#tooltip")
			.style('left', xPosition + "px")
			.style('top', yPosition + "px")
			.select('#value')										// <== How does the magic happen here where d is passed to #value??? 																	Can it just insert text between span tags???
			.text(d);
		// Show tooltip
		d3.select("#tooltip").classed("hidden", false);
	})
	.on('mouseout', function(d) {
		d3.select("#tooltip").classed("hidden", true);
	})
	.on('click', function() {
		sortBars();
	})
	;
	

var sortOrder =	true

var sortBars = function() {
	sortOrder = !sortOrder; 							// flips it around

	svg.selectAll('rect')								
		.sort(function(a, b) {								// sort() passes vars to comparator ftn which takes a,b not d,i
			if (sortOrder) {
				return d3.ascending(a, b);						// Need to specify "how" to sort; here, ascending()
			}
			else {
				return d3.descending(a,b);
			}
		})
		.transition()
		.delay(function(d, i) {
	        return i * 50;
		})
		.duration(1000)
		.attr('x', function(d, i) {
			return xScale(i);
		})
		;
};