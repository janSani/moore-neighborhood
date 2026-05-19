let intBoardSel = document.getElementById("intBoardSel");
let intBoardWidth = document.getElementById("intBoardWidth");
let intBoardHeight = document.getElementById("intBoardHeight");
let intBoardMines = document.getElementById("intBoardMines");
let intWidth = 8;
let intHeight = 8;
let intMines = 10;

intBoardSel.addEventListener('change',()=>{
    let size = [+intBoardWidth.value,+intBoardHeight.value,+intBoardMines.value];
    intBoardWidth.setAttribute("disabled","");
    intBoardHeight.setAttribute("disabled","");
    intBoardMines.setAttribute("disabled","");
    switch(intBoardSel.value){
        case "beginner8x8": size = beginner8x8Size; break;
        case "beginner9x9": size = beginner9x9Size; break;
        case "intermediate": size = intermediateSize; break;
        case "expert": size = expertSize; break;
        case "custom":
            intBoardWidth.removeAttribute("disabled");
            intBoardHeight.removeAttribute("disabled");
            intBoardMines.removeAttribute("disabled");
        break;
    }
    [intWidth,intHeight,intMines] = size;
    intBoardWidth.value = intWidth;
    intBoardHeight.value = intHeight;
    intBoardMines.value = intMines;
});

intBoardWidth.addEventListener('change',(event)=>{
    intWidth = +intBoardWidth.value;
});
intBoardHeight.addEventListener('change',(event)=>{
    intHeight = +intBoardHeight.value;
});
intBoardMines.addEventListener('change',(event)=>{
    intMines = +intBoardMines.value;
});

let intMode = document.getElementById("intMode");
function makeInteractiveBoard(){
    if(intMode.value=="generate"){
        board = makeBoard([intWidth,intHeight,intMines]);
        let table = document.createElement("table");
        board.forEach(boardRow => {
            let tableRow = document.createElement("tr");
            boardRow.forEach(boardCell => {
                let tableCell = document.createElement("td");
                if (boardCell == 1) tableCell.classList.add("active");
                tableRow.appendChild(tableCell);
            });
            table.appendChild(tableRow);
        });
        table.id = "intBoard";
        document.getElementById("intBoard").replaceWith(table);
    }
}

document.getElementById("makeIntBoardBtn").addEventListener('click',makeInteractiveBoard);