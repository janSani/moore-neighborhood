# Minesweeper and INT patterns
INT stands for isotropic non-totalistic, visit this repository's page for more information about what that means.
I presume you are here because you were already there and want to take a look at my spaghetti code.

The page uses 6 scripts: `patterns.js` and `results.js` are only for storage. The former stores the patterns and their names in the `Patterns` object, the latter stores the results of the 40 million boards I simulated.

The rest of the scripts are gonna be described in more detail:

## `interactive-board`
`interactive-board.js` handles everything that has to do with the interactive board, except the results table, which is handled by `tablemaker.js`.

It relies heavily on functions defined in `simulation-funcs.js`, and many functions revolve around the `makeInteractiveBoard` and `updateIntBoard` functions. 

The former first reads the mode: generate or draw, then updates the stored board and results accordingly, finally it hides and shows buttons and menus for that mode before calling `updateIntBoard`. 

The latter updates the table that is displayed on the screen, including the pattern in Hensel notation for each cell. It also calls `updateIntResults` which is handled by `tablemaker.js`

## `interactive-grid`
`interactive-grid.js` handles the 3x3 grid at the start of the page. The main function `updateState` reads the 8 outer cells and converts it to a string, which is search in the `Patterns` object. 

It also handles the three buttons which simply clears the grid, inverts it, or randomizes it.

## `simulation-funcs`
I used a modified version of this script to simulate 40 million boards. The only difference was I used Node.js to write the results on a file while they were generating.

`makeBoard` function simply generates an array with as many 1s as mines, followed by as many 0s as empty cells, then shuffles it and turns it into a matrix.

`identifyPattern` function takes a pattern string and returns the key it corresponds with, according to the `Patterns` object.

`countPatterns` function is what does the heavy work. It takes a board and for each cell it generates a pattern string, it gets identified and counted in up to four objects, depending on if it was a mine or on the boundary.  It returns a list with these 4 objects along with the number 1, representing how many boards were generated so far.

`joinCounts` function is ideal to accumulate results, it takes two lists specifically in the form `countPatterns` returns and joins them into a single list, this is why `countPatterns` comes with a 1, so `joinCounts` can keep track of the number of boards generated.

`countBoards` function is not actually used in the page interactive board, but it's what I used to simulate a ton of boards. It works by taking a specific size of board and a cap, it then generates boards and accumulates the result until the cap is reached.

## `tablemaker`
`tablemaker.js` has a function to turn the results into two kinds of tables, a general table and a specific or detail table.

`formatResults` function takes lists in the form `countPatterns` and `joinCounts` return, and turn them into data ready to be added into tables and drop down menus.

`makeResultsTable` and `makeIntResultsTable` functions make the general tables in the Results section and Interactive board section, respectively. These tables show the count of all the patterns at once. The functions also edit the "Detail selectors" which show the count of each number.

`makeDetailTable` and `makeIntDetailTable` functions make the specific or detail tables in the Results sections and Interactive board section, respectively. These tables shows the frequency of the patterns only within their specific numbers.