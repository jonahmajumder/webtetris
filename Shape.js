class Shape {
	constructor(shapenumber, center) {

		this.shapenumber = shapenumber;

		this.rotationstate = 0;

		var shapeinfo = [
			{"boxes": [[1,1], [2,1], [2,2], [3,2]], "color": "cyan"},
			{"boxes": [[1,2], [2,2], [2,1], [3,1]], "color": "orange"},
			{"boxes": [[1,1], [1,2], [2,2], [3,2]], "color": "yellow"},
			{"boxes": [[1,2], [2,2], [3,2], [3,1]], "color": "fuchsia"},
			{"boxes": [[1,1], [1,2], [2,1], [2,2]], "color": "lime"},
			{"boxes": [[1,2], [2,2], [2,1], [3,2]], "color": "blue"},
			{"boxes": [[1,1], [2,1], [3,1], [4,1]], "color": "red"},
		];

		this.boxes = shapeinfo[shapenumber]["boxes"];
		var color = shapeinfo[shapenumber]["color"];

		if (center != undefined) {
			if (center) {
				var allx = this.boxes.map(d => d[0]);
				// console.log(allx);
				var ctrx = Math.floor((Math.max(...allx) + Math.min(...allx))/2);
				// console.log(ctrx);
				var shift = Math.round(VIEWPORTWIDTH_BLOCKS/2) - ctrx;
				// console.log(shift);
				this.boxes = this.boxes.map(d => [d[0]+shift, d[1]]);
			}
		}

		var edgecolor = "black";
		var coord, box;

		var p = document.getElementById("parentsvg");
		var idx = p.getElementsByClassName("shape").length;

		this.shapeg = document.createElementNS(XMLNS, "g");
		this.shapeg.setAttribute("class", "shape");
		this.shapeg.setAttribute("id", "shape" + idx);

		for (var i = 0; i < this.boxes.length; i++) {
			coord = this.boxes[i];
			box = document.createElementNS(XMLNS, "rect");
			box.setAttribute("class", "box");
			box.setAttribute("width", BLOCKSIZE_PX + "px");
			box.setAttribute("height", BLOCKSIZE_PX + "px");
			box.setAttribute("x", vpX((coord[0]-1) * BLOCKSIZE_PX) + "px");
			box.setAttribute("y", vpY((coord[1]-1) * BLOCKSIZE_PX) + "px");
			box.setAttribute("data-xcoord", coord[0]);
			box.setAttribute("data-ycoord", coord[1]);
			box.setAttribute("fill", color);
			box.setAttribute("stroke-width", "2px");
			box.setAttribute("stroke", edgecolor);
			this.shapeg.appendChild(box);
		}

		this.shapeg.setAttribute("transform", "");
		p.appendChild(this.shapeg);

	}

	move(where, execute) {
		var changes;
		var newboxes = this.boxes;

		if (execute == undefined) {
			execute = true;	
		}

		switch (where) {
			case "down":
			case "d":
				newboxes = this.boxes.map(d => [d[0], d[1]+1]);
				break;
			case "up":
			case "u":
				newboxes = this.boxes.map(d => [d[0], d[1]-1]);
				break;
			case "right":
			case "r":
				newboxes = this.boxes.map(d => [d[0]+1, d[1]]);
				break;
			case "left":
			case "l":
				newboxes = this.boxes.map(d => [d[0]-1, d[1]]);;
				break;
			case "clockwise":
			case "cw":
				changes = this.rotation("clockwise");
				newboxes = this.boxes.map((d,i) => [d[0] + changes[i][0], d[1] + changes[i][1]]);
				break;
			case "counterclockwise":
			case "ccw":
				changes = this.rotation("counterclockwise");
				newboxes = this.boxes.map((d,i) => [d[0] + changes[i][0], d[1] + changes[i][1]]);
				break;
			default:
				if (typeof(where) == "object" && where.length == 2) {
					newboxes = this.boxes.map(d => [d[0]+where[0], d[1]+where[1]]);
				}
				else {
					newboxes = this.boxes;
				}
		}

		var xvals = newboxes.map(d => d[0]);
		var yvals = newboxes.map(d => d[1]);

		var xInRange = !(xvals.some(x => x < 1 || x > VIEWPORTWIDTH_BLOCKS));
		var yInRange = !(yvals.some(y => y < 1 || y > VIEWPORTHEIGHT_BLOCKS));

		if (execute && xInRange && yInRange) {
			for (var i = 0; i < this.boxes.length; i++) {
				this.shapeg.children[i].setAttribute("x", vpX((newboxes[i][0]-1) * BLOCKSIZE_PX) + "px");
				this.shapeg.children[i].setAttribute("y", vpY((newboxes[i][1]-1) * BLOCKSIZE_PX) + "px");
				this.shapeg.children[i].setAttribute("data-xcoord", newboxes[i][0]);
				this.shapeg.children[i].setAttribute("data-ycoord", newboxes[i][1]);
			}
			this.boxes = newboxes;

			switch (where){
				case "clockwise":
				case "cw":
					this.rotationstate  = (this.rotationstate + 1)%4;
					break;
				case "counterclockwise":
				case "ccw":
					this.rotationstate = (this.rotationstate + 3)%4;
					break;
			}
		}

		return newboxes;
	}

	rotation(direction) {
		var table;
		switch (this.shapenumber) {
			case 0:
				table = [
					// cw
					[
						[[2,0], [1,1], [0,0], [-1,1]],
						[[0,2], [-1,1], [0,0], [-1,-1]],
						[[-2,0], [-1,-1], [0,0], [1,-1]],
						[[0,-2], [1,-1], [0,0], [1,1]]
					],
					// ccw
					[
						[[0,2], [-1,1], [0,0], [-1,-1]],
						[[-2,0], [-1,-1], [0,0], [1,-1]],
						[[0,-2], [1,-1], [0,0], [1,1]],
						[[2,0], [1,1], [0,0], [-1,1]]
					]
				];
				break;
			case 1:
				table = [
					// cw
					[
						[[1,-1], [0,0], [1,1], [0,2]],
						[[1,1], [0,0], [-1,1], [-2,0]],
						[[-1,1], [0,0], [-1,-1], [0,-2]],
						[[-1,-1], [0,0], [1,-1], [2,0]]
					],
					// ccw
					[
						[[1,1], [0,0], [-1,1], [-2,0]],
						[[-1,1], [0,0], [-1,-1], [0,-2]],
						[[-1,-1], [0,0], [1,-1], [2,0]],
						[[1,-1], [0,0], [1,1], [0,2]]
					]
				];
				break;
			case 2:
				table = [
					// cw
					[
						[[2,0], [1,-1], [0,0], [-1,1]],
						[[0,2], [1,1], [0,0], [-1,-1]],
						[[-2,0], [-1,1], [0,0], [1,-1]],
						[[0,-2], [-1,-1], [0,0], [1,1]]
					],
					// ccw
					[
						[[0,2], [1,1], [0,0], [-1,-1]],
						[[-2,0], [-1,1], [0,0], [1,-1]],
						[[0,-2], [-1,-1], [0,0], [1,1]],
						[[2,0], [1,-1], [0,0], [-1,1]]
					]
				];
				break;
			case 3:
				table = [
					// cw
					[
						[[1,-1], [0,0], [-1,1], [0,2]],
						[[1,1], [0,0], [-1,-1], [-2,0]],
						[[-1,1], [0,0], [1,-1], [0,-2]],
						[[-1,-1], [0,0], [1,1], [2,0]]
					],
					// ccw
					[
						[[1,1], [0,0], [-1,-1], [-2,0]],
						[[-1,1], [0,0], [1,-1], [0,-2]],
						[[-1,-1], [0,0], [1,1], [2,0]],
						[[1,-1], [0,0], [-1,1], [0,2]]
					]
				];
				break;
			case 4:
				table = [
					// cw
					[
						[[0,0], [0,0], [0,0], [0,0]],
						[[0,0], [0,0], [0,0], [0,0]],
						[[0,0], [0,0], [0,0], [0,0]],
						[[0,0], [0,0], [0,0], [0,0]]
					],
					// ccw
					[
						[[0,0], [0,0], [0,0], [0,0]],
						[[0,0], [0,0], [0,0], [0,0]],
						[[0,0], [0,0], [0,0], [0,0]],
						[[0,0], [0,0], [0,0], [0,0]]
					]
				];
				break;
			case 5:
				table = [
					// cw
					[
						[[1,-1], [0,0], [1,1], [-1,1]],
						[[1,1], [0,0], [-1,1], [-1,-1]],
						[[-1,1], [0,0], [-1,-1], [1,-1]],
						[[-1,-1], [0,0], [1,-1], [1,1]]
					],
					// ccw
					[
						[[1,1], [0,0], [-1,1], [-1,-1]],
						[[-1,1], [0,0], [-1,-1], [1,-1]],
						[[-1,-1], [0,0], [1,-1], [1,1]],
						[[1,-1], [0,0], [1,1], [-1,1]]
					]
				];
				break;
			case 6:
				table = [
					// cw
					[
						[[2,-1], [1,0], [0,1], [-1,2]],
						[[1,2], [0,1], [-1,0], [-2,-1]],
						[[-2,1], [-1,0], [0,-1], [1,-2]],
						[[-1,-2], [0,-1], [1,0], [2,1]]
					],
					// ccw
					[
						[[1,2], [0,1], [-1,0], [-2,-1]],
						[[-2,1], [-1,0], [0,-1], [1,-2]],
						[[-1,-2], [0,-1], [1,0], [2,1]],
						[[2,-1], [1,0], [0,1], [-1,2]]
					]
				];
				break;
		}

		var changes;
		switch (direction) {
			case "clockwise":
				changes = table[0][this.rotationstate];
				break;
			case "counterclockwise":
				changes = table[1][this.rotationstate];
				break;
			default:
				console.error("Direction not recognized.");
		}

		return changes;
	}

}