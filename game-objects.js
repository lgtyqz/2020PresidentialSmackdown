class Player extends Entity {
    movingLeft;
    movingRight;
    jumping;
    constructor(X, Y, W, H){
        super(X, Y, W, H);
        this.keyPBindings = {
            65: this.moveLeft,
            68: this.moveRight,
            87: this.jump,
            83: this.meteor
        };
        this.keyRBindings = {
            65: this.stopMoveLeft,
            68: this.stopMoveRight,
        };
        this.movingLeft = false;
        this.movingRight = false;
        this.jumping = false;
    }
    moveLeft(){ this.movingLeft = true; }
    moveRight(){ this.movingRight = true; }
    stopMoveLeft(){ this.movingLeft = false; }
    stopMoveRight(){ this.movingRight = false; }
    jump(){ this.applyForce(0, -25); }
    meteor(){ this.applyForce(0, 20); }
    update(){
        this.draw();
        if(this.movingLeft){
            this.applyForce(-1, 0);
        }
        if(this.movingRight){
            this.applyForce(1, 0);
        }
        this.move();
        this.applyFriction();
        this.applyGravity();
    }
}

class Platform extends Entity {
    bounceCoef;
    meteorCoef;
    detectionDepth;
    constructor(X, Y, W, H){
        super(X, Y, W, H);
        this.bounceCoef = 0.25;
        this.detectionDepth = 20;
        this.meteorCoef = 1;
    }
    interact(obj){
        if(this.collides(obj)){
            //console.log(Math.abs(obj.velocity.y));
            if(Math.abs(obj.velocity.y)/GAME.friction >= this.detectionDepth){
                obj.velocity.y = -this.meteorCoef * obj.velocity.y;
            }
            if(Math.abs(obj.velocity.x)/GAME.friction >= this.detectionDepth){
                obj.velocity.x = -this.meteorCoef * obj.velocity.x;
            }
            if(obj.position.y + obj.height < this.position.y + this.detectionDepth && obj.velocity.y - this.velocity.y> 0){
                obj.position.y = this.position.y - obj.height;
                obj.velocity.y *= -this.bounceCoef;
                if(obj.velocity.y >= -2 * GAME.gravity * this.detectionDepth * 1.05){
                    obj.velocity.y = 0;
                }
                if(GAME.gravity > 0){
                    // regain the jump
                    obj.jumping = false;
                }
            }else
            //Left Wall collision
            if(obj.position.x + obj.width < this.position.x + this.detectionDepth && obj.velocity.x - this.velocity.x > 0){
                obj.position.x = this.position.x - obj.width;
                obj.velocity.x *= -this.bounceCoef;
            }else
            //Right Wall collision
            if(obj.position.x > this.position.x + this.width - this.detectionDepth && obj.velocity.x - this.velocity.x < 0){
                obj.position.x = this.position.x + this.width;
                obj.velocity.x *= -this.bounceCoef;
            }else
            //Ceiling collision
            if(obj.position.y > this.position.y + this.height - this.detectionDepth && obj.velocity.y - this.velocity.y < 0){
                obj.position.y = this.position.y + this.height;
                obj.velocity.y *= -this.bounceCoef;
                if(GAME.gravity < 0){
                    obj.jumping = false;
                }
            }
        }
    }
}