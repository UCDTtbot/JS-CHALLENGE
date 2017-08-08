# JS-CHALLENGE

## Description
Reddit Daily Programming Challenge #325 - Color Maze

First rough pass at a maze traversal for a color maze given a sequence of colors. Brand new to Javascript, therefor the code is not optimized and somewhat hacky.

Run using NodeJS: node traverseMaze.js

## Comments
Disclaimer: This is my first ever Javascript script and the code is quite messy. This was a learning project.

I will return to the code soon to clean it up, fix it, and optimize it. 

## Issues
#### Getting stuck
If the sequence repeats like in mazeData_1.txt (O G), the algorithm will get stuck going back and forth, for example:

Sequence: O G
Row: B O G O Y

The algorithm will do the following: (1, 0) -> (2, 0) -> (1, 0) -> ...

I tried to fix this by immediatly marking visited spots as unvalid moves, however, as described in the problem, the program is allowed to retrace its steps. This is apparent in the solution to mazeData_2.txt as seen below in the following moves:

(4,17)O -> (4,16)R -> (4,17)O -> (5,17)Y -> (5,16)P -> (5,15)O -> ....

As seen in this sequence, going back to the O is required to reach the next Y.

So for cases where the sequence is a repeating sequence (O G) the algorithm will get stuck if it finds that exact sequence in the maze.
#### Output.log
Writing to output.log doesn't work quite right and will produce different output everytime the file is written to. I haven't looked into it very much but I'm assuming there is a timing issue, or I don't fully understand the filesystem. The console output of the sequence of coordinates is consistent and correct.

## Solution
Input is given as a text file, taken in as an array. The first line is the sequence to use for solving the maze. 

```
Input (mazeData_2.txt):
R O Y P O
R R B R R R B P Y G P B B B G P B P P R
B G Y P R P Y Y O R Y P P Y Y R R R P P
B P G R O P Y G R Y Y G P O R Y P B O O
R B B O R P Y O O Y R P B R G R B G P G
R P Y G G G P Y P Y O G B O R Y P B Y O
O R B G B Y B P G R P Y R O G Y G Y R P
B G O O O G B B R O Y Y Y Y P B Y Y G G
P P G B O P Y G B R O G B G R O Y R B R
Y Y P P R B Y B P O O G P Y R P P Y R Y
P O O B B B G O Y G O P B G Y R R Y R B
P P Y R B O O R O R Y B G B G O O P B Y
B B R G Y G P Y G P R R P Y G O O Y R R
O G R Y B P Y O P B R Y B G P G O O B P
R Y G P G G O R Y O O G R G P P Y P B G
P Y P R O O R O Y R P O R Y P Y B B Y R
O Y P G R P R G P O B B R B O B Y Y B P
B Y Y P O Y O Y O R B R G G Y G R G Y G
Y B Y Y G B R R O B O P P O B O R R R P
P O O O P Y G G Y P O G P O B G P R P B
R B B R R R R B B B Y O B G P G G O O Y
```

Output:

```
Maze Path
_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,
 , , , , , , , ,Y, , , , , , , , , , , ,
 , , , , , , , ,R, , , , , , , , , , , ,
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
 , , ,R, , , , , , , , , , , , , , , , ,
 ```
