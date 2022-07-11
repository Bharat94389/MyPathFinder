// Constants
const dx = [0, -1, 0, 1], dy = [-1, 0, 1, 0];
const nodeWidth = 30, nodeHeight = 30;

// States of node
const emptyNode = 0, wall = 1, startNode = -1, endNode = -2;
const inQueue = 2, visited = 3, final = 4;

// Icons
const endIcon = '<i class="fa-solid fa-location-dot"></i>';
const startIcon = '<i class="fa-solid fa-location-crosshairs"></i>';
const finalPathIcon = [
  '<i class="fa-solid fa-greater-than left"></i>',
  '<i class="fa-solid fa-greater-than up"></i>',
  '<i class="fa-solid fa-greater-than"></i>',
  '<i class="fa-solid fa-greater-than down"></i>',
];

// Action variables
let generating = false, moving = -1, solving = false;
let endPoints = [];

// Sleep function
const sleep = () => {
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Random Function
const getRandom = (a) => {
  return Math.floor(Math.random()*a);
}

// Check point in function
const checkIn = (x, y) => {
  if(x>=0 && x<rows && y>=0 && y<columns)
    return true;
  return false;
}

// Clear Maze
const clearMaze = (lvl = 0) => {
  if(!actions()) {
    for(let i=0; i<rows; i++) {
      for(let j=0; j<columns; j++) {
        if(state[i][j]>lvl)
          state[i][j] = 0;
      }
    }
    animate();
  }
}


// Animate 
const animate = async () => {
  state[endPoints[0][0]][endPoints[0][1]] = startNode;
  state[endPoints[1][0]][endPoints[1][1]] = endNode;
  for(let i=0; i<rows; i++) {
    for(let j=0; j<columns; j++) {
      let temp = document.getElementById(`${i},${j}`);
      temp.innerHTML = '';
      switch(state[i][j]) {
        case wall:
          temp.className = 'node wall';
          break;

        case startNode:
          temp.innerHTML = startIcon;
          temp.className = 'node icon';
          break;

        case endNode:
          temp.innerHTML = endIcon;
          temp.className = 'node icon';
          break;

        case inQueue:
          temp.className = 'node in-queue';
          break;

        case visited:
          temp.className = 'node visited';
          break;

        case final:
          temp.innerHTML = finalPathIcon[direction[i][j]];
          temp.className = 'node icon';
          break;

        default:
          temp.className = 'node';
      }
    }
  }
  await sleep();
}

// Checking for actions
const actions = () => {
  return (generating || moving>=0 || solving);
}

// Adding and Removing Start
// const addStartEnd = () => {
//   let start = document.getElementById(`${endPoints[0][0]},${endPoints[0][1]}`);
//   state[endPoints[0][0]][endPoints[0][1]] = startNode;
//   start.className = 'node endpoint';
//   start.innerHTML = startImg;
//   let end = document.getElementById(`${endPoints[1][0]},${endPoints[1][1]}`);
//   state[endPoints[1][0]][endPoints[1][1]] = endNode;
//   end.className = 'node endpoint';
//   end.innerHTML = endImg;
// }

// Tracing Final Path
const traceFinal = async (parent) => {
  let finalPath = [];
  let [x,y] = endPoints[1], dir;
  while(x !== endPoints[0][0] || y !== endPoints[0][1]) {
    finalPath.push([x, y]);
    [x, y, dir] = parent[`${x},${y}`];
    direction[x][y] = dir;
  }
  for(let i=finalPath.length - 1; i>=0; i--) {
    [x,y] = finalPath[i];
    state[x][y] = final;
    await animate();
  }
}