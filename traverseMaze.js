
//http://underscorejs.org/
var _ = require("underscore");
//http://www.collectionsjs.com/
var Map = require("collections/map");

//open file system
var fs = require("fs");
//var text = fs.readFileSync("./mazeData_1.txt", "utf-8");
var text = fs.readFileSync("./mazeData_2.txt", "utf-8");

//Split the text by new lines to get the maze
var maze = text.split(/\r|\n|\r\n/);
//clean the array of any left over empty elements
maze = cleanArray(maze);
//Maze is currently an array of strings. Split to get array of characters
maze = convertToFullArray(maze);
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
//TODO: Redo the mazeSize
//mazeBoard will keep track of invalid/visited spaces so we don't return to them
var mazeBoard = new Array(mazeSize);
//mazeBoard array allocation the old fashioned C style - still learning javascript
for(var y = 0; y < mazeSize + 1; y++)
{
	mazeBoard[y] = new Array(mazeSize + 1);
}

//BEGIN MAZE TRAVERSAL
checkLine(maze.length - 1);
	//console.log("Finished: " + finished);

//Hacky way of making an output array. 
//Display provides a visual way to represent the console output
var display = new Array(mazeSize)
//display array allocation - doing it the old fashioned way because I'm still learning javascript
for(var y = 0; y < mazeSize + 1; y++)
{
	display[y] = new Array(mazeSize + 1);
}

for(var x = 0; x < mazeSize; x++)
{
	for(var y = 0; y < mazeSize + 1; y++)
	{
		//This first check replaces the sequence line of the input with just underscores
		if(y == 0)
			display[y][x] = "_";
		else
			display[y][x] = " ";
	}
}

//index for sequence for output
var colorPicker = 0;
//Fill the display array with the corrent sequence for visual display purposes
curPath.forEach(function(element)	//for each element of curPath will return an element array of size 2, element[0] = xCoord, element[1] = yCoord
{
	var x = element[0];
	var y = element[1];
	display[y][x] = sequence[colorPicker];
	console.log("Wrote color: " + sequence[colorPicker] + " to position: (" + x + ", " + y + ")");
	colorPicker = nextInSeq(colorPicker);
});

//TODO: Fix the damn file writing, sometimes this first file write happens AFTER line writes
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
//writes each line of display to output.log -- currently broken and writes things out of order
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
	//current line of the maze using the y coord (goes to the bottom line)
	var curLine = maze[y];
	for(var x = 0; x < curLine.length; x++)
	{
		//If the current color is valid move, push to our current path stack and check neighbors
		if(curLine[x] == sequence[seqPos])
		{
				//console.log("Found initial move at: (" + x + ", " + y +")");
			curPath.push(new Array(x, y));
			mazeBoard[y][x] = 1; //mark the move as already visited
			checkNeighbors(x, y, nextInSeq(seqPos));
			curPath.pop(); //if failed, pop 
		}
	}	
}

//Check neighbors in left/up/right/down for valid moves - recursive
function checkNeighbors(x, y, next, lastX, lastY)	//lastX and lastY are/were used for debugging purposes and old code for position checking
{
	//If we have already finished, or reached the end of the maze, return back up
	if(finished)
	{
		return;
	}
		//console.log("At (" + x + ", " + y + "), CurColor: " + sequence[next] + ", NextColor: " + sequence[nextInSeq(next)]);
	//Get the neighbors of the current point (bound check the maze walls)
	var up = (y - 1 >= 1) ? maze[y - 1][x] : "";
	var left = (x - 1 >= 0) ? maze[y][x-1] : "";
	var right = (x + 1 < mazeSize) ? maze[y][x+1] : "";
	var down = (y + 1 <= mazeSize) ? maze[y + 1][x] : ""; //note, the Y distance is actually masesize+1 due to input
	//spotToMark is used as an alternate way to mark invalid moves at the end, 0 = up, 1 = left, 2 = right, 3 = down
	var spotToMark = -1;

		//console.log(left + ", " + up + ", " + right + " NEXT: " + sequence[next] + ", X/lastX " + x + "/" + lastX + ", Y/lastY " + y + "/" + lastY);

	//Below if checks make sure that the neighbor exists, and we havn't finished the maze
	//We then check if the neighbor is a valid next move or not, if so, call checkNeighbors on the new point
	if (up && !finished && up == sequence[next] && mazeBoard[y - 1][x] != 1)
	{
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

	//If we are at the top of the maze, y = 0, we are finished. Push the last point and return
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
		//Pop the bad move
		console.log("Popping: " + curPath.pop());
	}
	
}

//Get the next color in our sequence
//If at the end of the sequence, start over
function nextInSeq(curPos)
{
	return curPos = (curPos == sequence.length - 1) ? 0 : curPos + 1;
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
function convertToFullArray(oldArray)
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