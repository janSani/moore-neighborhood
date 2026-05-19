let names = [];
let orderKeys = [];

Object.entries(Patterns).forEach(([key,value])=>{
    names.push(key + " - " + value[1]);
    orderKeys.push(key);
});
names = [names[0]].concat(names.slice(2)).concat(names[1]);
orderKeys = [orderKeys[0]].concat(orderKeys.slice(2)).concat(orderKeys[1]);
names.push("Total Cells");
orderKeys.push("totalCells");

function formatResults(boardSel, conditionSel){
    let resultsToParse = [];
    switch (boardSel){
        case 'beginner8x8': resultsToParse = beginner8x8Results; break;
        case 'beginner9x9': resultsToParse = beginner9x9Results; break;
        case 'intermediate': resultsToParse = intermediateResults; break;
        case 'expert': resultsToParse = expertResults; break;
    }
    let condition = 0;
    switch (conditionSel){
        case 'fullBoard': condition = 0; break;
        case 'emptyCells': condition = 1; break;
        case 'nonBoundary': condition = 2; break;
        case 'nonBoundaryEmpty': condition = 3; break;
    }

    //GENERAL TABLE
    let generalResults = new Array();
    generalResults.push(["Pattern","Count","Frequency","Pattern","Count","Frequency"]);
    let totalCells = resultsToParse[condition].totalCells;
    for (let i=0;i<26;i++){
        generalResults.push([names[i],
        resultsToParse[condition][orderKeys[i]] || 0,
        (100*(resultsToParse[condition][orderKeys[i]] || 0)/totalCells).toFixed(6)+"%",
        names[26+i],
        resultsToParse[condition][orderKeys[26+i]] || 0,
        (100*(resultsToParse[condition][orderKeys[26+i]] || 0)/totalCells).toFixed(6)+"%"]);
    }

    //NUMBER DETAIL TABLE
    let detailResults = new Array(9).fill([]);

    let patternsPerNumber = [1,2,6,10,13,10,6,2,1];
    let cellsPerNumber = [];
    let cpnSum = 0;
    patternsPerNumber.forEach((count,index)=>{
        let sum = 0;
        for(let i=cpnSum;i<cpnSum+count;i++){
            detailResults[index] = detailResults[index].concat([[names[i],
                resultsToParse[condition][orderKeys[i]] || 0,
                resultsToParse[condition][orderKeys[i]] || 0]]);
            sum += resultsToParse[condition][orderKeys[i]]
        }
        detailResults[index] = detailResults[index].concat([["Total cells",sum,sum]]);
        detailResults[index].forEach((row,rowIndex)=>{
            detailResults[index][rowIndex][2] = (100*detailResults[index][rowIndex][2]/sum).toFixed(6)+"%"
        });
        detailResults[index] = [["Pattern","Count","Frequency"]].concat(detailResults[index]);
        cellsPerNumber.push([sum,(100*sum/totalCells).toFixed(4)+"%"]);
        cpnSum += count;
    });

    return [generalResults, cellsPerNumber, detailResults];
}

let detailSelIndexStored = 0;

function makeResultsTable(boardSel,conditionSel){
    let tableData = formatResults(boardSel,conditionSel)[0];

    //GENERAL TABLE
    let table = document.createElement("table");
    let headerRow = document.createElement("tr");
    tableData[0].forEach(element=>{
        let th = document.createElement("th");
        th.textContent = element;
        headerRow.appendChild(th)
    });
    table.appendChild(headerRow);

    tableData.slice(1).forEach(dataRow=>{
        let tr = document.createElement("tr");
        dataRow.forEach(cell=>{
            let td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        })
        table.appendChild(tr);
    });
    
    table.id = "resultsTable";
    document.getElementById("resultsTable").replaceWith(table);
    
    //DETAIL TABLE SELECTOR
    let detailSelData = formatResults(boardSel,conditionSel)[1];
    let detailTableCont = document.getElementById("detailTableContainer");

    let detailLabel = document.createElement("label");
    detailLabel.setAttribute("for","detailSel");
    detailLabel.textContent = "Counts and frequency within number:"
    detailLabel.classList.add("deletable");
    detailLabel.id = "detailLabel";

    let detailSel = document.createElement("select");
    detailSel.id = "detailSel";
    detailSel.name = "detailSel";
    detailSelData.forEach((row,index)=>{
        let option = document.createElement("option");
        option.value = index;
        option.textContent = index + " - Count: "+row[0]+" ("+row[1]+")";
        detailSel.appendChild(option);
    });
    detailSel.selectedIndex = detailSelIndexStored;
    detailSel.classList.add("deletable");
    detailSel.addEventListener('change',()=>{
        makeDetailTable(boardSel,conditionSel,detailSel.value);
        detailSelIndexStored = detailSel.value;
    });
    if(!document.querySelector("#detailSel")){
        detailTableCont.prepend(detailLabel,detailSel);
    } else {
        document.getElementById("detailLabel").replaceWith(detailLabel);
        document.getElementById("detailSel").replaceWith(detailSel);
    }
    
    makeDetailTable(boardSel,conditionSel,detailSel.value);

    //"HIDE" TABLES
    let tableContainer = document.getElementById("resultsTableContainer") 
    if(!document.querySelector("button.deletable")){
        deleteBtn = document.createElement("button");
        deleteBtn.classList.add("deletable");
        deleteBtn.textContent = "Hide results"
        deleteBtn.addEventListener("click",()=>{
            document.getElementById("resultsTable").replaceChildren();
            document.getElementById("detailTable").replaceChildren();
            document.querySelectorAll(".deletable").forEach(element => {
                element.remove();
            });
            resultsShown = false;
        });
        tableContainer.after(deleteBtn);
    }
}

function makeDetailTable(boardSel, conditionSel, number){
    let detailData = formatResults(boardSel,conditionSel)[2][number];

    let table = document.createElement("table");
    let headerRow = document.createElement("tr");
    detailData[0].forEach(element=>{
        let th = document.createElement("th");
        th.textContent = element;
        headerRow.appendChild(th)
    });
    table.appendChild(headerRow);

    detailData.slice(1).forEach(dataRow=>{
        let tr = document.createElement("tr");
        dataRow.forEach(cell=>{
            let td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        })
        table.appendChild(tr);
    });
    
    table.id = "detailTable";
    document.getElementById("detailTable").replaceWith(table);
}

let resultsShown = false;

document.getElementById("resultsBtn").addEventListener('click',()=>{
    let boardSel = document.getElementById("boardSel").value;
    let conditionSel = document.getElementById("conditionSel").value;
    makeResultsTable(boardSel, conditionSel);
    resultsShown = true;
});

document.getElementById("boardSel").addEventListener('change',()=>{
    let boardSel = document.getElementById("boardSel").value;
    let conditionSel = document.getElementById("conditionSel").value;
    if(resultsShown) makeResultsTable(boardSel, conditionSel);
});

document.getElementById("conditionSel").addEventListener('change',()=>{
    let boardSel = document.getElementById("boardSel").value;
    let conditionSel = document.getElementById("conditionSel").value;
    if(resultsShown) makeResultsTable(boardSel, conditionSel);
});