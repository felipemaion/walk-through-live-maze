// import { initialMatrix } from "./input";

self.importScripts('matrix_source/local_input.js');
// console.log(initialMatrix);
const matrix = initialMatrix.map((x) => x);
// console.log(matrix);
let rowSize = matrix.length;
let colSize = matrix[0].length;
let endGoalRow = rowSize - 1;
let endGoalCol = colSize - 1;

let foundSolution = false;

// Two cells are considered adjacent if they have a border, either on the side, above, below or diagonally. 
function neighborsAlive(_neighborsRow, _neighborsCol, locMatrix) {
  let _neighborsCount = 0;
  for (let _row = -(1); _row < 2; _row++) {
    for (let _col = -(1); _col < 2; _col++) {
      let _rowToCheck = _neighborsRow + _row,
        _colToCheck = _neighborsCol + _col;
      (_rowToCheck >= 0) &&
        (_rowToCheck < rowSize) &&
        (_colToCheck >= 0) &&
        (_colToCheck < colSize) &&
        (locMatrix[_rowToCheck][_colToCheck] == 1) &&
        (_neighborsCount += 1);
    }
  }
  return (_neighborsCount -= locMatrix[_neighborsRow][_neighborsCol]), _neighborsCount;
}



function generateResultMatrix(locMatrix) {
  rowSize = locMatrix.length;
  colSize = locMatrix[0].length;
  const newMatrix = [...Array(rowSize)].map(e => Array(colSize));
  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      let currentNeigbourAlive = neighborsAlive(i, j, locMatrix);
      // console.log("neighborsAlive(i: "+ i + " j: "+j+") = "+currentNeigbourAlive);
      // White cells turn green if they have a number of adjacent green cells greater than 1 and less than 5. Otherwise, they remain white.

      // Green cells remain green if they have a number of green adjacent cells greater than 3 and less than 6. Otherwise they become white.
      ((locMatrix[i][j] == 0) && ((currentNeigbourAlive > 1) && (currentNeigbourAlive < 5))
        ? (newMatrix[i][j] = 1) : (newMatrix[i][j] = 0)),
        (locMatrix[i][j] == 1) && ((currentNeigbourAlive > 3) && (currentNeigbourAlive < 6)
          ? (newMatrix[i][j] = 1) : (newMatrix[i][j] = 0));
    }
    newMatrix[0][0] = 3;
    newMatrix[rowSize - 1][colSize - 1] = 4;
  }
  return newMatrix;
}


function availablePositionsForCurrentPos(i, j, next_matrix) {
  let availablePositions = [];
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]; //left,right,up,down
  directions.forEach((direction) => {
    let newI = i + direction[0];
    let newJ = j + direction[1];
    if ((isValid(newI, newJ)) && ((next_matrix[newI][newJ] == 0) || (next_matrix[newI][newJ] == 4))) {
      // console.log("availablePositionsForCurrentPos:", newI, newJ);
      availablePositions.push([newI, newJ]);
    }
  })

  return availablePositions;
}

function isValid(i, j) {
  return ((i >= 0) && (i < rowSize) && (j >= 0) && (j < colSize));
}

// Create factory:
function Layer(locMatrix, layerId) {
  this.matrix = locMatrix;
  this.nextMatrix = generateResultMatrix(this.matrix);
  this.layerId = layerId;
  this.nodes = [];
  this.nodesId = new Set([]);
  this.foundSolution = false;
  this.winnerNode = null;
}



function Node(i, j, layer) {
  this.layer = layer;
  availablePos = new Set(availablePositionsForCurrentPos(i, j, this.layer.nextMatrix));

  this.currentPosition = [i, j];
  this.nodeId = colSize * i + j + 1;
  this.nextPositions = availablePos;
  this.nodeParent = null;
  this.isWinner = false;

}

let winnerPath = {
  nodes: [],
  add(node) {
    // console.log(`${node.nodeId} joined the path.`);
    this.nodes.push(node);
    return this;
  },
  get latest() {
    let count = this.nodes.length;
    return count == 0 ? undefined : this.nodes[count - 1];
  },
  get positionLastNode() {
    lastNode = this.latest;
    if (lastNode) {
      return lastNode.currentPosition;
    }
  }
}

const addNodeToLayer = function (node, layer) {
  const layerNodesId = layer.nodesId;
  if (!layerNodesId.has(node.nodeId)) {
    layer.nodes.push(node);
    layer.nodesId.add(parseInt(node.nodeId));
  }
  if ((node.currentPosition[0] == endGoalRow && node.currentPosition[1] == (endGoalCol - 1)) || ((node.currentPosition[0] == endGoalRow - 1 && node.currentPosition[1] == endGoalCol))) {
    console.log("Found solution");
    // console.log(layer);
    foundSolution = true;
    layer.foundSolution = true;
    layer.winnerNode = node;
    node.isWinner = true;
  }
  return layer;
}


const addLastMove = function (layer) {
  // Make the last move to the Goal.
  layerGoal = new Layer(layer.matrix, layer.layerId + 1);
  layerGoal.foundSolution = true;
  nodeGoal = new Node(endGoalRow, endGoalCol, layerGoal);
  addNodeToLayer(nodeGoal, layerGoal);
  nodeGoal.isWinner = true;
  allLayers.push(layerGoal);
  winnerPath.add(nodeGoal);
}


const backPath = function () {
  // add last move to the goal:
  addLastMove(allLayers[allLayers.length - 1]);
  // invert a copy of all layers
  let revertedAllLayers = allLayers.slice().reverse();

  for (let i = 1; i < revertedAllLayers.length; i++) {
    let previousLayer = revertedAllLayers[i];
    previousLayer.nodes.every(node => {
      node.nextPositions.forEach(pos => {
        let posWinner = winnerPath.positionLastNode;
        // Debugging:
        // if(previousLayer.layerId == 271){
        //   let condPos = ((pos[0] == posWinner[0]) && (pos[1] == posWinner[1]));
        // console.log("LayerID:" + previousLayer.layerId + " pos: " + pos + "== posWinner: " + posWinner + " = " + condPos);
        // }
        if ((pos[0] == posWinner[0]) && (pos[1] == posWinner[1])) {
          node.isWinner = true;
          winnerPath.latest.nodeParent = node;
          winnerPath.add(node);

          return false;  // escape node check of 'every'
        }
      })
      return true; // every node is checked, if not escaped
    });
  }
  // console.log("Path:")
  // console.log(winnerPath.nodes);
  return winnerPath;
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

const writeMoves = function () {
  let moves = [];
  directions = { "L": -1, "R": 1, "U": -colSize, "D": colSize };
  orderedGame = winnerPath.nodes.slice().reverse();
  for (let i = 0; i < orderedGame.length - 1; i++) {
    fromNode = orderedGame[i];
    toNode = orderedGame[i + 1];
    moveDelta = toNode.nodeId - fromNode.nodeId;
    move = getKeyByValue(directions, moveDelta);
    // console.log(move);
    moves.push(move);
  }
  return moves;
}


// Initial Setup:
let allLayers = [];
let currentLayer = new Layer(matrix, 0);


const currentNode = new Node(0, 0, currentLayer);
addNodeToLayer(currentNode, currentLayer);

// Run:
function evolveLayer(currentLayer) {
  // console.log(currentLayer);
  this.currentLayer = currentLayer;
  this.layerId = currentLayer.layerId + 1;
  this.nextLayer = new Layer(this.currentLayer.nextMatrix, this.layerId);

  this.currentLayer.nodes.forEach((node) => {
    node.nextPositions.forEach((position) => {
      // console.log((position[0], position[1]))
      nextNode = new Node(position[0], position[1], this.nextLayer);
      // console.log("nextNode", nextNode.nextPositions)
      addNodeToLayer(nextNode, this.nextLayer);
      // One move from winning:
      if ((position[0] == endGoalRow && position[1] == (endGoalCol - 1)) || ((position[0] == endGoalRow - 1 && position[1] == endGoalCol))) {
        console.log("Found POSSIBLE solution");
        // console.log(nextNode);
        return this.nextLayer;
      }
    })
  })
  return this.nextLayer;

}

function setupLayers() {
  allLayers = []
  let currentLayer = new Layer(matrix, 0);

  const currentNode = new Node(0, 0, currentLayer);

  addNodeToLayer(currentNode, currentLayer);
  allLayers.push(currentLayer);
  return currentLayer;
}

let browserCounter = 0;


const next = function () {
  let previousLayer;
  let workerResult;
  let layer;
  if (browserCounter > 0) {
    previousLayer = allLayers[browserCounter - 1]
  }
  // console.log(previousLayer);
  if (browserCounter < allLayers.length) {
    workerResult = allLayers[browserCounter + 1];
    browserCounter++;
  } else {
    workerResult = evolveLayer(previousLayer);
    allLayers.push(workerResult);
    browserCounter++;
  }
  return workerResult;
}


onmessage = function (e) {
  console.log('Worker: Message received from main script');
  // console.log(e.data);

  let workerResult;
  if (e.data == "start") {
    browserCounter = 0;
    workerResult = setupLayers();
    browserCounter++;
    // console.log(workerResult);
  } else if (e.data == "next") {

    if (!foundSolution) {
      workerResult = next();
      // browserCounter++;
    } else {
      workerResult = allLayers[allLayers.length - 1];
    }
    // after:
    if (foundSolution) {
      backPath();
    }
  } else if (e.data == "previous") {
    if (browserCounter > 0) {
      browserCounter--;
      workerResult = allLayers[browserCounter];
    } else {
      workerResult = allLayers[0];
      browserCounter = 0;
    }
  } else if (e.data == "clear") {
    allLayers = [];
    revertedAllLayers = [];
    browserCounter = 0;
    winnerPath.nodes = [];
    workerResult = setupLayers();
    browserCounter++;
  } else if (e.data == "path") {
    moves = writeMoves();
    workerResult = [allLayers[allLayers.length - 1], moves];

  }
  postMessage(workerResult);

  console.log('Worker: Posting message back to main script');

}

