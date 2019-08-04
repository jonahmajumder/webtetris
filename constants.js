// global constants
var XMLNS = "http://www.w3.org/2000/svg";

function getScreenSize() {
	return Math.min(window.innerWidth, window.innerHeight)-20;
}

var SCREENSIZE_PX = getScreenSize();
var BLOCKSIZE_PX = 30;
var VIEWPORTWIDTH_BLOCKS = 10;
var VIEWPORTHEIGHT_BLOCKS = 20;
var VIEWPORTPAD_PX = 10;

var SHAPEINFO = [
	{"boxes": [[1,1], [2,1], [2,2], [3,2]], "color": "cyan"},
	{"boxes": [[1,2], [2,2], [2,1], [3,1]], "color": "orange"},
	{"boxes": [[1,1], [1,2], [2,2], [3,2]], "color": "yellow"},
	{"boxes": [[1,2], [2,2], [3,2], [3,1]], "color": "fuchsia"},
	{"boxes": [[1,1], [1,2], [2,1], [2,2]], "color": "lime"},
	{"boxes": [[1,2], [2,2], [2,1], [3,2]], "color": "blue"},
	{"boxes": [[1,1], [2,1], [3,1], [4,1]], "color": "red"},
];

var N_SHAPES = SHAPEINFO.length;