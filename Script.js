var backCanvas = document.getElementById("background")
var foreCanvas = document.getElementById("foreground")
var bc = backCanvas.getContext("2d");
var fc = foreCanvas.getContext("2d");



backCanvas.width = 1920;
backCanvas.height = 1080;
foreCanvas.width = 1920;
foreCanvas.height = 1080;

var map = [];

var width = 150
var height = 150   
var buffer = new Uint8ClampedArray(width * height * 4); 
var newCanvas;

var pixelSize = 50;
var seed = Math.floor(Math.random() * 1000000000)

var player = {
    x:-1000,
    y:-1000,
    speed:0,
    speedMax:5,
    vericalDirection:"",
    horizontalDirection:""
};
var mouse = {
    x:0,
    y:0,
    blockX:0,
    blockY:0
};


var fps = undefined;

var fpsMultiplier = fps / 60;

setTimeout(() => {
    png_font.setup(
        document.getElementById("foreground").getContext("2d"));
}, 10);


foreCanvas.addEventListener("mousemove",function(event){
    console.log(event)

    mouse.x = event.clientX
    mouse.y = event.clientY

    renderCursor();
})

window.addEventListener("click",function(event){
    document.documentElement.requestFullscreen();
})
window.addEventListener("keydown",function(event){
    console.log(event.code);

    if(event.code === "KeyW") {
        player.vericalDirection = "up"
    }
    if(event.code === "KeyS") {
        player.vericalDirection = "down"
    }
    if(event.code === "KeyA") {
        player.horizontalDirection = "left"
    }
    if(event.code === "KeyD") {
        player.horizontalDirection = "right"
    }
})
window.addEventListener("keyup",function(event){
    console.log(event.code);

    if(event.code === "KeyW") {
        player.vericalDirection = ""
    }
    if(event.code === "KeyS") {
        player.vericalDirection = ""
    }
    if(event.code === "KeyA") {
        player.horizontalDirection = ""
    }
    if(event.code === "KeyD") {
        player.horizontalDirection = ""
    }
})
function renderBackground(){

    bc.imageSmoothingEnabled = false;
    fc.imageSmoothingEnabled = false;

    for(var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            let color = {
                r:128,
                g:128,
                b:128
            }
        
            if(map[x][y] > 180 && map[x][y]<255){
                color = {
                    r:128,
                    g:128,
                    b:128
                }
            }else if(map[x][y] > 60){
                color = {
                    r:0,
                    g:128,
                    b:0
                }
            }else if(map[x][y] > 30){
                color = {
                    r:194,
                    g:178,
                    b:128
                }    
            }else if(map[x][y] < 255){
                color = {
                    r:0,
                    g:0,
                    b:255
                }    
            }    

            var pos = (y * width + x) * 4; // position in buffer based on x and y
            buffer[pos  ] = color.r;           // some R value [0, 255]
            buffer[pos+1] = color.g;           // some G value
            buffer[pos+2] = color.b;           // some B value
            buffer[pos+3] = 255;           // set alpha channel
        }
    }




        // create imageData object
        var idata = bc.createImageData(width, height);

        newCanvas = document.createElement("canvas");

        newCanvas.width = 150
        newCanvas.height = 150




        // set our buffer as source
        idata.data.set(buffer);

        newCanvas.getContext("2d").putImageData(idata, 0, 0);

        bc.drawImage(newCanvas, player.x,player.y,150*pixelSize,150*pixelSize);

        update();
}


function renderForeground(){
    fc.clearRect(0,0,1920,1080)

    
    fc.fillStyle = "black";
    fc.fillRect(1920/2 - 25, 1080/2 - 50, 50,100)

    
    fc.strokeRect(mouse.blockX,mouse.blockY,50,50)

}

function renderCursor(){
    let oldBlX = mouse.blockX
    let oldBlY = mouse.blockY

    mouse.blockX = (mouse.x) - ((mouse.x-player.x ) % 50)
    mouse.blockY = (mouse.y) - ((mouse.y-player.y ) % 50)

    
    if(oldBlX !== mouse.blockX || oldBlY !== mouse.blockY){


        renderForeground();

    }

}
function update(){

    bc.fillStyle = "blue";
    bc.fillRect(0,0,1920,1080);
    
    bc.drawImage(newCanvas, player.x,player.y,150*pixelSize,150*pixelSize);

    doWalk()

    fc.clearRect(0,0,100,50);

    fc.font = "20px Arial";
    fc.fillStyle = "black";
    fc.fillText("FPS:"+fpsMultiplier*60,10,20);

}
renderForeground();


function doWalk(){
    if(player.vericalDirection === "up"){
        player.y += player.speed *fpsMultiplier;
        if(player.speed < player.speedMax){
            player.speed+=0.1;
        }
    }
    if(player.vericalDirection === "down"){
        player.y -= player.speed*fpsMultiplier;
        if(player.speed < player.speedMax){
            player.speed+=0.1;
        }
    }
    if(player.horizontalDirection === "left"){
        player.x += player.speed*fpsMultiplier;
        if(player.speed < player.speedMax){
            player.speed+=0.1;
        }
    }
    if(player.horizontalDirection === "right"){
        player.x -= player.speed*fpsMultiplier;
        if(player.speed < player.speedMax){
            player.speed+=0.1;
        }
    }
    if(player.horizontalDirection === "" && player.vericalDirection === ""){
        player.speed = 1;
    }else{
        renderCursor();
    }
}

function generateMap(){
    for(let x = 0; x < 150; x++){
        let tmpMapX = []
        for(let y = 0; y < 150; y++){
            let perlinNoise = makePositive(parseInt(perlin.get(x/60, y/60,seed) * 255 * 2))
            if(x < 30){
                perlinNoise -= ((30-x))*10
            }
            if(y < 30){
                perlinNoise -= ((30-y))*10
            }
            if(x > 120){
                perlinNoise -= (x-120)*10
            }
            if(y > 120){
                perlinNoise -= (y-120)*10
            }
            
            if(perlinNoise < 0){
                perlinNoise = 0;
            }
            
            tmpMapX.push(perlinNoise)
        }
        map.push(tmpMapX)
    }
}

generateMap()

setTimeout(() => {
    renderBackground()

}, 1000);

function updateFPS(thisFps) {
    clearInterval(interval1);
    interval1 = undefined;
    interval1 = setInterval(update, 1000 / thisFps);
    fpsMultiplier = thisFps / 60;
}

interval1 = setInterval(update, 1000 / fps);

setInterval(() => {
    fps = oldCount - oldCount3;
    oldCount3 = oldCount;
    if (fps !== oldFPS) {
        updateFPS(fps)
    }
    oldFPS = fps;
}, 1000);

var oldFPS = 0;

var oldCount3 = 0;
var oldCount2 = 0;
var oldCount = 0;

count()

function count() {
    requestAnimationFrame(count)

    oldCount = oldCount2;
    oldCount2++;
    return oldCount;

}

function makePositive(a){
    if (a < 0) {
        a = a * -1;
    }
    return a;
}
    
