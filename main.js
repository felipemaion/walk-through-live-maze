import { initialMatrix } from "./matrix_source/input.js";

const btnRun = document.querySelector('#btnRun');
const btnNext = document.querySelector('#btnNext');
const btnPrevious = document.querySelector('#btnPrevious');
const btnClear = document.querySelector('#btnClear');
const btnFind = document.querySelector('#btnFind');
const btnPath = document.querySelector('#btnPath');
const txtPath = document.querySelector('#txtPath');
const btnSave = document.querySelector('#btnSave');
const time = document.querySelector('#time');
const section = document.querySelector('section');


let matrix = initialMatrix;
let rowSize = matrix.length;
let colSize = matrix[0].length;

let foundSolution = false;
let find = false;

let layer = {};
// grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
let gridColum = `grid-template-columns: repeat(${colSize}, 1fr);`;
let gridRow = `grid-template-rows: repeat(${rowSize}, 1fr);`;
// grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
section.style.cssText += gridColum
section.style.cssText += gridRow
const createMatrix = function () {
  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      const cell = document.createElement('cell');
      const div = document.createElement('div');
      div.classList.add('circle');
      div.classList.add('hidden');
      const thisID = colSize * i + j + 1;
      cell.setAttribute("id", "item" + thisID)
      cell.appendChild(div);
      if (i == 0 && j == 0) { cell.classList.add('start'); }
      if (i == rowSize - 1 && j == colSize - 1) { cell.classList.add('finish'); }
      section.append(cell);

    }
  }

}
createMatrix();

const drawMatrix = function (layer) {
  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      const node = colSize * i + j + 1;
      const nodeElement = document.querySelector('#item' + node);
      (layer.matrix[i][j] == 1) ? nodeElement.classList.add('dead') : nodeElement.classList.remove('dead');
      (layer.nextMatrix[i][j] == 1) ? nodeElement.classList.add('next-dead') : nodeElement.classList.remove('next-dead');
      if (layer.nodesId.has(node)) {
        nodeElement.querySelector('div').classList.remove('hidden');
        nodeElement.querySelector('div').classList.add(i);
        nodeElement.querySelector('div').classList.add(j);
      } else {
        nodeElement.querySelector('div').classList.add('hidden');
      }
      // console.log("i: "+ i + " j: "+j + " has node") : console.log("i: "+ i + " j: "+j + " doesn't have node");
    }
  }
}

const clearMatrix = function () {
  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      const node = colSize * i + j + 1;
      const nodeElement = document.querySelector('#item' + node);
      nodeElement.classList.remove('dead');
      nodeElement.classList.remove('next-dead');
      nodeElement.querySelector('div').classList.add('hidden');
      // console.log("i: "+ i + " j: "+j + " has node") : console.log("i: "+ i + " j: "+j + " doesn't have node");
    }
  }
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



function saveStaticDataToFile() {
  let info = txtPath.textContent.replaceAll(",", " ")
  var blob = new Blob([info],
    { type: "text/plain;charset=utf-8" });
  saveAs(blob, "solution.txt");
}


if (window.Worker) {
  const myWorker = new Worker("worker2.js");
  btnRun.onclick = function () {
    myWorker.postMessage("start");
    // console.log('btnRun pressed');
  }

  btnClear.onclick = function () {
    
    layer = "start";
    find=false;
    foundSolution = false;
    txtPath.textContent = ""
    time.value = 500;
    myWorker.postMessage("clear");
    clearMatrix();
  }
  btnNext.onclick = function () {
    myWorker.postMessage("next");
  }
  btnPrevious.onclick = function () {
    myWorker.postMessage("previous");
  }

  btnPath.onclick = function () {
    myWorker.postMessage("path");
  }

  btnFind.onclick = function () {
    find = true;
    // alert("I will find it");
    myWorker.postMessage("next");

  }

  btnSave.onclick = function () {
    saveStaticDataToFile();
  }
  myWorker.onmessage = function (e) {
    // console.log(e.data);
    if (e.data.length > 1) {
      layer = e.data[0];
      txtPath.textContent = e.data[1];
    } else {
      layer = e.data;
    }

    drawMatrix(layer);
    if (layer.foundSolution == true) {
      foundSolution = true;
      // alert("Achou!");
      find = false;
    }




    console.log('Message received from worker');
    if (find == true) {
      // alert(parseInt(time.value) + " ms");
      sleep(parseInt(time.value)).then(() => {  
        myWorker.postMessage("next");
      });
    }
  }

} else {
  console.log('Your browser doesn\'t support web workers.');
}
