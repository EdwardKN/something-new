var backCanvas = document.getElementById("background")
var foreCanvas = document.getElementById("foreground")
var bc = backCanvas.getContext("2d");
var fc = foreCanvas.getContext("2d");

backCanvas.width = 1920;
backCanvas.height = 1980;
foreCanvas.width = 1920;
foreCanvas.height = 1980;

perlin.seed(10)

var map = [];

function renderBackground(){
    console.log("hej")
    bc.clearRect(0,0,1920,1080)
    for(let x = 0; x < 150; x++){
        for(let y = 0; y < 150; y++){
            bc.fillStyle = `rgba(${map[x][y]}, ${map[x][y]}, ${map[x][y]}, 1)`;
            

            if(map[x][y] > 210){
                bc.fillStyle = "gray"
            }else if(map[x][y] > 90){
                bc.fillStyle = "green"
            }else if(map[x][y] > 60){
                bc.fillStyle = "white"
            }else{
                bc.fillStyle = "blue"
            }    
            

 


            bc.fillRect(x*10,y*10,10,10)
        }
    }
}
function renderForeground(){

}


function generateMap(){
    for(let x = 0; x < 150; x++){
        let tmpMapX = []
        for(let y = 0; y < 150; y++){
            let perlinNoise = makePositive(parseInt(perlin.get(x/60, y/60) * 255 * 2))
            if(x < 20){
                perlinNoise -= ((20-x))*10
            }
            if(y < 20){
                perlinNoise -= ((20-y))*10
            }
            if(x > 130){
                perlinNoise -= (x-130)*10
            }
            if(y > 130){
                perlinNoise -= (y-130)*10
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
