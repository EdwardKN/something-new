var backCanvas = document.getElementById("background")
var foreCanvas = document.getElementById("foreground")
var bc = backCanvas.getContext("2d");
var fc = foreCanvas.getContext("2d");



backCanvas.width = 1920;
backCanvas.height = 1080;
foreCanvas.width = 1920;
foreCanvas.height = 1080;

perlin.seed(10)

var map = [];

var width = 150
var height = 150   
var buffer = new Uint8ClampedArray(width * height * 4); 
var newCanvas;

var pixelSize = 50;

var player = {
    x:-1000,
    y:-1000,
    speed:0,
    speedMax:5,
    vericalDirection:"",
    horizontalDirection:""
};
window.addEventListener("click",function(event){

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
        
            if(map[x][y] > 210){
                color = {
                    r:128,
                    g:128,
                    b:128
                }
            }else if(map[x][y] > 70){
                color = {
                    r:0,
                    g:128,
                    b:0
                }
            }else if(map[x][y] > 40){
                color = {
                    r:194,
                    g:178,
                    b:128
                }    
            }else{
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
    fc.fillStyle = "black";
    fc.fillRect(1920/2 - 25, 1080/2 - 50, 50,100)
}

function update(){

    requestAnimationFrame(update);

    bc.fillStyle = "blue";
    bc.fillRect(0,0,1920,1080);
    
    bc.drawImage(newCanvas, player.x,player.y,150*pixelSize,150*pixelSize);

    doWalk()

    renderForeground()
}

function doWalk(){
    if(player.vericalDirection === "up"){
        player.y += player.speed;
        if(player.speed < player.speedMax){
            player.speed+=0.1;
        }
    }
    if(player.vericalDirection === "down"){
        player.y -= player.speed;
        if(player.speed < player.speedMax){
            player.speed+=0.1;
        }
    }
    if(player.horizontalDirection === "left"){
        player.x += player.speed;
        if(player.speed < player.speedMax){
            player.speed+=0.1;
        }
    }
    if(player.horizontalDirection === "right"){
        player.x -= player.speed;
        if(player.speed < player.speedMax){
            player.speed+=0.1;
        }
    }
    if(player.horizontalDirection === "" && player.vericalDirection === ""){
        player.speed = 1;
    }
}

function generateMap(){
    for(let x = 0; x < 150; x++){
        let tmpMapX = []
        for(let y = 0; y < 150; y++){
            let perlinNoise = makePositive(parseInt(perlin.get(x/60, y/60) * 255 * 2))
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


function makePositive(a){
    if (a < 0) {
        a = a * -1;
    }
    return a;
}
    
