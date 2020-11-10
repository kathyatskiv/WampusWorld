document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    init();
  });

const WALL = 1;
const EMPTYNESS = 2;
const GOLD = 3;
const AGENT = 5;
const WAMPUS = 7;
const HOLE = 9;
const SMELL = 8;
const WIND = 4;


let gameMap; //Current array of numbers
let agentMap;
let visited;

let holes;
let wampuses;


let map; //List of the tiles-divs
let score = 0;

//0 - in progress, 1 - agent lost, 2 - agent won
let gameStatus = 0;

let start = document.getElementById("start");

let pacman;
let blinky;


//---------------------------------------
// Create elements functions
//---------------------------------------

function createTiles(data){
    tiles = [];

    for( row of data ){
        for ( column of row ){

            tile = document.createElement('div');
            tile.classList.add('tile');

            switch(column){
                case WALL:
                    tile.classList.add('wall');
                    break;
                case EMPTYNESS:
                    tile.classList.add('emptyness');
                    break;
                case AGENT:
                    tile.classList.add('pacman');
                    tile.id = "pacman"
                    tile.classList.add(pacman.direction);
                    break;
                case WAMPUS:
                    tile.classList.add('blinky');
                    tile.id = "blinky";
                    tile.classList.add("right");
                    break;
                case GOLD:
                    tile.classList.add('cherry');
                    tile.id = "cherry";
                    break;
                case HOLE:
                    tile.classList.add('hole');
                    break;
                
            }

            tiles.push(tile);
        }
    }

    return tiles;
}

function drawMap(){
    map = document.createElement('div');
    map.classList.add('container');

    let tiles = createTiles(agentMap);
    for(let tile of tiles) {
        map.appendChild(tile);
    }

    document.body.appendChild(map);
}

function addScore(){
    scoreTitle = document.createElement("h3");
    scoreTitle.id = "score"; 
    scoreTitle.innerHTML = "Score " + score;
    document.body.appendChild(scoreTitle);
}

function refreshScore(){
    scoreTitle = document.getElementById("score");
    scoreTitle.innerHTML = "Score " + score;
}

function eraseMap(){
    document.body.removeChild(map);
}

//---------------------------------------
// SetUp functions
//---------------------------------------

function setUpMap(){

        agentMap = 
        [[0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]];
        
        holes = 
        [[0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [-1,0,0,0]];

        wampuses =
        [[0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [-1,0,0,0]];

        visited = [
            [false,false,false,false],
            [false,false,false,false],
            [false,false,false,false],
            [false,false,false,false]
        ];

       /* gameMap =
        [[0,1,0,0],
        [7,9,1,0],
        [0,0,0,0],
        [5,0,0,0]];
*/
gameMap =
        [[0,0,9,0],
        [0,7,0,0],
        [0,0,1,1],
        [5,0,0,0]];
        createMap(gameMap);

        //console.log(emptyMap);
        // console.log(gameMap);
        // console.log(holes);
        // console.log(wampuses);
        // 0 - no info, -1 = false, 1 - possible, 2 - exactly
    
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}
function createMap(map){
    //they aren't on 0,n axis fix later
    let wampus_x = getRandomInt(1,4);
    let wampus_y = getRandomInt(1,4);
    
    
    let hole_x = getRandomInt(1,4);
    let hole_y = getRandomInt(1,4);

  /*  map[wampus_x][wampus_y] = 7;
    if(wampus_x!=0){
    wampuses[wampus_x -1][wampus_y] = 8;
    };
    if(wampus_x!=3){
    wampuses[wampus_x +1][wampus_y] = 8;
    };
    if(wampus_y!=0){
    wampuses[wampus_x][wampus_y-1] = 8;
    };
    if(wampus_y!=3){
    wampuses[wampus_x][wampus_y+1] = 8;
    };

    map[hole_x][hole_y] = 9;
    if(hole_x!=0){
        holes[hole_x -1][hole_y] = 4;
        };
    if(hole_x!=3){
        holes[hole_x +1][hole_y] = 4;
        };
    if(hole_y!=0){
        holes[hole_x][hole_y-1] = 4;
        };
    if(hole_y!=3){
        holes[hole_x][hole_y+1] = 4;
        };

*/
}

function setUpHeroes(){
    pacman = {
        x: 0,
        y: 3,
        direction: "right",
        tile: AGENT,
        under: EMPTYNESS
    };
// need to insert set up according to random map generation
    blinky = {
        x: 1,
        y: 4,
        tile: WAMPUS,
        under: EMPTYNESS
    }

}

function refreshHero(){
    if(agentMap[pacman.y][pacman.x] != AGENT){
        for(let i = 0; i < agentMap.length; i++)
            for(let j =0; j < agentMap[0].length; j++)
                if(agentMap[i][j] == AGENT) agentMap[i][j] = EMPTYNESS;

        agentMap[pacman.y][pacman.x] = AGENT;
    }
}


//---------------------------------------
// Game functions
//---------------------------------------

let wampus = {
    x: undefined,
    y: undefined,
    alive: true
}

function step(){
    if(gameStatus > 0) return;
    console.log(visited);
//     console.log("pacman " + pacman.x + " " + pacman.y + " " + pacman.direction);
//     console.log ("WAMPUSES" + wampuses);
//    console.log("HOLES" + holes);
//    console.log("ISBREEZE" + isBreeze(0,3));
//    console.log("ISBREEZE" + isBreeze(3,2));


    visited[pacman.y][pacman.x] = true;

    //stench,breeze,glitter,scream,bump
    let feeling = feel(pacman.x, pacman.y);

    for(let i = 0; i < agentMap.length; i++){
        console.log(agentMap[i]); 
     }
    console.log(feeling);


    if(feeling[3])
        wampus.alive = false;
    

    if(feeling[4]){
        goBack();
        return;
    }
    
   if(feeling[0] && wampus.x == undefined)
       pointAsWampus(pacman.x, pacman.y);

   if(feeling[1])
       pointAsHole(pacman.x, pacman.y);

    if((false || !feeling[0]) && !feeling[1]){
        if(pacman.x < gameMap[0].length - 1 && agentMap[pacman.y][pacman.x+1] == 0) agentMap[pacman.y][pacman.x+1] = EMPTYNESS;
        if(pacman.y > 0 && agentMap[pacman.y-1][pacman.x] == 0) agentMap[pacman.y-1][pacman.x] = EMPTYNESS
        if(pacman.x > 0 && agentMap[pacman.y][pacman.x-1] == 0) agentMap[pacman.y][pacman.x-1] = EMPTYNESS
        if(pacman.y < gameMap.length - 1 && agentMap[pacman.y+1][pacman.x] == 0) agentMap[pacman.y+1][pacman.x] = EMPTYNESS
    }

    if(feeling[2])
        grab();

    if(gameMap[pacman.y][pacman.x] == WAMPUS || gameMap[pacman.y][pacman.x] == HOLE){
        gameStatus = 1;
        endGame();
    }
    
    
    logic();

    for(let i = 0; i < holes.length; i++){
        console.log(wampuses[i]); 
     }

    heroMove();
    
    eraseMap();
    drawMap();

    
}

function heroMove(){
    // for(let i = 0; i < agentMap.length; i++){
    //     console.log(agentMap[i]); 
    //  }
    if(pacman.x < gameMap[0].length - 1 && agentMap[pacman.y][pacman.x+1] == EMPTYNESS && visited[pacman.y][pacman.x+1] == false) {
        agentMap[pacman.y][pacman.x] = EMPTYNESS;
        agentMap[pacman.y][pacman.x+1] = AGENT;
        pacman.x++;
        pacman.direction = "right"; 
        return;
    }

    if(pacman.y > 0 && agentMap[pacman.y-1][pacman.x] == EMPTYNESS && visited[pacman.y-1][pacman.x] == false) {
        agentMap[pacman.y][pacman.x] = EMPTYNESS;
        agentMap[pacman.y-1][pacman.x] = AGENT;
        pacman.direction = "up"; 
        pacman.y--;
        return;
    }

    if(pacman.x > 0 && agentMap[pacman.y][pacman.x-1] == EMPTYNESS && visited[pacman.y][pacman.x-1] == false) {
        agentMap[pacman.y][pacman.x] = EMPTYNESS;
        agentMap[pacman.y][pacman.x-1] = AGENT;
        pacman.direction = "left"; 
        pacman.x--; 
        return;
    }

    if(pacman.y < gameMap.length - 1  && agentMap[pacman.y+1][pacman.x] == EMPTYNESS && visited[pacman.y+1][pacman.x] == false) {
        agentMap[pacman.y][pacman.x] = EMPTYNESS;
        agentMap[pacman.y+1][pacman.x] = AGENT;
        pacman.direction = "down"; 
        pacman.y++;
        return;
    }

    let freeRoads = []
    if(pacman.x > 0 && agentMap[pacman.y][pacman.x-1] == EMPTYNESS) freeRoads.push("left");
    if(pacman.y < gameMap.length - 1  && agentMap[pacman.y+1][pacman.x] == EMPTYNESS) freeRoads.push("down");
    if(pacman.x < gameMap[0].length - 1 && agentMap[pacman.y][pacman.x+1] == EMPTYNESS) freeRoads.push("right");
    if(pacman.y > 0 && agentMap[pacman.y-1][pacman.x] == EMPTYNESS) freeRoads.push("up");

    let go = freeRoads[getRandomInt(0, freeRoads.length)];
    switch(go){
        case "right": {
            agentMap[pacman.y][pacman.x] = EMPTYNESS;
            agentMap[pacman.y][pacman.x+1] = AGENT;
            pacman.x++;
            pacman.direction = "right";
            return;
        }
        case "left": {
            agentMap[pacman.y][pacman.x] = EMPTYNESS;
            agentMap[pacman.y][pacman.x-1] = AGENT;
            pacman.direction = "left"; 
            pacman.x--; 
            return;
        }
        case "up":{
            agentMap[pacman.y][pacman.x] = EMPTYNESS;
            agentMap[pacman.y-1][pacman.x] = AGENT;
            pacman.direction = "up"; 
            pacman.y--;
            return;
        }
        case "down":{
            agentMap[pacman.y][pacman.x] = EMPTYNESS;
            agentMap[pacman.y+1][pacman.x] = AGENT;
            pacman.direction = "down"; 
            pacman.y++;
        }
    }

    return;
}


function grab(){
    gameStatus = 1;
    endGame();
    // goHome();
}

function goBack(){
    console.log(pacman.direction == "right");
    switch(pacman.direction){
        case "right": {
            agentMap[pacman.y][pacman.x] = WALL;
            agentMap[pacman.y][pacman.x-1] = AGENT;
            pacman.x--; 
            pacman.direction = "left";} break;
        case "left": {
            agentMap[pacman.y][pacman.x] = WALL;
            agentMap[pacman.y][pacman.x+1] = AGENT;
            pacman.x++; 
            pacman.direction = "right";} break;
        case "up": {
            agentMap[pacman.y][pacman.x] = WALL;
            agentMap[pacman.y+1][pacman.x] = AGENT; 
            pacman.y++; 
            pacman.direction = "down";} break;
        case "down": {
            agentMap[pacman.y][pacman.x] = WALL;
            agentMap[pacman.y-1][pacman.x] = AGENT;
            pacman.y--; 
            pacman.direction = "up"} break;
    }

    eraseMap();
    drawMap();
}

//---------------------------------------
// Logic functions
//---------------------------------------
/*const WALL = 1;
const EMPTYNESS = 2;
const GOLD = 3;
const AGENT = 5;
const WAMPUS = 7;
const HOLE = 9;
const SMELL = 8;
const WIND = 4;

*/

function logic(){
    for(let i = 0; i < gameMap.length; i++)
        for(let j = 0; j < gameMap[0].length; j++){
            if(agentMap[i][j] == EMPTYNESS) {holes[i][j] = -1; wampuses[i][j] = -1;}
            if(holes[i][j] == 1) detectHole(i,j);
            if(wampuses[i][j] == 1) detectWampus(i,j);

            if(wampuses[i][j] == 2) cleanWampuses(j,i);
        }
}
function cleanWampuses(x, y){
    for(let i = 0; i < wampuses.length; i++)
    for(let j = 0; j < wampuses[0].length; j++){
        wampuses[i][j] = -1;

        if(visited[i][j] && isStench(i,j)){
            if(j < gameMap[0].length - 1 && agentMap[i][j+1] == 0) agentMap[i][j+1] = EMPTYNESS;
            if(i > 0 && agentMap[i-1][j] == 0) agentMap[i-1][j] = EMPTYNESS
            if(j > 0 && agentMap[i][j-1] == 0) agentMap[i][j-1] = EMPTYNESS
            if(i < gameMap.length - 1 && agentMap[i+1][j] == 0) agentMap[i+1][j] = EMPTYNESS
        }
    }
    wampuses[y][x] = 2;

}

function pointAsHole(x,y){
    if(x > 0 && agentMap[y][x-1] != EMPTYNESS && holes[y][x-1] == 0 ) holes[y][x-1] = 1;
    if(y > 0 && agentMap[y-1][x] != EMPTYNESS && holes[y-1][x] == 0 ) holes[y-1][x] = 1;
    if(y < gameMap.length - 1 && agentMap[y+1][x] != EMPTYNESS && holes[y+1][x] == 0 ) holes[y+1][x] = 1;
    if(x < gameMap[0].length - 1 && agentMap[y][x+1] != EMPTYNESS && holes[y][x+1] == 0 ) holes[y][x+1] = 1;
}

function pointAsWampus(x,y){
    try{ if(agentMap[y][x-1] == 0 && wampuses[y][x-1] == 0 ) wampuses[y][x-1] = 1;} catch{}
    try{if(agentMap[y-1][x] == 0 && wampuses[y-1][x] == 0 ) wampuses[y-1][x] = 1;} catch{}
    try{if(agentMap[y+1][x] == 0 && wampuses[y+1][x] == 0 ) wampuses[y+1][x] = 1;} catch{}
    try{if(agentMap[y][x+1] == 0 && wampuses[y][x+1] == 0 ) wampuses[y][x+1] = 1;} catch{}
}


function detectHole(y,x){
    if(agentMap[y][x] == EMPTYNESS) {holes[y][x] = -1; return;}
    if(x > 0 && y < gameMap[0].length-1 && y > 0 && isBreeze(x, y+1)==true && isBreeze(x-1,y)==true
     && isBreeze(x, y-1)==false)
         {
             agentMap[y][x] = HOLE;
             holes[y][x]=2;
             holes[y+1][x]=-1;
             holes[y][x-1] =-1;
             holes[y+1][x-1]=-1;
             holes[x-1][y+1]  =-1
         }
    if(y > 0 && x < gameMap[0].length-1 &&  isBreeze(x-1,y) == true 
            && isBreeze(x,y-1)==true && isBreeze(x+1,y)==true){
             agentMap[y][x] = HOLE;
               holes[y][x] = 2;
               holes[y-1][x]=-1;
               holes[y][x+1] = -1;
               holes[x+1][y+1]=-1;
            };
    if(y >0 && x < gameMap[0].length-1 && isBreeze(x,y-1)==true 
                && isBreeze(x-1,y)==true && isBreeze(x,y-1)==false)
                {
                    agentMap[y][x] = HOLE;

                    holes[y][x] = 2;
                    holes[y+1][x]=-1;
                    holes[y][x+1] = -1;
                };
    if(y < gameMap[0].length-1 && x >0  
                && isBreeze(x, y+1)==true && isBreeze(x-1,y)&&isBreeze(x-1, y)==false){
                    agentMap[y][x] = HOLE;

                    holes[y][x] = 2;
                    
                    holes[y+1][x]=-1;
                    holes[y][x-1] = -1;
                }
    if(y < gameMap[0].length -1 && y > 0 
                &&  isBreeze(x,y-1)==true && isBreeze(x,y+1)==true 
                && isBreeze(x-1,y)==true&& isBreeze(x+1,y)==true){
                    agentMap[y][x] = HOLE;

                    holes[y][x] = 2;
                    holes[y+1][x] = 1;
                    holes[y-1][x] =1;
                }
    if(x < gameMap[0].length -1 && y < gameMap[0].length-1 && x > 0
     &&isBreeze(x+1,y)==true&&isBreeze(x,y+1)==true&&isBreeze(x-1,y)==true )
     {
        agentMap[y][x] = HOLE;

        holes[y][x] = 2;
        holes[y][x+1] = 1;
        holes[y+1][x] =1;
     }
    if(x < gameMap[0].length -1 && y < gameMap[0].length-1 && y > 0
        &&isBreeze(x+1,y)==true&&isBreeze(x,y+1)==true&&isBreeze(x,y-1)==true )
        {
           agentMap[y][x] = HOLE;
   
           holes[y][x] = 2;
           holes[y][x+1] = 1;
           holes[y+1][x] =1;
        }
    if(x  == gameMap[0].length && y == gameMap[0].length 
        && isBreeze(x-1,y)==true && isBreeze(x,y-1)==true && isBreeze(x-2,y-1)==false){
        agentMap[y][x] = HOLE;

        holes[y][x] = 2;
        holes[y][x-1] = 1;
        holes[y-1][x] =1;
    }
    if(x == gameMap[0].length && y == 0 
        && isBreeze(x,y+1)==true && isBreeze(x-1,y)==true && isBreeze(x-2,y+1)==false)
    {
        agentMap[y][x] = HOLE;

        holes[y][x] = 2;
        holes[y][x-1] = 1;
        holes[y+1][x] =1;
    }
    if(y == gameMap[0].length && x == 0 && isBreeze(x,y-1)==true 
    && isBreeze(x+1,y)==true && isBreeze(x+2,y-1)==false)
    {
        agentMap[y][x] = HOLE;

        holes[y][x] = 2;
        holes[y][x+1] = 1;
        holes[y-1][x] =1;
    }
    if(y == 0 && x == 0 && isBreeze(x,y+1)==true && isBreeze(x+1,y)==true
    && isBreeze(x+2,y+1)==false)
    {
        agentMap[y][x] = HOLE;

        holes[y][x] = 2;
        holes[y][x+1] = 1;
        holes[y+1][x] =1;
    }


}
function detectWampus(y,x){
    if(agentMap[y][x] != 0) {wampus[y][x] = -1; return;}

    let psbl = undefined;

    if(x > 0 && visited[x-1][y] && !isStench(x-1,y)) psbl = false;
    if(y > 0 && visited[x][y-1] && !isStench(x,y-1)) psbl = false;
    if(x < agentMap[0].length - 1 && visited[x+1][y] && !isStench(x+1,y)) psbl = false; 
    if(y < agentMap.length - 1 && visited[x][y+1] && !isStench(x,y+1)) psbl = false; 

    
    if(x>0 && x < agentMap[0].length - 1 && visited[x-1][y] && visited[x+1][y]) psbl = true;
    if(y>0 && y < agentMap.length - 1 && visited[x][y-1] && visited[x][y+1]) psbl = true;

    let counter = 0;
    if(y>0 && visited[x][y-1] && isStench(x,y-1)) counter++;
    if(x < agentMap[0].length - 1 && y > 0 && visited[x+1][y-1] && !isStench(x+1,y-1)) counter++;
    if(x < agentMap[0].length - 1 && visited[x+1][y] && isStench(x+1,y)) counter++;
    if(x < agentMap[0].length - 1 && y < agentMap.length - 1 && visited[x+1][y] && !isStench(x+1,y+1)) counter++;
    if(y < agentMap.length - 1 && visited[x][y] && isStench(x,y+1)) counter++;
    if(x > 0 && y < agentMap.length - 1 && visited[x-1][y+1] && !isStench(x-1,y+1)) counter++;
    if(x > 0 && visited[x-1][y] && isStench(x-1,y)) counter++;
    if(x > 0 && y > 0 && visited[x-1][y-1] && !isStench(x-1,y-1)) counter++;

    if(counter > 2) psbl = true;

    switch(psbl){
        case undefined: return;
        case true: {
             agentMap[y][x] = WAMPUS;
             wampuses[y][x]=2;
             wampus.x = x;
             wampus.y = y;
             return;
        }
        case false: {
            wampuses[y][x]=-1;
            if(y<agentMap.length - 1 && visited[y+1][x] && !isBreeze(y,x) && isStench(y+1,x) && agentMap[y][x-1] == 0) agentMap[y+1][x] = EMPTYNESS;
             if(x>0 && visited[y][x-1] && !isBreeze(y,x) && isStench(y,x-1) && agentMap[y][x-1] == 0) agentMap[y][x-1] = EMPTYNESS;
             if(y>0 && visited[y-1][x] && !isBreeze(y,x) && isStench(y-1,x) && agentMap[y][x-1] == 0) agentMap[y-1][x] = EMPTYNESS;
             if(x<agentMap[0].length - 1 && visited[y][x+1] && !isBreeze(y,x) && isStench(y,x+1) && agentMap[y][x+1] == 0) agentMap[y][x+1] = EMPTYNESS;
        }
    }

}


/*function detectHole(y,x){
    if(agentMap[y][x] == EMPTYNESS) {holes[y][x] = -1; return;}
    if(x > 0 && y < gameMap[0].length-1 && y > 0 && x < gameMap[0].length-1
         && isBreeze(x, y+1)==true && isBreeze(x-1,y)==true && isBreeze(x, y-1)==true && isBreeze(x,y-1)==true)
         {
             agentMap[y][x] = HOLE;
             holes[y][x]=2;
             
         }
}*/
function detectWampus(y,x){
    if(agentMap[y][x] == EMPTYNESS) {wampuses[y][x] = -1; return;}
    if(y >0 && x > 0 && visited[y-1][x]==true && visited[y][x-1]==true && visited[x-1][y-1] ==true
        && isStench(y-1,x)==true && isStench(y,x-1)==true && isStench(y-1,x-1)==false){
        agentMap[y][x] = WAMPUS;
        wampuses[y][x] = 2;
        wampuses[y-1][x]=-1;
        wampuses[y][x-1] = -1;
        };
    if(y > 0 && x < gameMap[0].length-1 && visited[y-1][x]==true
     && vistsed [y][x-1] == true && visited[y-1][x-1]==True && isStench(y,x-1) == true 
     && isStench(y-1,x)==true && isStench(y-1,x-1)==false){
        agentMap[y][x] = WAMPUS;
        wampuses[y][x] = 2;
        wampuses[y-1][x]=-1;
        wampuses[y][x+1] = -1;
     };
    if(y >0 && x < gameMap[0].length-1 && visited[y-1][x]==true && visited[y][x+1]==true 
    && visited[y-1][x+1]==true && isStench(y-1,x)==true 
    && isStench(y,x-1)==true && isStench(y-1,x+1)==false)
    {
        agentMap[y][x] = WAMPUS;
        wampuses[y][x] = 2;
        wampuses[y+1][x]=-1;
        wampuses[y][x+1] = -1;
    };
    if(y < gameMap[0].length-1 && x >0 && visited[y+1][x]==true
    && visited[y][x-1]==true && visited[y+1][x-1]==true 
    && isStench(y+1,x)==true && isStench(y,x-1)&&isStench(y+1,x-1)==false){
        agentMap[y][x] = WAMPUS;
        wampuses[y][x] = 2;
        wampuses[y+1][x]=-1;
        wampuses[y][x-1] = -1;
    }
    if(y < gameMap[0].length -1 && y > 0 
    && visited[y-1][x] == true && visited[y+1][x]== true 
    && isStench(y-1,x)==true && isStench(y+1,x)==true){
        agentMap[y][x] = WAMPUS;
        wampuses[y][x] = 2;
        wampuses[y+1][x] = 1;
        wampuses[y-1][x] =1;
    }
}
    /*
    if(wampuses[y+1][x]==SMELL&&wampuses[y][x-1]==SMELL && wampuses[y+1][x-1]==-1){
        wampuses[y][x] = 2;
        wampuses[y+1][x]=-1;
        wampuses[y][x-1] = -1;
    };
    if(wampuses[y+1][x] ==SMELL && wampuses[y-1][x]==SMELL){
        wampuses[y][x] = 2;
        wampuses[y+1][x] = 1;
        wampuses[y-1][x] =1;
    };
    if(wampuses[y][x-1]==SMELL&&wampuses[y][x+1]==SMELL){
        wampuses[y][x]=2;
        wampuses[y][x-1]=1;
        wampuses[y][x+1]=1;
    }
    
}

*/
//---------------------------------------
// Feel functions
//---------------------------------------

function feel(x,y){
    console.log(x + " " + y);
    let iS = isStench(x,y);
    let iB = isBreeze(x,y);
    let iG = isGlitter(x,y);
    let iSc = isScream(x,y);
    let iBm = isBump(x,y);

    let ans = [iS, iB, iG, iSc, iBm]

    return ans;
    
}

function isBreeze(x, y){
    if(x > 0 && gameMap[y][x-1] == HOLE) return true;
    if(y > 0 && gameMap[y-1][x] == HOLE) return true;
    if(x < gameMap[0].length - 1 && gameMap[y][x+1] == HOLE) return true;
    if(y < gameMap.length - 1 && gameMap[y+1][x] == HOLE) return true;
    
    return false;
}


function isStench(x, y){
    if(!wampus.alive && gameMap[x][y] == SMELL) return true; 

    if(x > 0 && (gameMap[y][x-1] == WAMPUS || (gameMap[y][x-1] == SMELL))) return true;
    if(y > 0 && (gameMap[y-1][x] == WAMPUS || (gameMap[y-1][x] == SMELL))) return true;
    if(x < gameMap[0].length - 1 && (gameMap[y][x+1] == WAMPUS || (gameMap[y][x+1] == SMELL))) return true;
    if(y < gameMap.length - 1 && (gameMap[y+1][x] == WAMPUS || (gameMap[y+1][x] == SMELL))) return true;
    
    return false;
}

function isGlitter(x, y){
    if(gameMap[y][x] == GOLD) return true;
    
    return false;
}

let screem = false;

function isScream(){
    if(screem){
        screem = false;
        gameMap[blinky.y][blinky.x] = SMELL;
        wampus.alive = false;
        return true;
    }

    return false;
}


function isBump(x,y){
    console.log(gameMap[y][x]);
    if(gameMap[y][x] == WALL) return true;

    return false;
}


//---------------------------------------
// Start functions
//---------------------------------------

let game;

function init(){
    setUpMap();
    setUpHeroes();

    for(let i = 0; i < agentMap.length; i++){
        console.log(gameMap[i]); 
     }

    drawMap();

    setInterval(step,1000)

}

function removeAllChildren(elem){
    while(elem.firstChild){
        elem.removeChild(elem.firstChild);
    }
}


//---------------------------------------
// End game functions
//---------------------------------------

function endGame(){
    eraseMap();
    scoreTitle = document.getElementById("score");
    document.body.removeChild(scoreTitle);

    message = document.createElement("h1");
    message.classList.add("title");

    btnRetry = document.createElement("button");
    btnRetry.classList.add("btn");
    btnRetry.innerHTML = "Retry";


    switch(res){
        case 1:
            message.innerHTML = "You lose!" + score;
            break;
        case 2:
            message.innerHTML = "You won!" + score;
            break;
    }

   
    document.body.appendChild(message);
    document.body.appendChild(btnRetry);

    score = 0;
    setUpMap();
    setUpHeroes();
    gameStatus = 0;


    btnRetry.addEventListener("click", () => {
        removeAllChildren(document.body);
        init();
    });
}

