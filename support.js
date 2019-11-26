//Convert to classes
class Sprite {
    #imgSrc;
    #image;
    scale;
    constructor(imageSrc, scale=[1, 1]){
        this.#imgSrc = imageSrc;
        this.scale = {x: scale[0], y: scale[1]};
    }
    initImage(){
        this.#image = document.getElementById(this.#imgSrc);
    }
    draw(left, top, width, height){
        GAME.context.drawImage(this.#image,
            left, top,
            width * this.scale.x,
            height * this.scale.y);
    }
}
class Animation {
    #spriteList;
    frameDelay;
    timer;
    active = false;
    autoloop;
    currentSprite;
    name;
    timer;
    constructor(spriteList, frameDelay, autoloop, name=""){
        this.#spriteList = spriteList;
        this.frameDelay = frameDelay;
        this.timer = 0;
        this.active = false;
        this.autoloop = autoloop;
        this.currentSprite = 0;
        this.name = name;
    }
    init(){
        for(var i in this.#spriteList){
            this.#spriteList[i].initImage();
        }
    }
    draw(left, top, width, height){
        if(this.timer == this.frameDelay){
            if(this.autoloop || this.currentSprite < this.#spriteList.length - 1){
                this.currentSprite++;
                this.currentSprite %= this.#spriteList.length;
                this.timer = 0;
            }
        }
        this.#spriteList[this.currentSprite].draw(left, top, width, height);
        this.timer++;
    }
    reset(){
        this.timer = 0;
        this.currentSprite = 0;
    }
}
class Entity {
    pPosition;
    position;
    velocity;
    width;
    height;
    dead;
    rotation;
    delayTimer;
    invinciTimer;
    animation;
    keyPBindings;
    keyRBindings;
    color;
    constructor(X, Y, W, H){
        this.pPosition = {x: X, y: Y};
        this.position = {x: X, y: Y};
        this.velocity = {x: 0, y: 0};
        this.width = W;
        this.height = H;
        this.dead = false;
        this.rotation = 0;
        this.invinciTimer = 0;
        this.delayTimer = 0;
        this.color = "#000000";
    }
    move(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    applyFriction(){
        this.velocity.x *= GAME.friction;
        this.velocity.y *= GAME.friction;
    }
    applyGravity(){
        this.velocity.y += GAME.gravity;
    }
    applyForce(x, y){
        this.velocity.x += x;
        this.velocity.y += y;
    }
    collides(obj){
        if(obj instanceof Entity){
            return (this.position.x + this.width > obj.position.x &&
                this.position.x < obj.position.x + obj.width &&
                this.position.y + this.height > obj.position.y &&
                this.position.y < obj.position.y + obj.height);
        }
        return false;
    }
    onScreen = function(){
        return (this.position.x - GAME.camera.x + this.width > 0 &&
        this.position.x - GAME.camera.x < GAME.canvas.width &&
        this.position.y - GAME.camera.y + this.height > 0 &&
        this.position.y - GAME.camera.y < GAME.canvas.height);
    }
    centerPosition(){
        var CTX = GAME.context;
        CTX.save();
        CTX.translate(this.position.x + this.width/2 - GAME.camera.x,
                    this.position.y + this.height/2 - GAME.camera.y);
        CTX.rotate(this.rotation);
    }
    draw(){
        var CTX = GAME.context;
        this.centerPosition();
        if(this.animation !== undefined){
            this.animation.draw(-this.width/2, -this.height/2, this.width, this.height);
        }else{
            CTX.fillStyle = this.color;
            CTX.fillRect(-this.width/2, -this.height/2, this.width, this.height);
        }
        CTX.restore();
    }
    interact(obj){}
    whenHit(obj){}
    // Game logic-only function
    update(){}
    handleKeyPress(keyCode){
        if(keyCode in this.keyPBindings){
            this.keyPBindings[keyCode].call(this);
        }
    }
    handleKeyRelease(keyCode){
        if(keyCode in this.keyRBindings){
            this.keyRBindings[keyCode].call(this);
        }
    }
    setKeyPressBinding(keyCode, func){
        this.keyPBindings[keyCode] = func;
    }
    setKeyReleaseBinding(keyCode, func){
        this.keyRBindings[keyCode] = func;
    }
    resetKeyBindings(){
        this.keyPBindings = {};
        this.keyRBindings = {};
    }
}