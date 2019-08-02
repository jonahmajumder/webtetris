// plotter.js
// define manipulate plot object

function getSVGNumber(item, property) {

	var strattr = item.getAttribute(property);

	return parseAttr(strattr);
}

function parseAttr (attrStr) {
	var re = /[0-9.]+/;
	if (re.test(attrStr)) {
		matchstr = attrStr.match(re)[0];
		return parseFloat(matchstr);
	}
	else {
		console.error("No number found.");
		return null;
	}

}

function makeViewport() {
	var p = document.getElementById("parentsvg");
	p.setAttribute("width", SCREENSIZE_PX + "px");
	p.setAttribute("height", SCREENSIZE_PX + "px");

	var fullarea = document.createElementNS(XMLNS, "rect");
	fullarea.setAttribute("id", "fullarea");
	fullarea.setAttribute("width", "100%");
	fullarea.setAttribute("height", "100%");
	fullarea.setAttribute("fill", "white");
	fullarea.setAttribute("stroke", "black");
	fullarea.setAttribute("stroke-width", "3px");
	p.appendChild(fullarea);

	var bkg = document.createElementNS(XMLNS, "rect");
	bkg.setAttribute("height", (VIEWPORTHEIGHT_BLOCKS * BLOCKSIZE_PX + 4) + "px");
	bkg.setAttribute("width", (VIEWPORTWIDTH_BLOCKS * BLOCKSIZE_PX + 4) + "px");
	bkg.setAttribute("x", (SCREENSIZE_PX/2 - getSVGNumber(bkg, "width")/2) + "px");
	bkg.setAttribute("y", (SCREENSIZE_PX/2 - getSVGNumber(bkg, "height")/2) + "px");

	p.appendChild(bkg);

	var vp = document.createElementNS(XMLNS, "rect");
	vp.setAttribute("id", "viewport");
	vp.setAttribute("height", (VIEWPORTHEIGHT_BLOCKS * BLOCKSIZE_PX) + "px");
	vp.setAttribute("width", (VIEWPORTWIDTH_BLOCKS * BLOCKSIZE_PX) + "px");
	vp.setAttribute("x", (SCREENSIZE_PX/2 - getSVGNumber(vp, "width")/2) + "px");
	vp.setAttribute("y", (SCREENSIZE_PX/2 - getSVGNumber(vp, "height")/2) + "px");
	vp.setAttribute("fill", "gray");
	// vp.setAttribute("stroke", "black");
	// vp.setAttribute("stroke-width", "2px");
	
	p.appendChild(vp);

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class TetrisGame {
	constructor() {
		this.vp = document.getElementById("viewport");
		this.parent = document.getElementById("parentsvg");

		this.shapes = [];
		this.activeShape = undefined;
	}

	addShape() {
		var shapenum = Math.floor(Math.random()*7);
		var s = new Shape(shapenum, true);
		this.activeShape = s;
		this.shapes.push(s);

		if (this.isBlocked(s.boxes)) {
			this.gameover();
		}
	}

	getUsedSpaces() {
		var boxelems = [...this.parent.getElementsByClassName("box")];

		var used, inactive;
		if (this.activeShape != undefined) {
			inactive = boxelems.filter(b => b.parentElement.id != this.activeShape.shapeg.id);
			used = inactive.map(b => [parseInt(b.getAttribute("data-xcoord")), parseInt(b.getAttribute("data-ycoord"))]);
		}
		else {
			used = boxelems.map(b => [parseInt(b.getAttribute("data-xcoord")), parseInt(b.getAttribute("data-ycoord"))]);
		}

		return used;
	}

	startgame() {
		// console.log(this.vp);

		var timerT = 1000; // ms
		window.game = this;

		window.onkeydown = this.checkKey;
		this.addShape();

		this.timer = setInterval(this.timerFunction, timerT);
	}

	gameover() {
		clearInterval(this.timer);
		this.makebanner("Game over.");
	}

	makebanner(text, color) {
		if (this.banner != undefined) {
			this.banner.remove();
		}

		var bannerrect = document.createElementNS(XMLNS, "rect");
		bannerrect.setAttribute("height", (VIEWPORTHEIGHT_BLOCKS * BLOCKSIZE_PX / 5) + "px");
		bannerrect.setAttribute("width", (VIEWPORTWIDTH_BLOCKS * BLOCKSIZE_PX * 3/4) + "px");
		bannerrect.setAttribute("x", (SCREENSIZE_PX/2 - getSVGNumber(bannerrect, "width")/2) + "px");
		bannerrect.setAttribute("y", (SCREENSIZE_PX/2 - getSVGNumber(bannerrect, "height")/2) + "px");
		bannerrect.setAttribute("fill", "lightgray");
		bannerrect.setAttribute("stroke-width", "2px");
		bannerrect.setAttribute("stroke", "black");

		var bannertext = document.createElementNS(XMLNS, "text");
		bannertext.setAttribute("text-anchor", "middle");
		bannertext.innerHTML = text;
		bannertext.setAttribute("font-size", "24pt");
		bannertext.setAttribute("font-family", "monospace");
		if (color != undefined) {
			
		}
		bannertext.setAttribute("x", (SCREENSIZE_PX/2) + "px");
		var hgt = bannertext.getBBox()["height"];
		bannertext.setAttribute("y", (SCREENSIZE_PX/2 + hgt/2) + "px");

		this.banner = document.createElementNS(XMLNS, "g");
		this.banner.setAttribute("id", "banner");
		this.banner.appendChild(bannerrect);
		this.banner.appendChild(bannertext);

		var p = document.getElementById("parentsvg");
		p.appendChild(this.banner);

	}

	timerFunction() {

		var game = this.game;
		var shape = game.activeShape;
		if (shape != undefined) {
			var trial = shape.move("down", false);
			if (!game.isBlocked(trial)) {
				shape.move("down");
			}
			else {
				game.shapeDone();
			}
		}
		// either move it down or detect that it's hit
		// something and call shapeDone
	}

	checkKey(e) { // note that "this" in this function is the caller
		e = e || window.event; // catch undefined

		var d, trial;

		var game = this.game;

		if (game.shapes.length > 0) {
			var shape = game.activeShape;

			switch (e.code) {
				case "ArrowLeft":
				case "KeyA":
					d = "left";
					break;
				case "ArrowUp":
				case "KeyW":
				case "Space":
					game.hardDrop();
					break;
				case "ArrowRight":
				case "KeyD":
					d = "right";
					break;
				case "ArrowDown":
				case "KeyS":
					d = "down";
					break;
				case "ShiftLeft":
				case "KeyQ":
					d = "ccw";
					break;
				case "ShiftRight":
				case "KeyE":
					d = "cw";
					break;
				case "Escape":
					game.gameover();
					break;
				default:
			}

			if (d != undefined) {
				trial = shape.move(d, false); // don't execute move
				if (!game.isBlocked(trial)) {
					shape.move(d);
				}
			}
		}
	}

	isBlocked(newboxes) {
		var xout = newboxes.some(d => d[0] < 1 || d[0] > VIEWPORTWIDTH_BLOCKS);
		var yout = newboxes.some(d => d[1] < 1 || d[1] > VIEWPORTHEIGHT_BLOCKS);

		var used = this.getUsedSpaces();
		// console.log(used);
		var hitting = newboxes.some(t => used.some(s => (s[0] === t[0] && s[1] === t[1])));

		return (xout || yout || hitting);
	}

	rowFilled(row) {
		var used = this.getUsedSpaces();
		var cols = [...Array(VIEWPORTWIDTH_BLOCKS).keys()].map(d => d+1);

		var filled = !cols.some(c => !used.some(s => s[0] === c && s[1] === row));

		return filled;
	}

	hardDrop() {
		var boxes = this.activeShape.boxes;
		var xbox = boxes.map(d => d[0]);
		var ybox = boxes.map(d => d[1]);
		var used = this.getUsedSpaces();

		var under = xbox.map(x => used.filter(s => s[0] === x));
		var tallests = under.map(u => Math.min(...u.map(d => d[1]), VIEWPORTHEIGHT_BLOCKS+1));
		// console.log(tallests);
		var dists = tallests.map((d,i) => d - ybox[i]);
		var toMove = Math.min(...dists) - 1;

		this.activeShape.move([0, toMove]);

		this.shapeDone();
		
	}

	shapeDone(immediate) {

		if (immediate == undefined) {
			immediate = true;
		}

		var waitms = 1000;

		function removeFcn(game) {
			game.activeShape = undefined;
			game.removeLayers();
			game.addShape();
		}

		if (immediate) {
			removeFcn(this);
		}
		else {
			setTimeout(removeFcn, waitms, this);
		}
	}

	removeLayers() {
		// var used = this.getUsedSpaces();
		var rows = [...Array(VIEWPORTHEIGHT_BLOCKS).keys()].map(d => d+1);

		var rowsToRemove = rows.filter(r => this.rowFilled(r));
		var boxelems = [...this.parent.getElementsByClassName("box")];

		var boxesToRemove, boxesAbove, r;



		// must go from lowest to highest # row or row #s will change
		for (var i = 0; i < rowsToRemove.length; i++) {
			r = rowsToRemove[i];
			
			boxesToRemove = boxelems.filter(b => parseInt(b.getAttribute("data-ycoord")) === r);
			boxesToRemove.map(b => b.setAttribute("fill", "white"));
			boxesAbove = boxelems.filter(b => parseInt(b.getAttribute("data-ycoord")) < r);

			setTimeout(this.removeanddrop, 250, boxesToRemove, boxesAbove);
		}

		
	}

	removeanddrop(boxesToRemove, boxesAbove) {
		// console.log(boxesToRemove);
		boxesToRemove.map(b => b.remove());
		boxesAbove.map(b => b.setAttribute("data-ycoord", parseInt(b.getAttribute("data-ycoord"))+1));
		boxesAbove.map(b => b.setAttribute("y", vpY((parseInt(b.getAttribute("data-ycoord"))-1) * BLOCKSIZE_PX) + "px"));
		// console.log("remove and move executed");
	}	

}

function vpX(x) {
	vp = document.getElementById("viewport");
	svgX = x + getSVGNumber(vp, "x");
	return svgX;
}

function vpY(y) {
	vp = document.getElementById("viewport");
	svgY = y + getSVGNumber(vp, "y");
	return svgY;
}




