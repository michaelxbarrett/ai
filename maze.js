class Node {
	constructor(x,y){
			this.x = x;
			this.y = y;
			this.isBlocked = false;
			this.neighbors = [];
			this.g = Infinity;
			this.search = 0;
			this.c = 1;
			this.f = Infinity;
	}

	compareTo(node){
		if (this.f < node.f){
			return -1;
		}
		if (this.f > node.f){
			return 1;
		}
		if (this.g < node.g){
			return -1;
		}
		if (this.g > node.g){
			return 1;
		}
		return 0;
	}
}

class PriorityQueue {
	constructor(){
		this.heap = new Array(500);
		this.size = 0;
	}
	clear(){
		this.heap.length = 0;
		this.size = 0;
	}

	contains(node){
		var k = -1;
		for (var i = 0; i < this.size; i++){
			if (node.x == this.heap[i].x && node.y == this.heap[i].y){
				k = i;
			}
		}
		if (k == -1){
			return false;
		}
		return this.heap[k];
	}

	insert(node){
		if (!node){
			return;
		}

		this.heap[this.size] = node;
		this.size++;
		var k = this.size - 1;
		while (k > 0){
			if (this.heap[k].compareTo(this.heap[Math.floor((k - 1)/2)]) < 0){
				var temp = this.heap[k];
				this.heap[k] = this.heap[Math.floor((k - 1)/2)];
				this.heap[Math.floor((k - 1)/2)] = temp;
				k = Math.floor((k - 1)/2);
			} else {
				break;
			}
		}

		
		
	}
	pop(){
		if (this.size == 0){ return; }
		var node = this.heap[0];
		var k = 0;
		this.heap[0] = this.heap[this.size - 1];
		this.size--;
		while ((k * 2 + 1) < this.size){
			var child = k * 2 + 1;
			if (this.heap[k * 2 + 2]){
				if (this.heap[k*2 + 2].compareTo(this.heap[k*2 + 1]) < 0){
					child = k * 2 + 2;
				}
			}
			if (this.heap[k].compareTo(this.heap[child]) > 0){
				var temp = this.heap[k];
				
				this.heap[k] = this.heap[child];
				this.heap[child] = temp;
				k = child;
				
			} else { 
				this.heap.pop();
				return node;
			}
		}
		this.heap.pop();
		return node;
	}


	delete(node){
		var k = -1;
		for (var i = 0; i < this.size; i++){
			if (node.x == this.heap[i].x && node.y == this.heap[i].y){
				k = i;
			}
		}
		if (k == -1){
			return;
		}
		this.heap[k] = this.heap[this.size - 1];

		if (k == 0 || this.heap[Math.floor((k - 1)/2)].compareTo(this.heap[k].f) < 0) {
			/* Sift down */
			while ((k * 2 + 1) < this.size){
				var child = k * 2 + 1;
				if (this.heap[k * 2 + 2]){
					if (this.heap[k*2 + 2].compareTo(this.heap[k*2 + 1]) < 0){
						child = k * 2 + 2;
					}
				}
				if (this.heap[k].compareTo(this.heap[child]) > 0){
					var temp = this.heap[k];
					
					this.heap[k] = this.heap[child];
					this.heap[child] = temp;
					k = child;
					
				} else { 
					break;
				}
			}
			var temp = this.heap[k]
			this.heap[k]
		} else {
			while (k > 0){
				if (this.heap[k].compareTo(this.heap[Math.floor((k - 1)/2)]) < 0){
					var temp = this.heap[k];
					this.heap[k] = this.heap[Math.floor((k - 1)/2)];
					this.heap[Math.floor((k - 1)/2)] = temp;
					k = Math.floor((k - 1)/2);
				} else {
					break;
				}
			}
		}
		this.heap.pop();
		this.size--;
	}
	peek(){
		if (this.size == 0){ return; }
		return this.heap[0];
	}

	
}



class Maze {
	reset(){
		row.selectAll('.square').style('fill', '#666')
		d3.selectAll(".square").style("stroke", "#000")
		maze.load(file);
	}
	constructor(){
		this.openList = new PriorityQueue();
		this.closedList = new PriorityQueue();
		this.counter = 0;
		this.numberOfCellsExpanded = 0;
	}

	generateMaze(){
		/* Create nodes[101][101] */
		var nodes = new Array(101);

		/* Create visited[101][101] */
		var visited = new Array(101);
		for (var i = 0; i < 101; i++){
			visited[i] = new Array (101);
			visited[i].fill(false);
		}
		

		/* Generate nodes */
		for (i = 0; i < 101; i++){
			/* Create second dimension of array */
			nodes[i] = new Array(101);
			for (var j = 0; j < 101; j++){
				/* Make sure array space exists because full array not actually allocated */
				if (!nodes[i]){
					nodes[i] = []
				}
				nodes[i][j] = new Node(j,i);
			}
		}

		/* Link nodes */
		for (i = 0; i < 101; i++){
			for (j = 0; j < 101; j++){
				if (i + 1 < 101){
					nodes[i][j].neighbors.push(nodes[i + 1][j]);
				}
				if (0 <= i - 1){
					nodes[i][j].neighbors.push(nodes[i - 1][j]);
				}
				if (j + 1 < 101){
					nodes[i][j].neighbors.push(nodes[i][j + 1]);
				}
				if (0 <= j - 1){
					nodes[i][j].neighbors.push(nodes[i][j - 1]);
				}
			}
		}

		

		/* Build walls in maze w/ iterative DFS */
		var stack = [];
		stack.push(nodes[0][0]);
		while (stack.length > 0){
			var node = stack.pop();
			visited[node.y][node.x] = true;
			var r = Math.floor(Math.random() * 100);
			if (r < 20) { // 25% chance
				node.isBlocked = true;
			}
			for (var i in node.neighbors){
				var neighbor = node.neighbors[i];
				if (!neighbor){ continue;}
				if (!visited[neighbor.y][neighbor.x]){
					stack.push(neighbor);
				}
			}
		} 

		/* Save data */
		for (i=0;i<101;i++){
			for (j=0;j<101;j++){
				if (nodes[i][j].isBlocked){
					this.data = this.data + "1";
				} else {
					this.data = this.data + "0";
				}
			}
		}

		
		var y = Math.floor(Math.random() * 100);
		var z = Math.floor(Math.random() * 100);
		while (nodes[y][z].isBlocked){ y = Math.floor(Math.random() * 100); z = Math.floor(Math.random() * 100); }
		
		this.agent = nodes[y][z];
		y = Math.floor(Math.random() * 100);
		z = Math.floor(Math.random() * 100);
		while (nodes[y][z].isBlocked){ y = Math.floor(Math.random() * 100); z = Math.floor(Math.random() * 100); }
		this.target = nodes[y][z];
		this.start = this.agent

		/* Add agent and target info to data */
		this.data = this.data + " " + this.target.x;
		this.data = this.data + " " + this.target.y;
		this.data = this.data + " " + this.agent.x;
		this.data = this.data + " " + this.agent.y;

		/* Set heuristic values */
		for (i = 0; i < 101; i++){
			for (j = 0; j < 101; j++){
				nodes[i][j].h = Math.abs(nodes[i][j].x - this.target.x) + Math.abs(nodes[i][j].y - this.target.y);
			}
		}
		
	}

	configure(r){
		var data = r.split(" ");

		/* Create nodes[101][101] */
		var nodes = new Array(101);

		/* Create visited[101][101] */
		var visited = new Array(101);
		for (var i = 0; i < 101; i++){
			visited[i] = new Array (101);
			visited[i].fill(false);
		}
		

		/* Generate nodes */
		var k = 0;
		for (i = 0; i < 101; i++){
			/* Create second dimension of array */
			nodes[i] = new Array(101);
			for (var j = 0; j < 101; j++){
				/* Make sure array space exists because full array not actually allocated */
				if (!nodes[i]){
					nodes[i] = []
				}
				nodes[i][j] = new Node(j,i);
				nodes[i][j].isBlocked = data[0][k] == '1' ? true : false;
				k++;
			}
		}

		/* Link nodes */
		for (i = 0; i < 101; i++){
			for (j = 0; j < 101; j++){
				if (i + 1 < 101){
					nodes[i][j].neighbors.push(nodes[i + 1][j]);
				}
				if (0 <= i - 1){
					nodes[i][j].neighbors.push(nodes[i - 1][j]);
				}
				if (j + 1 < 101){
					nodes[i][j].neighbors.push(nodes[i][j + 1]);
				}
				if (0 <= j - 1){
					nodes[i][j].neighbors.push(nodes[i][j - 1]);
				}
			}
		}

		

		/* Build walls in maze w/ iterative DFS 
		var stack = [];
		stack.push(nodes[0][0]);
		while (stack.length > 0){
			var node = stack.pop();
			visited[node.y][node.x] = true;
			var r = Math.floor(Math.random() * 100);
			if (r < 30) { // 30% chance
				node.isBlocked = true;
			}
			for (var i in node.neighbors){
				var neighbor = node.neighbors[i];
				if (!neighbor){ continue;}
				if (!visited[neighbor.y][neighbor.x]){
					stack.push(neighbor);
				}
			}
		} */

		/* Save data 
		for (i=0;i<101;i++){
			for (j=0;j<101;j++){
				if (nodes[i][j].isBlocked){
					this.data = this.data + "1";
				} else {
					this.data = this.data + "0";
				}
			}
		}*/

		/*
		var y = Math.floor(Math.random() * 100);
		var z = Math.floor(Math.random() * 100);
		while (nodes[y][z].isBlocked){ y = Math.floor(Math.random() * 100); z = Math.floor(Math.random() * 100); }
		*/
		this.agent = nodes[data[4]][data[3]];
		//y = Math.floor(Math.random() * 100);
		//z = Math.floor(Math.random() * 100);
		//while (nodes[y][z].isBlocked){ y = Math.floor(Math.random() * 100); z = Math.floor(Math.random() * 100); }
		this.target = nodes[data[2]][data[1]];
		this.start = this.agent

		/* Add agent and target info to data 
		this.data = this.data + " " + this.target.x;
		this.data = this.data + " " + this.target.y;
		this.data = this.data + " " + this.agent.x;
		this.data = this.data + " " + this.agent.y;*/

		/* Set heuristic values */
		for (i = 0; i < 101; i++){
			for (j = 0; j < 101; j++){
				nodes[i][j].h = Math.abs(nodes[i][j].x - this.target.x) + Math.abs(nodes[i][j].y - this.target.y);
			}
		}
		for (var i = 0; i < 101;i++){
			for (var j = 0; j < 101; j++){
				if (this.agent.x == j && this.agent.y == i){
					this.displayCellAsAgent(i,j);
					continue;
				}
				if (this.target.x == j && this.target.y == i){
					this.displayCellAsTarget(i,j);
					continue;
				}
				if (nodes[i][j].isBlocked){
					this.displayCellAsBlocked(i,j);
				}
			}
		}
		this.nodes = nodes;
	}

	load(blob){
		//this.data = "";
		var maze = this;
		var reader = new FileReader();
		reader.onload = function(e) {
		    maze.configure(e.target.result);
		};
		reader.readAsText(blob);
		
	}

	displayCellAsBlocked(i,j){
		var target = document.getElementById("" + i + "," + j);
		target.style.fill = "#000000"
	}

	displayCellAsAgent(i,j){
		var target = document.getElementById("" + i + "," + j);
		target.style.fill = "#ff0000"
	}
	displayCellAsTarget(i,j){
		var target = document.getElementById("" + i + "," + j);
		target.style.fill = "#fff"
	}
	displayCellAsComputed(i,j){
		var target = document.getElementById("" + i + "," + j);
		target.style.stroke = "#ffff00"
	}
	displayCellAsVisited(i,j){
		var target = document.getElementById("" + i + "," + j);
		target.style.fill = "#98ee98"
	}
	displayCellAsOpen(i,j){
		var target = document.getElementById("" + i + "," + j);
		target.style.stroke = "#ffff00"
	}



	computePathForward(){

		d3.selectAll(".square").style("stroke", "#000")
		if (this.openList.size < 1){ return;}	
		var min = this.openList.peek();
		while (this.openList.size > 0){
			min = this.openList.pop();
			this.numberOfCellsExpanded++;
			this.closedList.insert(min);
			if (this.target.g <= min.f){
				return;
			}
			
			




			for (var i in min.neighbors){
				/* var neighbor = min.neighbors[i];

				if (!neighbor) {continue;}
				if (neighbor.search < this.counter){
					neighbor.g = Infinity;
					neighbor.search = this.counter;
				}
				if (neighbor.g > (min.g + neighbor.c)){
					neighbor.g = min.g + neighbor.c;
					neighbor.pointer = min;
					
					neighbor.f = neighbor.g + neighbor.h;
					this.openList.delete(neighbor);
					this.openList.insert(neighbor);
				} */
				var neighbor = min.neighbors[i]
				if (this.closedList.contains(neighbor)){
					continue;
				}
				if (!neighbor) {continue;}
				if (neighbor.search < this.counter){
					neighbor.g = Infinity;
					neighbor.search = this.counter;
				}
				if (neighbor.g > (min.g + neighbor.c) && !this.closedList.contains(neighbor)){
					neighbor.g = min.g + neighbor.c;
					if (neighbor.g < 1){
						console.log()
					}
					neighbor.pointer = min;
					neighbor.f = neighbor.g + neighbor.h;
					this.openList.delete(neighbor);
					this.openList.insert(neighbor);
					//this.displayCellAsOpen(neighbor.y, neighbor.x)
				}
				
			}
			
		}
		console.log("compute path failed.")
	}





	computePathBackward(){

		d3.selectAll(".square").style("stroke", "#000")
		if (this.openList.size < 1){ return;}	
		var min = this.openList.peek();
		while (this.openList.size > 0){
			min = this.openList.pop();
			this.numberOfCellsExpanded++;
			//this.displayCellAsOpen(min.y, min.x)
			this.closedList.insert(min);
			if (this.start.g <= min.f){
				return;
			}
			for (var i in min.neighbors){
				var neighbor = min.neighbors[i]
				if (this.closedList.contains(neighbor)){
					continue;
				}
				if (!neighbor) {continue;}
				if (neighbor.search < this.counter){
					neighbor.g = Infinity;
					neighbor.search = this.counter;
				}
				if (neighbor.g > (min.g + neighbor.c) && !this.closedList.contains(neighbor)){
					neighbor.g = min.g + neighbor.c;
					neighbor.pointer = min;
					neighbor.h = Math.abs(neighbor.x - this.agent.x) + Math.abs(neighbor.y - this.agent.y)
					neighbor.f = neighbor.g + neighbor.h;
					this.openList.delete(neighbor);
					this.openList.insert(neighbor);
					//this.displayCellAsOpen(neighbor.y, neighbor.x)
				}
				
			}
			
		}
		console.log("compute path failed.")
	}

	runAdaptive(){
		//var originx = this.agent.x;
		//var originy = this.agent.y;
		var stack = [];
		this.agent.f = this.agent.h;
		while (this.start.x != this.target.x || this.start.y != this.target.y){
			while (stack.pop()){};
			this.counter++;
			this.start.g = 0;
			this.start.search = this.counter;
			this.target.g = Infinity;
			this.target.search = this.counter;
			this.openList.clear();
			this.closedList.clear();
			this.openList.insert(this.start);
			this.computePathForward();
			if (this.openList.size < 1){
				alert("Can't reach target!");
				return false;
			}
			

			var ptr = this.target;
			while (ptr.x != this.agent.x || ptr.y != this.agent.y){
				this.displayCellAsComputed(ptr.y, ptr.x)
				stack.push(ptr);
				ptr = ptr.pointer;
			}
			//stack.pop();
			while (this.agent.h != 0){
				var next = stack.pop();
				if (next.isBlocked){
					next.c = Infinity;
					this.start = this.agent;
					break;
	
				} else {
					this.displayCellAsOpen(this.agent.y, this.agent.x);
					this.agent = this.agent.neighbors.find(function(node){
					if (!node){return false;}
					return (node.x == next.x && node.y == next.y);
					})
					if (!this.agent){
						console.log("agent was blank!");
					}
				
					//console.log("Agent moved to (x: " + this.agent.x + ", y: " + this.agent.y + ") <br>");
					this.displayCellAsVisited(this.agent.y, this.agent.x);
					//console.log(this.agent.g)
					return;
				}
			}

			stack.length = 0;
			this.start = this.agent;
			/* update h values */
			for (var i in this.closedList.heap){
				var node = this.closedList.heap[i];
				node.h = this.target.g - node.g;
			}
		}
		var ptr = this.target;
		stack.length = 0;
		console.log("I reached the target!");
		var i = 0;
		return (this.numberOfCellsExpanded / this.counter);
	}

	runBackward(){
		//var originx = this.agent.x;
		//var originy = this.agent.y;
		var stack = [];
		this.target.h = Math.abs(this.agent.x - this.target.x) + Math.abs(this.agent.y - this.target.y)
		this.target.f = this.target.h;
		while (this.start.x != this.target.x || this.start.y != this.target.y){
			this.target.g = 0;
			while (stack.pop()){};
			this.counter++;
			this.target.g = 0;
			this.target.search = this.counter;
			this.start.g = Infinity;
			this.start.search = this.counter;
			this.openList.clear();
			this.closedList.clear();
			this.openList.insert(this.target);
			this.computePathBackward();
			if (this.openList.size < 1){
				alert("Can't reach target!");
				return false;
			}
			var ptr = this.agent;
			while (ptr.x != this.target.x || ptr.y != this.target.y){
				this.displayCellAsComputed(ptr.y, ptr.x)
				stack.push(ptr);
				ptr = ptr.pointer;
			}
			stack.push(ptr);
			stack = stack.reverse();
			stack.pop();
			while (this.agent !== this.target){
				var next = stack.pop();
				if (next.isBlocked){
					next.c = Infinity;
					this.start = this.agent;
					break;
	
				} else {
					this.displayCellAsOpen(this.agent.y, this.agent.x);
					this.agent = this.agent.neighbors.find(function(node){
					if (!node){return false;}
					return (node.x == next.x && node.y == next.y);
					})
					if (!this.agent){
						console.log("agent was blank!");
					}
					
					//console.log("Agent moved to (x: " + this.agent.x + ", y: " + this.agent.y + ") <br>");
					this.displayCellAsVisited(this.agent.y, this.agent.x);
					//console.log(this.agent.g)
					return;
				}
			}
			stack.length = 0;
			this.start = this.agent;
		}
		var ptr = this.target;
		stack.length = 0;
		console.log("I reached the target!");
		var i = 0;
		return (this.numberOfCellsExpanded / this.counter);
	}


	runForward(){
		//var originx = this.agent.x;
		//var originy = this.agent.y;
		var stack = [];
		console.log(this.agent);
		this.agent.f = this.agent.h;
		while (this.start.x != this.target.x || this.start.y != this.target.y){
			while (stack.pop()){};
			this.counter++;
			this.start.g = 0;
			this.start.search = this.counter;
			this.target.g = Infinity;
			this.target.search = this.counter;
			this.openList.clear();
			this.closedList.clear();
			this.openList.insert(this.start);
			this.computePathForward();
			if (this.openList.size < 1){
				//alert("Can't reach target!");
				return false;
			}
			var ptr = this.target;
			while (ptr.x != this.agent.x || ptr.y != this.agent.y){
				this.displayCellAsComputed(ptr.y, ptr.x)
				stack.push(ptr);
				ptr = ptr.pointer;
			}
			//stack.pop();
			while (this.agent.h != 0){
				var next = stack.pop();
				if (next.isBlocked){
					next.c = Infinity;
					this.start = this.agent;
					break;
	
				} else {
					this.displayCellAsOpen(this.agent.y, this.agent.x);
					this.agent = this.agent.neighbors.find(function(node){
					if (!node){return false;}
					return (node.x == next.x && node.y == next.y);
					})
					if (!this.agent){
						console.log("agent was blank!");
					}
					//console.log("Agent moved to (x: " + this.agent.x + ", y: " + this.agent.y + ") <br>");
					this.displayCellAsVisited(this.agent.y, this.agent.x);
					//console.log(this.agent.g)
					return;
				}
			}
			stack.length = 0;
			this.start = this.agent;
		}
		var ptr = this.target;
		stack.length = 0;
		console.log("I reached the target!");
		var i = 0;
		return true;
	}

}

var maze;
var file;

function choseFile(e){
	row.selectAll('.square').style('fill', '#666')
	file = e.target.files[0]; 
	maze.load(file);
}

function runForward() {
		setTimeout(function(){
			maze.runForward();
				if (maze.agent.x != maze.target.x || maze.agent.y != maze.target.y){
					runForward();
				}		
	}, 50)
}
function runBackward() {
		setTimeout(function(){
			maze.runBackward();
				if (maze.agent.x != maze.target.x || maze.agent.y != maze.target.y){
					runBackward();
				}	
	}, 50)
}
function runAdaptive() {
		setTimeout(function(){
			maze.runAdaptive();
				if (maze.agent.x != maze.target.x || maze.agent.y != maze.target.y){
					runAdaptive();
				}	
			
	}, 50)
}
	


window.onload = function(){
	maze = new Maze();
	//maze.generateMaze();

	//var originy = maze.agent.y;
	//var originx = maze.agent.x;

	document.querySelector("#fileInput").addEventListener('change',choseFile, false);


	/*
	var i = 0;
	while (i < 50){
		if (maze.runForward()){
			var blob = new Blob([maze.data], {type: "text/plain;charset=utf-8"});
			saveAs(blob, "maze"+ (i + 1)+ ".txt");
			i++;
			alert("maze created")
		}
		maze = new Maze();
		maze.generateMaze();
	}
	*/

	


}