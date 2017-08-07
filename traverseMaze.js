
//http://underscorejs.org/
var _ = require("underscore");
//http://www.collectionsjs.com/
var Map = require("collections/map");
//https://github.com/winstonjs/winston
var winston = require("winston");

//open file system
var fs = require("fs");
//var text = fs.readFileSync("./mazeData_1.txt", "utf-8");
var text = fs.readFileSync("./mazeData_2.txt", "utf-8");

//Split the text by new lines to get out maze
var maze = text.split(/\r|\n|\r\n/);
//clean the array of any left over empty elements
maze = cleanArray(maze);
//Maze is currently an array of strings. Split to get array of characters
maze = converToFullArray(maze);
//size of the SQUARE maze (number of elements) using the first line for reference
var mazeSize = maze[1].length;
//Sequence to follow is the first line of the maze file
var sequence = maze[0];
//Keeps track of where we currently are in our sequence
var seqPos = 0;
//This will keep track of our path through the maze
var curPath = new Array();
//Whether we finished or not
var finished = false;

//I screwed up the mazeSize allocation, so having to add 1 because the provided array
//is actually a 6x5 array instead of the true 5x5, 
//this is a quick fix
var mazeBoard = new Array(mazeSize);
for(var y = 0; y < mazeSize + 1; y++)
{
	mazeBoard[y] = new Array(mazeSize + 1);
}


/*   GIVING UP ON TUPLE MAPPING FOR NOW
function Tuple(x, y)
{
	this.x = x;
	this.y = y;

	this.equals = function (tup1, tup2)
	{
		if(tup1.x == tup2.x && tup1.y == tup2.y)
			return true;
		else
			return false;
	};
}

var m = new Map();
m.set(new Tuple(1, 2), 1);
m.set(new Tuple(2, 3), 2);
var keys = m.keys();
console.log(keys.next().value);
*/

//Start the check at the first line
checkLine(maze.length - 1);
console.log("Finished: " + finished);

//THIS IS TOO HACKY WHAT AM I DOING
var display = new Array(mazeSize)
for(var y = 0; y < mazeSize + 1; y++)
{
	display[y] = new Array(mazeSize + 1);
}

for(var x = 0; x < mazeSize; x++)
{
	for(var y = 0; y < mazeSize + 1; y++)
	{
		if(y == 0)
			display[y][x] = "_";
		else
			display[y][x] = " ";
	}
}

var colorPicker = 0;
curPath.forEach(function(element)
{
	var x = element[0];
	var y = element[1];
	display[y][x] = sequence[colorPicker];
	console.log("Wrote color: " + sequence[colorPicker] + " to position: (" + x + ", " + y + ")");
	colorPicker = nextInSeq(colorPicker);
});

//console.log(display);
fs.writeFile("./output.log", "Maze Path\n", function(err)
{
	if(err)
	{
		console.log(err);
	}
	else
	{
		console.log("File Written");
	}
});
for(var x = 0; x < mazeSize; x++)
{
	var outline = display[x];
	fs.appendFile("./output.log", outline + "\n", function(err)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			//console.log("Line written");
		}
	});
}


//Function to check the first line for a valid move. If found, check neighbors recursively
function checkLine(y)
{
	//current line of the maze using the x coord
	var curLine = maze[y];
	for(var x = 0; x < curLine.length; x++)
	{
		//If the current color is valid move, check push to our current path stack and check neighbors
		if(curLine[x] == sequence[seqPos])
		{
			//console.log("Found initial move at: (" + x + ", " + y +")");
			curPath.push(new Array(x, y));
			mazeBoard[y][x] = 1;
			checkNeighbors(x, y, nextInSeq(seqPos));
			curPath.pop();
		}
	}	
}

//Check neighbors in left/up/right for valid moves - recursive
function checkNeighbors(x, y, next, lastX, lastY)
{
	//If we have already finished, or reached the end of the maze, set the flag and return
	if(finished)
	{
		return;
	}
	console.log("At (" + x + ", " + y + "), CurColor: " + sequence[next] + ", NextColor: " + sequence[nextInSeq(next)]);
	//Get the neighbors of the current point (bound check the maze walls)
	var up = (y - 1 >= 1) ? maze[y - 1][x] : "";
	var left = (x - 1 >= 0) ? maze[y][x-1] : "";
	var right = (x + 1 < mazeSize) ? maze[y][x+1] : "";
	var down = (y + 1 <= mazeSize) ? maze[y + 1][x] : ""; //note, the Y distance is actually masesize+1 due to input
	var spotToMark = -1;
	//console.log(left + ", " + up + ", " + right + " NEXT: " + sequence[next] + ", X/lastX " + x + "/" + lastX + ", Y/lastY " + y + "/" + lastY);
	//Below if checks make sure that the neighbor exists, and we havn't finished the maze
	//We then check if the neighbor is a valid next move or not, if so, call checkNeighbors on the new point
	//console.log("NextSeq: " + sequence[next]);
	if (up && !finished && up == sequence[next] && mazeBoard[y - 1][x] != 1)
	{
		//console.log("Found neighbor of: (" + x + ", " + y + ") at (" + x + ", " + (y-1) + ")." );
		curPath.push(new Array(x, y - 1));
		spotToMark = 0;
		checkNeighbors(x, y - 1, nextInSeq(next), x, y);
	}
	if (left && !finished && left == sequence[next] && mazeBoard[y][x - 1] != 1)
	{
		curPath.push(new Array(x - 1, y));
		spotToMark = 1;
		checkNeighbors(x - 1, y, nextInSeq(next), x, y);
	}
	//console.log(right == sequence[next] + " " + (x != lastX && y != lastY));
	if (right && !finished && right == sequence[next] && mazeBoard[y][x + 1] != 1)
	{
		curPath.push(new Array(x + 1, y));
		spotToMark = 2;
		checkNeighbors(x + 1, y, nextInSeq(next), x, y);
	}
	if(down && !finished && down == sequence[next] && mazeBoard[y + 1][x] != 1)
	{
		curPath.push(new Array(x, y + 1));
		spotToMark = 3;
		checkNeighbors(x,y + 1, nextInSeq(next), x, y);
	}

	if(y - 1 <= 0 && !finished)
	{
		finished = true;
		curPath.push(new Array(x, y - 1));
		console.log("Finished and returning");
		return;
	}
	else if(!finished)
	{
		//This is a bandaid to fix the issue of not being able to backtrack onto past moves even if its a valid next color
		switch(spotToMark)
		{
			case 0:
				mazeBoard[y - 1][x] = 1;
				break;
			case 1:
				mazeBoard[y][x - 1] = 1;
				break;
			case 2: 
				mazeBoard[y][x + 1] = 1;
				break;
			case 3:
				mazeBoard[y + 1][x] = 1;
				break;
			default:
				console.log("Nothin");
		}
		console.log("Popping: " + curPath.pop());
		
	}
	
}

//Get the next color in our sequence
//If at the end of the sequence, start over
function nextInSeq(curPos)
{
	return curPos = (curPos == sequence.length - 1) ? 0 : curPos + 1;
}

function lastInSeq(curPos)
{
	return curPos = (corPos == 0) ? sequence.length - 1 : curPos - 1;
}

//Cleans the array of any empty (undefined) elements
function cleanArray(oldArray)
{
	var newArray = new Array();
	for(var i = 0; i < oldArray.length; i++)
	{
		if(oldArray[i])
			newArray.push(oldArray[i]);
	}
	return newArray;
}

//Splits an array of strings into an array of characters
function converToFullArray(oldArray)
{
	var newArray = new Array();
	for(var i = 0; i < oldArray.length; i++)
	{
		newArray.push(maze[i].split(/\s/));
	}
	return newArray;
}






























/*
var triangle = [5, 6, 7];
var a = 5;
var b = 6;
var c = 7;
// area = sq( p * (p-a) * (p-b) * (p-c) )
// p = (a + b + c) / 2

var p = (a + b + c) / 2;
var area = Math.sqrt( p * (p-a) * (p-b) * (p-c) );
console.log(area);
*/


/*
var _ = require('underscore');

var date = new Date();
var dayList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var today = dayList[date.getDay()];
var hours = date.getHours();
var minutes = date.getMinutes();
var seconds = date.getSeconds();
var suffix = (hours >= 12) ? " PM" : " AM";
hours = (hours >= 12) ? hours - 12 : hours;

console.log("Today is " + today);
console.log("Its currently " + hours + ":" + minutes + suffix);
*/


/*
function updateSales(numSold)
{
  this.numSold = numSold;
}

function updatePrice(newPrice)
{
  this.price = newPrice;
}

function book(title, author)
{
  this.title = title;
  this.author = author;
  this.updatePrice = updatePrice;
  this.updateSales = updateSales;
}

var book = new book("100 Ducks", "Kyle Jicky");

console.log("Book's Title: " + book.title + ", Author: " + book.author);
book.updateSales(10);
console.log(book.title + " has sold " + book.numSold + " copies.");
book.updatePrice(10.00);
console.log(book.title + " costs $" + book.price);
*/