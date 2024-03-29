// plotter.js
// define manipulate plot object

function getSVGNumber(item, property) {

	var strattr = item.getAttribute(property);

	return parseAttr(strattr);
}

function parseAttr (attrStr) {
	var re = /[0-9.]+/;
	if (re.test(attrStr)) {
		return parseFloat(attrStr);
	}
	else {
		console.error("No number found.");
		return null;
	}

}

function sleep(ms) {
    var st = new Date().getTime();
    while(new Date().getTime() < st + ms) {};
}

function inElem(coords, elem) {
	var bbox = elem.getBBox();

	var xRel = (coords[0] - bbox.x);
	var yRel = (coords[1] - bbox.y);

	return (xRel > 0 && xRel < bbox.width && yRel > 0 && yRel < bbox.height)
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
	fullarea.setAttribute("stroke-width", "2px");
	p.appendChild(fullarea);

	var vp_pad = 2;
	var vp_lower_spacing = 20;

	var platform_string;
	if (ISMOBILE) {
		platform_string = "Mobile";
	}
	else {
		platform_string = "Desktop";
	}

	var titletxt = "Web Tetris: " + platform_string + " Version";

	var vp = document.createElementNS(XMLNS, "rect");
	vp.setAttribute("id", "viewport");
	vp.setAttribute("height", (VIEWPORTHEIGHT_BLOCKS * BLOCKSIZE_PX) + "px");
	vp.setAttribute("width", (VIEWPORTWIDTH_BLOCKS * BLOCKSIZE_PX) + "px");
	vp.setAttribute("x", (SCREENSIZE_PX/2 - getSVGNumber(vp, "width")/2) + "px");
	vp.setAttribute("y", (SCREENSIZE_PX - getSVGNumber(vp, "height") - vp_lower_spacing) + "px");
	// console.log(vp.getAttribute("y"));
	vp.setAttribute("fill", "gray");

	var bkg = document.createElementNS(XMLNS, "rect");
	bkg.setAttribute("id", "vpbkg");
	bkg.setAttribute("height", (getSVGNumber(vp, "height") + 2*vp_pad) + "px");
	bkg.setAttribute("width", (getSVGNumber(vp, "width") + 2*vp_pad) + "px");
	bkg.setAttribute("x", (getSVGNumber(vp, "x") - vp_pad) + "px");
	bkg.setAttribute("y", ((getSVGNumber(vp, "y") - vp_pad)) + "px");

	var title = document.createElementNS(XMLNS, "text");
	title.setAttribute("text-anchor", "middle");
	title.setAttribute("alignment-baseline", "middle");
	title.innerHTML = titletxt;
	title.setAttribute("font-size", "20pt");
	title.setAttribute("font-family", "monospace");
	title.setAttribute("x", (SCREENSIZE_PX/2) + "px");
	title.setAttribute("y", (getSVGNumber(vp, "y")/2) + "px");

	p.appendChild(title);
	p.appendChild(bkg);
	p.appendChild(vp);

	var prevwidth_blocks = 4.5;

	var preview = document.createElementNS(XMLNS, "rect");
	preview.setAttribute("id", "preview");
	preview.setAttribute("height", (prevwidth_blocks * BLOCKSIZE_PX) + "px");
	preview.setAttribute("width", (prevwidth_blocks * BLOCKSIZE_PX) + "px");

	var prevg = document.createElementNS(XMLNS, "g");
	prevg.setAttribute("id", "previewgroup");

	var prevx = SCREENSIZE_PX * 3/4 + (VIEWPORTWIDTH_BLOCKS * BLOCKSIZE_PX) / 4;
	// console.log(prevx);
	preview.setAttribute("x", (prevx - getSVGNumber(preview, "width")/2) + "px");
	preview.setAttribute("y", (SCREENSIZE_PX/2 - getSVGNumber(preview, "height")/2) + "px");
	preview.setAttribute("fill", "gray");
	preview.setAttribute("stroke", "black");
	preview.setAttribute("stroke-width", "2px");

	var prevtitle = document.createElementNS(XMLNS, "text");
	prevtitle.setAttribute("text-anchor", "middle");
	prevtitle.setAttribute("alignment-baseline", "bottom");
	prevtitle.innerHTML = "On Deck:";
	prevtitle.setAttribute("font-size", "16pt");
	prevtitle.setAttribute("font-family", "monospace");
	prevtitle.setAttribute("x", prevx + "px");
	prevtitle.setAttribute("y", (getSVGNumber(preview, "y") - 10) + "px");

	prevg.appendChild(preview);
	prevg.appendChild(prevtitle);
	p.appendChild(prevg);

	var scoreg = document.createElementNS(XMLNS, "g");
	scoreg.setAttribute("id", "scoregroup");
	p.appendChild(scoreg);

	var scorerect = document.createElementNS(XMLNS, "rect");
	scoreg.appendChild(scorerect);
	scorerect.setAttribute("id", "score");
	scorerect.setAttribute("height", (1 * BLOCKSIZE_PX) + "px");
	scorerect.setAttribute("width", (5 * BLOCKSIZE_PX) + "px");

	var scorex = SCREENSIZE_PX / 4 - (VIEWPORTWIDTH_BLOCKS * BLOCKSIZE_PX) / 4;
	// console.log(prevx);
	scorerect.setAttribute("x", (scorex - getSVGNumber(scorerect, "width")/2) + "px");
	scorerect.setAttribute("y", (SCREENSIZE_PX/2 - getSVGNumber(scorerect, "height")/2) + "px");
	scorerect.setAttribute("fill", "gray");
	scorerect.setAttribute("stroke", "black");
	scorerect.setAttribute("stroke-width", "2px");

	var scoretitle = document.createElementNS(XMLNS, "text");
	scoreg.appendChild(scoretitle);
	scoretitle.setAttribute("text-anchor", "middle");
	scoretitle.setAttribute("alignment-baseline", "bottom");
	scoretitle.innerHTML = "Score:";
	scoretitle.setAttribute("font-size", "16pt");
	scoretitle.setAttribute("font-family", "monospace");
	scoretitle.setAttribute("x", scorex + "px");
	scoretitle.setAttribute("y", (getSVGNumber(scorerect, "y") - 10) + "px");

	var scoretext = document.createElementNS(XMLNS, "text");
	scoreg.appendChild(scoretext);
	scoretext.setAttribute("id", "scoretext");
	scoretext.setAttribute("text-anchor", "middle");
	scoretext.setAttribute("alignment-baseline", "mathematical");
	scoretext.innerHTML = "000000";
	scoretext.setAttribute("fill", "white");
	scoretext.setAttribute("font-size", "18pt");
	scoretext.setAttribute("font-family", "monospace");
	
	scoretext.setAttribute("x", scorex + "px");
	scoretext.setAttribute("y", (SCREENSIZE_PX / 2) + "px");
	var bbox = scoretext.getBBox();
	var ycorrection = (bbox.y + bbox.height/2) - SCREENSIZE_PX/2
	scoretext.setAttribute("y", (SCREENSIZE_PX/2 - ycorrection) + "px");

	var levelg = document.createElementNS(XMLNS, "g");
	levelg.setAttribute("id", "levelgroup");
	p.appendChild(levelg);


	var leveltext = document.createElementNS(XMLNS, "text");
	leveltext.setAttribute("id", "leveltext");
	leveltext.setAttribute("text-anchor", "middle");
	leveltext.setAttribute("alignment-baseline", "mathematical");
	leveltext.innerHTML = "0";
	leveltext.setAttribute("fill", "black");
	leveltext.setAttribute("font-size", "80pt");
	leveltext.setAttribute("font-family", "monospace");

	leveltext.setAttribute("x", scorex + "px");
	leveltext.setAttribute("y", (SCREENSIZE_PX / 5) + "px");
	levelg.appendChild(leveltext);

	var lhgt = leveltext.getBBox()["height"];
	var ly = leveltext.getBBox()["y"];

	var levellabel = document.createElementNS(XMLNS, "text");
	levellabel.setAttribute("id", "levellabel");
	levellabel.setAttribute("text-anchor", "middle");
	levellabel.setAttribute("alignment-baseline", "mathematical");
	levellabel.innerHTML = "Level";
	levellabel.setAttribute("fill", "black");
	levellabel.setAttribute("font-size", "24pt");
	levellabel.setAttribute("font-family", "monospace");

	levellabel.setAttribute("x", scorex + "px");
	levellabel.setAttribute("y", ly + "px");
	levelg.appendChild(levellabel);

	var leveltogo = document.createElementNS(XMLNS, "text");
	leveltogo.setAttribute("id", "leveltogo");
	leveltogo.setAttribute("text-anchor", "middle");
	leveltogo.setAttribute("alignment-baseline", "mathematical");
	leveltogo.innerHTML = "To Go: 20";
	leveltogo.setAttribute("fill", "black");
	leveltogo.setAttribute("font-size", "18pt");
	leveltogo.setAttribute("font-family", "monospace");

	leveltogo.setAttribute("x", scorex + "px");
	leveltogo.setAttribute("y", (ly + lhgt) + "px");
	levelg.appendChild(leveltogo);


	// scoreg.appendChild(scoretext);

}

function copydims(tocopy) {
	var elem = document.createElementNS(XMLNS, "rect");

	var bbox = tocopy.getBBox();
	attrs = ["x", "y", "width", "height"];
	for (var i = 0; i < attrs.length; i++) {
		elem.setAttribute(attrs[i], bbox[attrs[i]]);
	}
	return elem;
}

class TetrisGame {
	constructor() {
		this.vp = document.getElementById("viewport");
		this.parent = document.getElementById("parentsvg");
		this.bkg = document.getElementById("fullarea");
		this.addmask();
		this.setcolor("yellow");

		this.shapes = [];
		this.activeShape = undefined;

		this.active = true;

		this.score = 0;
		this.rowsremoved = 0;
		this.togo = ROWS_PER_LEVEL;
		this.level = 1;
		this.setlevel(this.level);

		this.shiftallowed = true;

		this.timerFreqHz = 1.0;
	}

	addmask() {
		var m = document.createElementNS(XMLNS, "mask");
		var maskId = "colormask";
		m.setAttribute("id", maskId);
		var attrs = ["x", "y", "width", "height"];

		var maskrect = copydims(this.parent);
		var viewmask = copydims(document.getElementById("vpbkg"));
		var prevmask = copydims(document.getElementById("preview"));
		var scoremask = copydims(document.getElementById("score"));
		// var levelmask = copydims(document.getElementById("levellabel"));

		maskrect.setAttribute("fill", "white");
		viewmask.setAttribute("fill", "black");
		prevmask.setAttribute("fill", "black");
		scoremask.setAttribute("fill", "black");
		// levelmask.setAttribute("fill", "black");

		m.appendChild(maskrect);
		m.appendChild(viewmask);
		m.appendChild(prevmask);
		m.appendChild(scoremask);
		// m.appendChild(levelmask);

		this.parent.appendChild(m);
		// this.parent.setAttribute("mask", "url(#" + maskId + ")");
		
		this.colorrect = copydims(this.parent);
		this.colorrect.setAttribute("fill", "white");
		this.colorrect.setAttribute("fill-opacity", 0.25);
		this.colorrect.setAttribute("id", "colorrect");
		this.colorrect.setAttribute("mask", "url(#" + maskId + ")");
		this.parent.appendChild(this.colorrect);

		// now make a rect over eveything and give it this mask!!
	}

	setcolor(color) {
		this.colorrect.setAttribute("fill", color);
	}

	addShape() {

		var shapenum;
		if (this.nextshapenum == undefined) {
			shapenum = Math.floor(Math.random()*7);
		}
		else {
			shapenum = this.nextshapenum;
		}
		this.nextshapenum = Math.floor(Math.random()*7);

		this.setPreview(this.nextshapenum);

		var s = new Shape(shapenum, false);
		this.currentshapenum = shapenum;
		this.activeShape = s;
		this.shapes.push(s);

		if (this.isBlocked(s.boxes)) {
			this.gameover();
		}
	}

	setPreview(shapenum) {
		var prevg = document.getElementById("previewgroup");
		var prevrect = document.getElementById("preview");

		var prevctrx = getSVGNumber(prevrect, "x") + getSVGNumber(prevrect, "width")/2;
		var prevctry = getSVGNumber(prevrect, "y") + getSVGNumber(prevrect, "height")/2;

		var prevshapeg = prevg.getElementsByClassName("shapepreview");

		// console.log(prevg);

		if (prevshapeg.length > 0) {
			[...prevshapeg].map(s => s.remove());
		}

		var shapeobj = new Shape(shapenum, true);

		var xbox = shapeobj.boxes.map(b => b[0]);
		var ybox = shapeobj.boxes.map(b => b[1]);

		var shapewidth = (Math.max(...xbox) - Math.min(...xbox) + 1) * BLOCKSIZE_PX;
		var shapehgt = (Math.max(...ybox) - Math.min(...ybox) + 1) * BLOCKSIZE_PX;

		var prevshapex0 = prevctrx - shapewidth/2;
		var prevshapey0 = prevctry - shapehgt/2;

		var boxobjs = [...shapeobj.shapeg.children];

		shapeobj.boxes.map((b,i) => boxobjs[i].setAttribute("x", (prevshapex0 + (b[0]-1)*BLOCKSIZE_PX) + "px"));
		shapeobj.boxes.map((b,i) => boxobjs[i].setAttribute("y", (prevshapey0 + (b[1]-1)*BLOCKSIZE_PX) + "px"));		

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
		// console.log(boxelems);

		return used;
	}

	startgame() {
		// console.log(this.vp);
		var timerT = 1000.0 / this.timerFreqHz; // ms
		window.game = this;

		if (!ISMOBILE) {
			window.onkeydown = this.checkKey;
		}
		else {
			window.addEventListener("touchstart", this.handleTouchStart);
			window.addEventListener("touchend", this.handleTouchEnd);
		}
		this.addShape();

		this.timer = setInterval(this.timerFunction, timerT);
	}

	levelup() {
		var newlevel = this.level + 1;
		this.setlevel(newlevel);
		this.level = newlevel;
		this.speedup();
	}

	setlevel(level) {
		document.getElementById("leveltext").innerHTML = level;
		this.setcolor(LEVELCOLORS[(level - 1) % N_COLORS])
	}

	settogo(rows) {
		var text = document.getElementById("leveltogo");
		text.innerHTML = "To Go: " + rows;
	}

	speedup() {
		clearInterval(this.timer);

		var dbfactor = 10**0.1;
		this.timerFreqHz *= dbfactor;


		var timerT = 1000.0 / this.timerFreqHz;
		this.timer = setInterval(this.timerFunction, timerT);

	}

	resume() {
		document.getElementById("banner").remove();

		// console.log(this.vp);
		var timerT = 1000.0 / this.timerFreqHz;; // ms
		window.game = this;

		if (!ISMOBILE) {
			window.onkeydown = this.checkKey;
		}
		else {
			window.addEventListener("touchstart", this.handleTouchStart);
			window.addEventListener("touchend", this.handleTouchEnd);
		}

		this.timer = setInterval(this.timerFunction, timerT);
	}

	gameover() {
		console.log("Game over called.");
		clearInterval(this.timer);
		this.makebanner("Game over.", "red");
	}

	makebanner(text, color) {
		if (this.banner != undefined) {
			this.banner.remove();
		}

		var BANNER_PAD = 10;

		var bannerrect = document.createElementNS(XMLNS, "rect");
		bannerrect.setAttribute("fill", "lightgray");
		bannerrect.setAttribute("stroke-width", "2px");
		bannerrect.setAttribute("stroke", "black");

		var bannertext = document.createElementNS(XMLNS, "text");
		bannertext.setAttribute("text-anchor", "middle");
		bannertext.innerHTML = text;
		bannertext.setAttribute("font-size", "24pt");
		bannertext.setAttribute("font-family", "monospace");
		if (color != undefined) {
			bannertext.setAttribute("fill", color);
		}
		bannertext.setAttribute("x", (SCREENSIZE_PX/2) + "px");
		bannertext.setAttribute("y", (SCREENSIZE_PX/2) + "px");

		this.banner = document.createElementNS(XMLNS, "g");
		this.banner.setAttribute("id", "banner");
		this.banner.appendChild(bannerrect);
		this.banner.appendChild(bannertext);

		var p = document.getElementById("parentsvg");
		p.appendChild(this.banner);

		var bbox = bannertext.getBBox();
		// console.log(bbox);

		bannerrect.setAttribute("height", (bbox["height"] + 20) + "px");
		bannerrect.setAttribute("width", (bbox["width"] + 20) + "px");
		bannerrect.setAttribute("y", (bbox["y"] - 10) + "px");
		bannerrect.setAttribute("x", (bbox["x"] - 10) + "px");	

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
				game.shapeDone(false);
			}
		}
		// either move it down or detect that it's hit
		// something and call shapeDone
	}

	checkKey(e) { // note that "this" in this function is the caller
		e = e || window.event; // catch undefined

		// console.log(e.detail);

		// console.log(new Error().stack);

		var d, trial;

		var game = this.game;

		if (game.active) {

			if (game.shapes.length > 0) {
				var shape = game.activeShape;

				switch (e.code) {
					case "ArrowLeft":
					case "KeyA":
						d = "left";
						break;
					case "ArrowUp":
					case "KeyW":
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
					case "Space":
						game.shiftShape();
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
	}

	handleTouchStart(e) {
		// console.log("Touch start at (" + e.pageX + ", " + e.pageY + ")");
		this.touchstartlocation = [e.pageX, e.pageY];
		this.touchstarttime = new Date().getTime(); 
	}

	handleTouchEnd(e) {
		// console.log("Touch end at (" + e.pageX + ", " + e.pageY + ")");

		var game = window.game;

		var shape = game.activeShape;

		var dX = e.pageX - this.touchstartlocation[0];
		var dY = e.pageY - this.touchstartlocation[1];

		var time = new Date().getTime();
		var touchduration = time - this.touchstarttime;
		console.log("Duration: " + touchduration + " ms");

		console.log("dX: " + dX + ", dY: " + dY);

		var swipelength = Math.sqrt(dX**2 + dY**2);

		var minlength = 100; // min swipe length not considered a "tap"

		var rawatan = Math.atan(-dY/dX) * 180 / Math.PI;
		var angle, d, trial;

		if (swipelength > minlength) {

			if (dX > 0) {
				angle = (rawatan + 360) % 360;
			}
			else {
				angle = rawatan + 180;
			}

			if (angle < 45 || angle > 315) {
				d = "right";
			}
			else if (angle > 45 && angle < 135) {
				game.hardDrop();
			}
			else if (angle > 135 && angle < 225) {
				d = "left";
			}
			else if (angle > 225 && angle < 315) {
				d = "down";
			}

		}
		else {
			if (inElem(this.touchstartlocation, document.getElementById("preview"))) {
				game.shiftShape();
			}
			else {
				d = "cw";
			}
		}
 
		if (d != undefined) {
			trial = shape.move(d, false); // don't execute move
			if (!game.isBlocked(trial)) {
				shape.move(d);
			}
		}
		// console.log("Swipe at: " + angle.toFixed(3) + " deg");
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

		this.shapeDone(true);
		
	}

	shiftShape() {
		if (this.shiftallowed) {
			var current = this.shapes.pop();
			var currentnum = current.shapenumber;
			current.shapeg.remove();

			this.addShape();

			this.nextshapenum = currentnum;

			// console.log(this.nextshapenum);
			this.setPreview(this.nextshapenum);

			this.shiftallowed = false;
		}

	}

	shapeDone(immediate) {

		if (immediate == undefined) {
			immediate = true;
		}

		var waitms = 1000;

		if (!immediate) {
			sleep(waitms);
		}
		this.active = false;

		this.activeShape = undefined;
		this.removeLayers();

		if (this.togo <= 0) {
			this.togo += ROWS_PER_LEVEL;
			this.levelup();
		}

		this.settogo(this.togo);

		var scoretext = document.getElementById("scoretext");
		var scorelength = 6;
		var scorestr = ("0".repeat(scorelength) + this.score).slice(-scorelength);
		scoretext.innerHTML = scorestr;

		this.addShape();

		this.active = true;
		this.shiftallowed = true;
	}

	removeLayers() {
		// var used = this.getUsedSpaces();
		var rows = [...Array(VIEWPORTHEIGHT_BLOCKS).keys()].map(d => d+1);

		rows.reverse();

		this.rowsToRemove = rows.filter(r => this.rowFilled(r));
		// SCORE ADDITION HERE
		this.score = this.score + 10 * this.rowsToRemove.length * this.level;
		this.rowsremoved += this.rowsToRemove.length;
		this.togo -= this.rowsToRemove.length;
		// console.log(this.rowsToRemove);
		var boxelems = [...this.parent.getElementsByClassName("box")];

		var boxesToRemove, boxesAbove, r;
		// must go from lowest to highest # row or row #s will change
		while (this.rowsToRemove.length > 0) {
			r = this.rowsToRemove.pop();
			
			boxesToRemove = boxelems.filter(b => parseInt(b.getAttribute("data-ycoord")) === r);
			boxesToRemove.map(b => b.setAttribute("fill", "white"));
			boxesAbove = boxelems.filter(b => parseInt(b.getAttribute("data-ycoord")) < r);

			// this.removeanddrop(boxesToRemove, boxesAbove);
			this.highlightremovedrow(r);
			this.removeanddrop(boxesToRemove, boxesAbove);
			
		}

		
	}

	removeanddrop(boxesToRemove, boxesAbove) {
		// console.log(boxesToRemove);
		boxesToRemove.map(b => b.remove());
		boxesAbove.map(b => b.setAttribute("data-ycoord", parseInt(b.getAttribute("data-ycoord"))+1));
		boxesAbove.map(b => b.setAttribute("y", vpY((parseInt(b.getAttribute("data-ycoord"))-1) * BLOCKSIZE_PX) + "px"));
		// console.log("remove and move executed");
	}

	highlightremovedrow(row) {
		var rowbbox = {
			"x": vpX(0),
			"y": vpY((row-1) * BLOCKSIZE_PX),
			"width": VIEWPORTWIDTH_BLOCKS*BLOCKSIZE_PX,
			"height": BLOCKSIZE_PX
		}

		var highlight = document.createElementNS(XMLNS, "rect");
		highlight.setAttribute("x", rowbbox.x);
		highlight.setAttribute("y", rowbbox.y);
		highlight.setAttribute("width", rowbbox.width);
		highlight.setAttribute("height", rowbbox.height);
		highlight.setAttribute("fill", "white");
		highlight.setAttribute("fill-opacity", 0.75);

		var p = document.getElementById("parentsvg");
		p.appendChild(highlight);

		var fadetime = 300;

		fadeout(highlight, fadetime, 10)

		// console.log(rowbbox);

	}

}

function fadeout(elem, time, steps) {
	if (steps == undefined) {
		steps = 10;
	}

	if (elem.getAttribute("fill-opacity") == undefined) {
		elem.setAttribute("fill-opacity", 1);
	}

	var initial = getSVGNumber(elem, "fill-opacity");
	var fillstep = initial / steps;
	var timestep = time / steps;

	// console.log("fillstep: " + fillstep);

	decreaseiteratively(elem, fillstep, timestep);
}

function decreaseiteratively(elem, amount, waittime) {
	if (getSVGNumber(elem, "fill-opacity") > 0) {
		setTimeout(
			function(elem) {
				// console.log("current: " + getSVGNumber(elem, "fill-opacity"));
				// console.log("new: " + (getSVGNumber(elem, "fill-opacity")-amount));
				elem.setAttribute("fill-opacity", getSVGNumber(elem, "fill-opacity")-amount);
				decreaseiteratively(elem, amount, waittime);
			},
			waittime, elem);
	}
	else {
		// console.log("removing");
		elem.remove();
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




