const tHeadRow = document.getElementById('table-heading-row');
const tBody = document.getElementById('table-body');

const boldButton = document.getElementById('bold-btn');
const italicsButton = document.getElementById('italics-btn');
const underlineButton = document.getElementById('underline-btn')
const leftAlign = document.getElementById('left-align');
const rightAlign = document.getElementById('right-align');
const centerAlign = document.getElementById('center-align');
const fontSizeDropDown = document.getElementById('font-size');
const fontStyleDropDown = document.getElementById('font-style');
const bgColorInput = document.getElementById('bgColor');
const textColorInput = document.getElementById('textColor');
const cutButton = document.getElementById('cut-button');
const copyButton = document.getElementById('copy-button');
const pasteButton = document.getElementById('paste-button');
const uploadJsonFile = document.getElementById('jsonFile');

let cutCell = {};
let currentCell;
const columns = 26;
const rows = 100;

for (let col = 0; col < columns; col++) {
    let th = document.createElement('th');
    // col -> 0 -> A
    // col -> 1 -> B
    th.innerText = String.fromCharCode(col + 65);
    tHeadRow.append(th);
}

for (let row = 1; row <= rows; row++) { // Row 1 -> 100
    // create a tr
    let tr = document.createElement('tr');
    // number cells
    let th = document.createElement('th');
    // injecting number in th
    th.innerText = row;
    tr.append(th);

    // append 26 tds here
    for (let col = 0; col < columns; col++) { // 0-26  //  A->B
        let td = document.createElement('td');
        td.setAttribute('contenteditable', 'true')
            // unique row and unique col
            // ColRow
        td.setAttribute('id', `${String.fromCharCode(col + 65)}${row}`)
            // this event will revolve around input
        td.addEventListener('input', (event) => onInputFn(event));
        td.addEventListener('focus', (event) => onFocusFn(event));
        tr.append(td);
    }
    tBody.append(tr);
}


// forming of outer array
let matrix = new Array(rows);
// let matrix = [];
for (let row = 0; row < rows; row++) {
    matrix[row] = new Array(columns);
    for (col = 0; col < columns; col++) {
        matrix[row][col] = {};
    }
}

function onInputFn(event) {
    updateMatrix(event.target);
    // id 
    // cell content -> innerText
    // cell style -> cssText
}

function updateMatrix(currentCell) {
    let tempObj = {
            style: currentCell.style.cssText,
            text: currentCell.innerText,
            id: currentCell.id,
        }
        // A1, A2, B6
        // `${j}${i}`
    let j = currentCell.id[0].charCodeAt(0) - 65; // this is col
    // currentCell.id[0] -> will give me character
    // str.charCodeAt(i) will give me respective ascii at ith index of string
    // -65 for making ascii code to 0th index
    let i = currentCell.id.substr(1) - 1;
    console.log(matrix);
    matrix[i][j] = tempObj;
    // matrix[][] = tempObj;
}

function onFocusFn(event) {
    currentCell = event.target;
    document.getElementById('current-cell').innerText = currentCell.id;
    if (currentCell.style.fontWeight === 'bold') {
        boldButton.style.backgroundColor = 'yellow';
    } else boldButton.style.backgroundColor = 'transparent';
}

boldButton.addEventListener('click', () => {
    if (currentCell.style.fontWeight === 'bold') {
        currentCell.style.fontWeight = 'normal';
    } else {
        currentCell.style.fontWeight = 'bold';
        boldButton.style.backgroundColor = 'yellow';
    }
    // latest style should be passed to updateMatrix
    updateMatrix(currentCell);
    // currentCell.style.fontWeight = currentCell.style.fontWeight === 'bold' ? 'normal' : 'bold';
})

italicsButton.addEventListener('click', () => {
    currentCell.style.fontStyle = currentCell.style.fontStyle === 'italic' ? 'normal' : 'italic';

    updateMatrix(currentCell);
})

underlineButton.addEventListener('click', () => {
    currentCell.style.textDecoration = currentCell.style.textDecoration === 'underline' ? 'none' : 'underline';
    updateMatrix(currentCell);
})

leftAlign.addEventListener('click', () => {
    currentCell.style.textAlign = 'left';
    updateMatrix(currentCell);
})

rightAlign.addEventListener('click', () => {
    currentCell.style.textAlign = 'right';
    updateMatrix(currentCell);
})

centerAlign.addEventListener('click', () => {
    currentCell.style.textAlign = 'center'; // changing style of a particular text
    updateMatrix(currentCell);
})

fontSizeDropDown.addEventListener('change', () => {
    //whatever option tag is chosen by the end user is 
    // mapped with select tag with value attribute
    currentCell.style.fontSize = fontSizeDropDown.value;
    updateMatrix(currentCell);
})

fontStyleDropDown.addEventListener('change', () => {
    currentCell.style.fontFamily = fontStyleDropDown.value;
    updateMatrix(currentCell);
})

textColorInput.addEventListener('input', () => {
    currentCell.style.color = textColorInput.value;
    updateMatrix(currentCell);
})

bgColorInput.addEventListener('input', () => {
    currentCell.style.backgroundColor = bgColorInput.value;
    updateMatrix(currentCell);
})


cutButton.addEventListener('click', () => {
    // store cutCell
    cutCell = {
        style: currentCell.style.cssText,
        text: currentCell.innerText,
    }
    currentCell.innerText = '';
    currentCell.style.cssText = '';
    updateMatrix(currentCell);
})

copyButton.addEventListener('click', () => {
    cutCell = {
            style: currentCell.style.cssText,
            text: currentCell.innerText,
        }
        // currentCell.innerText = '';
        // currentCell.style.cssText = '';
})

pasteButton.addEventListener('click', () => {
    currentCell.innerText = cutCell.text;
    currentCell.style.cssText = cutCell.style;
    // currentCell.style = cutCell.style;
    updateMatrix(currentCell);
})

function downloadJson() {
    // 2d matrix into String
    const matrixString = JSON.stringify(matrix);

    // text form of my matrix -> piece of memory (downloaddable)
    //application/json -> format for JSON
    const blob = new Blob([matrixString], { type: 'application/json' });
    // link created -> attach href
    // click link
    // delete link
    const link = document.createElement('a');
    // 211 -> converting piece of memory to downloadable link
    link.href = URL.createObjectURL(blob);
    // download the link instead of opening it
    // link.download = fileName 
    link.download = 'table.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);


}
// visible table -> virtual memory
// virtual memory -> physical table


// cell -> event triggered -> function updateCell(id, content)
// content -> cell text and style



// for editing text -> contenteditable;
// download button -> convert my 2d matrix into button

uploadJsonFile.addEventListener('change', uploadJsonFileFn);

function uploadJsonFileFn(event) {
    const file = event.target.files[0];
    if (file) {
        // this can read external files
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            const fileContent = e.target.result;
            try {
                matrix = JSON.parse(fileContent);
                matrix.forEach((row) => {
                    row.forEach(cell => {
                        if (cell.id) {
                            let cellToBeEdited = document.getElementById(cell.id);
                            cellToBeEdited.innerText = cell.text;
                            cellToBeEdited.style.cssText = cell.style;
                        }
                    })
                })
            } catch (err) {
                console.log(err);
            }
        }

        // how you trigger reader ?
        // .readAsText method will trigger reader
        // .onload method is having my default function
    }


}