document.getElementById("clearBtn").addEventListener('click',()=>{
    cells.forEach(cell=>{
        cell.classList.remove('active');
        updateText();
    })
});

document.getElementById("invertBtn").addEventListener('click',()=>{
    cells.forEach(cell=>{
        cell.classList.toggle('active');
        updateText();
    })
});

document.getElementById("randomBtn").addEventListener('click',()=>{
    cells.forEach(cell=>{
        if(Math.random()>0.5)cell.classList.add('active');
        else cell.classList.remove('active');
        updateText();
    })
});