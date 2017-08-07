# JS-CHALLENGE

Reddit Daily Programming Challenge #325 - Color Maze

First rough pass at a maze traversal for a color maze given a sequence of colors. Brand new to Javascript, therefor the code is not optimized and somewhat hacky.

Input is given as a text file, taken in as an array. The first line is the sequence to use for solving the maze. 
Input (mazeData_1.txt):
O G
B O R O Y
O R B G R
B O G O Y 
Y G B Y G 
R O R B R

Output:






Maze Path
_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,
 , , , , , , ,P,Y, , , , , , , , , , , ,
 , , , , , , , ,R, , , , , , , , , , , ,
 , , , , , , , ,O, , , , , , , , , , , ,
 , , , , , , , ,O, ,R, , , , , , , , , ,
 , , , , , , , ,P,Y,O, , , , , , , , , ,
 , , , , , , , , , ,P, , , , , , , , , ,
 , , , , , , , , ,O,Y, , , , , , , , , ,
 , , , , , , , , ,R, , , , , , , , , , ,
 , , , , , , , ,P,O, , , , , , , , , , ,
 , , , , , , ,O,Y, , , , , , , , , , , ,
 , , , , , ,O,R, , , , , , , , , , , , ,
 , , , , , ,P, , , , , , , , , , , , , ,
 , , , , , ,Y, , , , , , , , , , , , , ,
 , , , , , ,O, , , , , , , , , , , , , ,
 , , , , ,O,R, , , , , , , , , , , , , ,
 , , , ,R,P, , , , , , , , , , , , , , ,
 , , ,P,O,Y, , , , , , , , , , , , , , ,
 , , ,Y, , , , , , , , , , , , , , , , ,
 , , ,O, , , , , , , , , , , , , , , , ,
