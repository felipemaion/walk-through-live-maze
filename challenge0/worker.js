function neighborsAlive2(_neighborsRow, _neighborsCol, locMatrix) {
  let _neighborsCount = 0;
  for (let _row = -(1); _row < 2; _row++) {
      for (let _col = -(1); _col < 2; _col++) {
          let _rowCondition = _neighborsRow + _row,
              _colCondition = _neighborsCol + _col;
              (_rowCondition >= 0) &&
              (_rowCondition < 7) &&
              (_colCondition >= 0) &&
              (_colCondition <  8) &&
              (locMatrix[_rowCondition][_colCondition] == 1) &&
              (_neighborsCount += 1);
      }
  }
  return (_neighborsCount -= locMatrix[_neighborsRow][_neighborsCol]), _neighborsCount;
}

function generateResultMatrix(locMatrix) {
  const newMatrix = [[2, 0, 0, 0, 0, 0, 0, 0 ], 
                  [0, 0, 0, 0, 1, 0, 0, 0 ],
                  [0, 0, 1, 0, 1, 1, 0, 0 ], 
                  [0, 1, 1, 0, 0, 1, 1, 0 ], 
                  [0, 0, 1, 0, 1, 1, 0, 0 ], 
                  [0, 0, 0, 0, 1, 0, 0, 0 ], 
                  [0, 0, 0, 0, 0, 0, 0, 3]];
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 8; j++) {
      let currentNeigbourAlive = neighborsAlive2(i, j, locMatrix);
      ((locMatrix[i][j] == 0) && (( currentNeigbourAlive == 3) || (currentNeigbourAlive == 2 )) 
      ? (newMatrix[i][j] = 1) : (newMatrix[i][j] = 0)),
      (locMatrix[i][j] == 1) && (( currentNeigbourAlive > 3) && (currentNeigbourAlive < 7 ) 
      ? (newMatrix[i][j] = 1) : (newMatrix[i][j] = 0));
    }
    newMatrix[0][0] = 2;
    newMatrix[6][7]= 3;
    }    
  return newMatrix;
}

function availablePositionsForCurrentPos(i, j, next_matrix) {
  let availablePositions = [];
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]; //left,right,up,down
  directions.forEach((direction) => {
      let newI = i + direction[0];
      let newJ = j + direction[1];
      if ((isValid(newI, newJ)) && (next_matrix[newI][newJ] == 0)) {
          // console.log("availablePositionsForCurrentPos:", newI, newJ);
          availablePositions.push([newI, newJ]);
      }
  })
  
  return availablePositions;
}

function isValid(i,j){
  return ((i >= 0) && (i < 7) && (j >= 0) && (j < 8));
}

// Create factory:
function Layer(matrix, layerId) {
  this.matrix = matrix;
  this.nextMatrix = generateResultMatrix(this.matrix);
  this.layerId=layerId;
  this.nodes = [];
  this.nodesId = new Set([]); 
}

addNodeToLayer = function (node,layer){
  myNodes = layer.nodesId;
  if (!myNodes.has(node.nodeId)) {
    layer.nodes.push(node);
    layer.nodesId.add(parseInt(node.nodeId));
  }
}
  
function Node(i,j,layer){
    this.layer=layer;
    availablePos = new Set(availablePositionsForCurrentPos(i,j, this.layer.nextMatrix));
    
    this.currentPosition= [i,j];
    this.nodeId=8*i + j +1;
    this.nextPositions= availablePos;
      
      
  }

// Initial Setup:
let allLayers = [];
const matrix = [
  [2, 0, 0, 0, 0, 0, 0, 0 ], 
  [0, 0, 0, 0, 1, 0, 0, 0 ],
  [0, 0, 1, 0, 1, 1, 0, 0 ], 
  [0, 1, 1, 0, 0, 1, 1, 0 ], 
  [0, 0, 1, 0, 1, 1, 0, 0 ], 
  [0, 0, 0, 0, 1, 0, 0, 0 ], 
  [0, 0, 0, 0, 0, 0, 0, 3],
  ];
let currentLayer = new Layer(matrix, 0);


const currentNode = new Node(0,0, currentLayer);
addNodeToLayer(currentNode,currentLayer);
// allLayers.push(currentLayer)

// Run:
function evolveLayer(currentLayer){
  console.log(currentLayer);
  this.currentLayer = currentLayer;
  this.layerId = currentLayer.layerId + 1;
  this.nextLayer = new Layer(this.currentLayer.nextMatrix, this.layerId);
  endRow = this.currentLayer.matrix.length - 1;
  endCol = this.currentLayer.matrix[0].length - 1;
  this.currentLayer.nodes.forEach((node) => {
      node.nextPositions.forEach((position) => {
        // console.log((position[0], position[1]))
          nextNode = new Node(position[0], position[1], this.nextLayer);
          // console.log("nextNode", nextNode.nextPositions)
          addNodeToLayer(nextNode, this.nextLayer);
          if((position[0] == endRow && position[1] == endCol-1) || (position[0] == endRow-1 && position[1] == endCol)){
              console.log("Found solution");
              console.log(node);
              return this.nextLayer;
          }
      })    
  })
  return this.nextLayer;

}

function test(){

  const matrix = [
      [2, 0, 0, 0, 0, 0, 0, 0 ], 
      [0, 0, 0, 0, 1, 0, 0, 0 ],
      [0, 0, 1, 0, 1, 1, 0, 0 ], 
      [0, 1, 1, 0, 0, 1, 1, 0 ], 
      [0, 0, 1, 0, 1, 1, 0, 0 ], 
      [0, 0, 0, 0, 1, 0, 0, 0 ], 
      [0, 0, 0, 0, 0, 0, 0, 3],
      ];
  let currentLayer = new Layer(matrix, 0);
 
  const currentNode = new Node(0,0, currentLayer);

  addNodeToLayer(currentNode,currentLayer);
  allLayers.push(currentLayer);
  
  //   console.log(currentLayer);
  // for(let i=0;i<1;i++){
  //   let step1 = evolveLayer(currentLayer);
  //   allLayers.push(step1);
  //   currentLayer = step1; 
  // }

  return currentLayer;
}


function generateManyLayers(){
  allLayers =[]
  const matrix = [
      [2, 0, 0, 0, 0, 0, 0, 0 ], 
      [0, 0, 0, 0, 1, 0, 0, 0 ],
      [0, 0, 1, 0, 1, 1, 0, 0 ], 
      [0, 1, 1, 0, 0, 1, 1, 0 ], 
      [0, 0, 1, 0, 1, 1, 0, 0 ], 
      [0, 0, 0, 0, 1, 0, 0, 0 ], 
      [0, 0, 0, 0, 0, 0, 0, 3],
      ];
  let currentLayer = new Layer(matrix, 0);
 
  const currentNode = new Node(0,0, currentLayer);

  addNodeToLayer(currentNode,currentLayer);
  allLayers.push(currentLayer);
  
  console.log(currentLayer);
   for(let i=0;i<50;i++){
     let step1 = evolveLayer(currentLayer);
     allLayers.push(step1);
     currentLayer = step1; 
   }

  return allLayers;
}





layerCounter = 0;
onmessage = function(e) {
  console.log('Worker: Message received from main script');
  console.log(e.data);
  let workerResult;
  if (e.data == "start") {
      allLayers = generateManyLayers();
      workerResult = allLayers[0];

  }else if (e.data == "next") {
    layerCounter++;
      workerResult = allLayers[layerCounter];
  } else if (e.data == "last") {
    layerCounter--;
      workerResult = allLayers[layerCounter];
  }
  postMessage(workerResult);

  console.log('Worker: Posting message back to main script');
  
  }

