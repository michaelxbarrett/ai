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
	insert(node){
		if (!node){
			return;
		}

		this.heap[this.size] = node;
		this.size++;
		var k = this.size - 1;
		while (k > 0){
			if (this.heap[k].f < this.heap[Math.floor((k - 1)/2)].f){
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
				if (this.heap[k*2 + 2].f < this.heap[k*2 + 1].f){
					child = k * 2 + 2;
				}
			}
			if (this.heap[k].f > this.heap[child].f){
				var temp = this.heap[k];
				
				this.heap[k] = this.heap[child];
				this.heap[child] = temp;
				k = child;
				
			} else { 
				return node;
			}
		}
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

		if (k == 0 || this.heap[Math.floor((k - 1)/2)].f < this.heap[k].f) {
			/* Sift down */
			while ((k * 2 + 1) < this.size){
				var child = k * 2 + 1;
				if (this.heap[k * 2 + 2]){
					if (this.heap[k*2 + 2].f < this.heap[k*2 + 1].f){
						child = k * 2 + 2;
					}
				}
				if (this.heap[k].f > this.heap[child].f){
					var temp = this.heap[k];
					
					this.heap[k] = this.heap[child];
					this.heap[child] = temp;
					k = child;
					
				} else { 
					return;
				}
			}
			var temp = this.heap[k]
			this.heap[k]
		} else {
			while (k > 0){
				if (this.heap[k].f < this.heap[Math.floor((k - 1)/2)].f){
					var temp = this.heap[k];
					this.heap[k] = this.heap[Math.floor((k - 1)/2)];
					this.heap[Math.floor((k - 1)/2)] = temp;
					k = Math.floor((k - 1)/2);
				} else {
					break;
				}
			}
		}
		
		this.size--;
	}
	peek(){
		if (this.size == 0){ return; }
		return this.heap[0];
	}

	
}

class Maze {
	constructor(){
		this.openList = new PriorityQueue();
		this.counter = 0;
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
				if (0 < i - 1){
					nodes[i][j].neighbors.push(nodes[i - 1][j]);
				}
				if (j + 1 < 101){
					nodes[i][j].neighbors.push(nodes[i][j + 1]);
				}
				if (0 < j - 1){
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
			if (r < 20) { /* 30% chance */
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

		var y = Math.floor(Math.random() * 100);
		var z = Math.floor(Math.random() * 100);
		while (nodes[y][z].isBlocked){ y = Math.floor(Math.random() * 100); z = Math.floor(Math.random() * 100); }
		this.agent = nodes[y][z];
		y = Math.floor(Math.random() * 100);
		z = Math.floor(Math.random() * 100);
		while (nodes[y][z].isBlocked){ y = Math.floor(Math.random() * 100); z = Math.floor(Math.random() * 100); }
		this.target = nodes[y][z];
		this.start = this.agent

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
		target.style.fill = "#0000ff"
	}
	displayCellAsVisited(i,j){
		var target = document.getElementById("" + i + "," + j);
		target.style.fill = "#98ee98"
	}


	computePath(){
		if (this.openList.size < 1){ return;}

		var min = this.openList.pop();

		while (min){

			if (this.target.g <= min.g){
				break;
			}
			for (var i in min.neighbors){
				var neighbor = min.neighbors[i];
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
				}
			}
			min = this.openList.pop();
		}
	}

	run(){
		var originx = this.agent.x;
		var originy = this.agent.y;
		var stack = [];
		while (this.start.x != this.target.x || this.start.y != this.target.y){
			while (stack.pop()){};
			this.counter++;
			this.start.g = 0;
			this.start.search = this.counter;
			this.target.g = Infinity;
			this.target.search = this.counter;
			this.openList.clear();
			this.openList.insert(this.start);
			this.computePath();
			if (this.openList.size < 1){
				alert("Can't reach target!");
				return;
			}
			var ptr = this.target;
			while (ptr.x != this.agent.x || ptr.y != this.agent.y){
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
					this.agent = this.agent.neighbors.find(function(node){
					if (!node){return false;}
					return (node.x == next.x && node.y == next.y);
					})
					if (!this.agent){
						console.log("agent was blank!");
					}
					console.log("Agent moved to (x: " + this.agent.x + ", y: " + this.agent.y + ") <br>");
					this.displayCellAsVisited(this.agent.y, this.agent.x);
				}
			}
			stack.length = 0;
			this.start = this.agent;
			

		}
		var ptr = this.target;
		stack.length = 0;

		alert("I reached the target!");
		return;
	}

}

window.onload = function(){
	var maze = new Maze();
	/*document.write("Agent is at (x: " + maze.agent.x + ", y: " + maze.agent.y + ") <br>");
	document.write("Target is at (x: " + maze.target.x + ", y: " + maze.target.y + ") <br>");
	document.write("This is a Manhattan distance of " + (Math.abs(maze.agent.x - maze.target.x) + Math.abs(maze.agent.y - maze.target.y)));
	*/
	maze.run();

}