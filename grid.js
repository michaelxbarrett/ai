function gridData() {
	var data = new Array();
	var xpos = 1; 	
	var ypos = 1;
	var width = 7.5;
	var height = 7.5;
	var click = 0;
	
	// iterate for rows	
	for (var row = 0; row < 101; row++) {
		data.push( new Array() );
		
		// iterate for cells/columns inside rows
		for (var column = 0; column < 101; column++) {
			data[row].push({
				x: xpos,
				y: ypos,
				width: width,
				height: height,
				click: click,
				row: row,
				column: column
			})
			// increment the x position
			xpos += width;
		}
		// reset the x position after a row is complete
		xpos = 1;
		// increment the y position for the next row
		ypos += height;	
	}
	return data;
}

var gridData = gridData();	
// log the data to the console for quick debugging
console.log(gridData);

var grid = d3.select("#grid")
	.append("svg")
	.attr("width","800px")
	.attr("height","800px");
	
var row = grid.selectAll(".row")
	.data(gridData)
	.enter().append("g")
	.attr("class", "row");
	
var column = row.selectAll(".square")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("class","square")
	.attr("x", function(d) { return d.x; })
	.attr("y", function(d) { return d.y; })
	.attr("id", function(d) { return ("" + d.row + "," + d.column); })
	.attr("width", function(d) { return d.width; })
	.attr("height", function(d) { return d.height; })
	.style("fill", "#fff")
	.style("stroke", "#222")
	.on('click', function(d) {
       d.click ++;
       if ((d.click)%4 == 0 ) { d3.select(this).style("fill","#fff"); }
	   if ((d.click)%4 == 1 ) { d3.select(this).style("fill","#000000"); }
	   if ((d.click)%4 == 2 ) { d3.select(this).style("fill","#00FF00"); }
	   if ((d.click)%4 == 3 ) { d3.select(this).style("fill","#FF0000"); }
    });
