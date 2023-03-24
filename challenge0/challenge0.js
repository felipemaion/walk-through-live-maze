function neighborsAlive2(_neighborsRow, _neighborsCol, loc_matrix) {
    let _neighborsCount = 0;
    for (let _row = -(1); _row < 2; _row++) {
        for (let _col = -(1); _col < 2; _col++) {
            let _rowCondition = _neighborsRow + _row,
                _colCondition = _neighborsCol + _col;
                (_rowCondition >= 0) &&
                (_rowCondition < 7) &&
                (_colCondition >= 0) &&
                (_colCondition <  8) &&
                (loc_matrix[_rowCondition][_colCondition] == 1) &&
                (_neighborsCount += 1);
        }
    }
    return (_neighborsCount -= loc_matrix[_neighborsRow][_neighborsCol]), _neighborsCount;
}

function generateResultMatrix(loc_matrix) {
    const newMatrix = [[2, 0, 0, 0, 0, 0, 0, 0 ], 
                    [0, 0, 0, 0, 1, 0, 0, 0 ],
                    [0, 0, 1, 0, 1, 1, 0, 0 ], 
                    [0, 1, 1, 0, 0, 1, 1, 0 ], 
                    [0, 0, 1, 0, 1, 1, 0, 0 ], 
                    [0, 0, 0, 0, 1, 0, 0, 0 ], 
                    [0, 0, 0, 0, 0, 0, 0, 3]];
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 8; j++) {
        let currentNeigbourAlive = neighborsAlive2(i, j, loc_matrix);
        ((loc_matrix[i][j] == 0) && (( currentNeigbourAlive == 3) || (currentNeigbourAlive == 2 )) 
        ? (newMatrix[i][j] = 1) : (newMatrix[i][j] = 0)),
        (loc_matrix[i][j] == 1) && (( currentNeigbourAlive > 3) && (currentNeigbourAlive < 7 ) 
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
    for (let direction of directions) {
        let newI = i + direction[0];
        let newJ = j + direction[1];
        if ((isValid(newI, newJ)) && (next_matrix[newI][newJ] == 0)) {
            // console.log("availablePositionsForCurrentPos:", newI, newJ);
            availablePositions.push([newI, newJ]);
        }
    }
    
    return availablePositions;
}

function isValid(i,j){
    return ((i >= 0) && (i < 7) && (j >= 0) && (j < 8));
}

// Create factory:
function Layer(matrix, layerId) {
    this.matrix = matrix;
    this.nextMatrix = generateResultMatrix(this.matrix);
    this.nodes = [];
    this.layerId=layerId;
}
    
function Node(i,j,layer){
        this.layer=layer;
        this.currentPosition= [i,j];
        this.node=8*i + j;
        this.nextPositions=[availablePositionsForCurrentPos(i,j, this.layer.nextMatrix)]
    }

// Initial Setup:
const allLayers = []
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


const currentNode = new Node(0,0, currentLayer)
currentLayer.nodes.push(currentNode)
allLayers.push(currentLayer)

// Run:
function evolveLayer(currentLayer){
    this.currentLayer = currentLayer;
    this.nextLayer = new Layer(this.currentLayer.nextMatrix, this.currentLayer.layerId + 1)
    this.currentLayer.nodes.forEach((node) => {
        node.nextPositions.forEach((position) => {
            next_node = setNode(position[0], position[1], this.nextLayer)
            this.nextLayer.nodes.push(next_node)
            if(position[0] == 6 && position[1] == 7){
                console.log("Found solution");
                console.log(node);
                return allLayers;
            }
        })    
    })
    return this.nextLayer;

}

export function test(){

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
    console.log(currentLayer);
    
    const currentNode = new Node(0,0, currentLayer)

    currentLayer.nodes.push(currentNode)
    allLayers.push(currentLayer)

    step1 = evolveLayer(currentLayer)
    console.log(step1)
    allLayers.push(step1)

    // step2 = evolveLayer(step1)
    // allLayers.push(step1)
    // step3 = evolveLayer(step2)
    // allLayers.push(step3)
    // console.log(allLayers)

}