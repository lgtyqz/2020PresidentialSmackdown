var GAME = {
    canvas: document.createElement("canvas"),
    start: function(){
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },
    activate: function(){
        this.interval = setInterval(main, 20);
        GAME.DATE = new Date();
        this.isPaused = false;
        setSprites();
    },
    pause: function(){
        clearInterval(this.interval);
        this.isPaused = true;
        for(var i = 0; i < musics.length; i++){
            musics[i].pause();
        }
    },
    clear: function(){
        this.context.clearRect(0, 0, this.canvas.width * 2, this.canvas.height * 2);
    },
    save: function(){
        
    },
    load: function(){
        
    },
    restart: function(){
        entities = [];
        backgroundTiles = [];
        backgroundTimer = 0;
        GAME.load();
    },
    handleBGM: function(){
        for(var i = 0; i < musics.length; i++){
            musics[i].pause();
        }
    },
    nextLevel: function(){
        GAME.level++;
        GAME.frameCount = 0;
        backgroundTimer = 0;
        player.hp = 3;
        GAME.handleBGM();
        GAME.save();
    },
    frameCount: 0,
    gravity: 1.5,
    friction: 0.9,
    state: 0,
    camera: {x:0, y:0},
    debugMode: false,
    isPaused: true,
    musicVolume: 1,
    DATE: new Date(),
    loadedEverything: false,
}
function colorToList(color){
    return [
        parseInt(color.slice(1, 3), 16),
        parseInt(color.slice(3, 5), 16),
        parseInt(color.slice(5, 7), 16)];
}
function listToColor(color){
    return "#" + ("0"+(Number(color[0]).toString(16))).slice(-2).toUpperCase() +
                ("0"+(Number(color[1]).toString(16))).slice(-2).toUpperCase() +
                ("0"+(Number(color[2]).toString(16))).slice(-2).toUpperCase();
}
var sounds = {

};
var musics = [];
var spriteAnimations = {};
function setSprites(){
    spriteAnimations = {
        default_dance: new Animation([
            new Sprite("h1", [1, 1]),
            new Sprite("h2", [1, 1]),
            ],
            3, true),
    };
    for(var i in spriteAnimations){
        spriteAnimations[i].init();
    }
    setAnimations();
}
function setAnimations(){
    player.animation = spriteAnimations.default_dance;
}
function init(){
    GAME.start();
    GAME.activate();
}
player = new Player(50, 50, 50, 50);
player2 = new Player(90, 50, 50, 50);
player2.resetKeyBindings();
player2.setKeyPressBinding(37, player2.moveLeft);
player2.setKeyPressBinding(39, player2.moveRight);
player2.setKeyPressBinding(38, player2.jump);
player2.setKeyPressBinding(40, player2.meteor);
player2.setKeyReleaseBinding(37, player2.stopMoveLeft);
player2.setKeyReleaseBinding(39, player2.stopMoveRight);
var entities = [];
entities.push(new Platform(25, 200, 200, 50));
document.onkeydown = function(e){
    e = e || window.event;
    player.handleKeyPress(e.keyCode);
    player2.handleKeyPress(e.keyCode);
}
document.onkeyup = function(e){
    e = e || window.event;
    player.handleKeyRelease(e.keyCode);
    player2.handleKeyRelease(e.keyCode);
}
function main(){
    if(!GAME.loadedEverything){
        for(var i in spriteAnimations){
            for(var j in spriteAnimations[i].spriteList){
                if(!spriteAnimations[i].spriteList[j].image){
                    console.log(spriteAnimations[i]);
                    setSprites();
                    return;
                }
            }
        }
        GAME.loadedEverything = true;
        //document.getElementById("load").innerHTML = "";
        return;
    }
    GAME.clear();
    GAME.context.fillStyle = "#FFFFFF";
    GAME.context.fillRect(-GAME.canvas.width * 3, -GAME.canvas.height * 3,
        GAME.canvas.width * 6, GAME.canvas.height * 6);
    player.update();
    player2.update();
    for(var e in entities){
        entities[e].interact(player);
        entities[e].interact(player2);
        entities[e].draw();
    }
}