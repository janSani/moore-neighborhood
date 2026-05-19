function shuffle(array) {
    let i = array.length,
        j,
        temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        [array[i],array[j]] = [array[j],array[i]];
    }
}

const beginner8x8Size = [8,8,10];
const beginner9x9Size = [9,9,10];
const intermediateSize = [16,16,40];
const expertSize = [30,16,99];

function makeBoard(size){
    let flat = new Array(size[2]).fill(1).concat(Array(size[0]*size[1]-size[2]).fill(0));
    shuffle(flat);
    let board = [];
    for (let i = 0; i<size[1];i++){
        board.push(flat.slice(size[0]*i,size[0]*(i+1)));
    }
    return board;
}

function identifyPattern(pattern){
    let patternString = pattern;
    for (let i=0;i<4;i++){
        for (const [key, value] of Object.entries(Patterns)) {
            if (value[0].includes(patternString)) {
                return key;
            }
        } 
        patternString = patternString.slice(2) + patternString.slice(0,2);
    }
}

function countPatterns(board){
    let nRows = board.length;
    let nCols = board[0].length;

    let fullBoardPatterns = {"totalCells":0};
    let emptyCellPatterns = {"totalCells":0};
    let nonBoundaryPatterns = {"totalCells":0};
    let nonBoundaryEmptyCellPatterns = {"totalCells":0};

    for (let i=0; i<nRows; i++){
        for (let j=0; j<nCols; j++){
            let cellPattern = '';
            cellPattern += board?.[i-1]?.[j-1] ?? "0";
            cellPattern += board?.[i-1]?.[j] ?? "0";
            cellPattern += board?.[i-1]?.[j+1] ?? "0";
            cellPattern += board?.[i]?.[j+1] ?? "0";
            cellPattern += board?.[i+1]?.[j+1] ?? "0";
            cellPattern += board?.[i+1]?.[j] ?? "0";
            cellPattern += board?.[i+1]?.[j-1] ?? "0";
            cellPattern += board?.[i]?.[j-1] ??"0";

            let patternType = identifyPattern(cellPattern);

            fullBoardPatterns[patternType] = patternType in fullBoardPatterns ? fullBoardPatterns[patternType] + 1 : 1;
            fullBoardPatterns.totalCells++;
            if (board[i][j] == 0) {
                emptyCellPatterns[patternType] = patternType in emptyCellPatterns ? emptyCellPatterns[patternType] + 1 : 1;
                emptyCellPatterns.totalCells++;
            }
            if (0<i&&i<nRows-1&&0<j&&j<nCols-1) {
                nonBoundaryPatterns[patternType] = patternType in nonBoundaryPatterns ? nonBoundaryPatterns[patternType] + 1 : 1;
                nonBoundaryPatterns.totalCells++;
            }
            if (0<i&&i<nRows-1&&0<j&&j<nCols-1&&board[i][j] == 0) {
                nonBoundaryEmptyCellPatterns[patternType] = patternType in nonBoundaryEmptyCellPatterns ? nonBoundaryEmptyCellPatterns[patternType] + 1 : 1;
                nonBoundaryEmptyCellPatterns.totalCells++;
            }
        }
    }

    return [fullBoardPatterns,emptyCellPatterns,nonBoundaryPatterns,nonBoundaryEmptyCellPatterns,1]
}

function mergeObjects(a,b){
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    const result = {};

    keys.forEach(key => {
        result[key] = (a[key] || 0) + (b[key] || 0);
    });

    return result;
};

function joinCounts(a,b) {
    return a.slice(0,4).map((num,i) => mergeObjects(num,b.slice(0,4)[i])).concat(a[4]+b[4]);
}

function countBoards(size, count){
    let accumulator = countPatterns(makeBoard(size));
    while(accumulator[4]<count){
        accumulator = joinCounts(accumulator,countPatterns(makeBoard(size)));
    }
    return accumulator;
}