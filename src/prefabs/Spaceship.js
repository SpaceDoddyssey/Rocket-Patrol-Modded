// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, offset, y, texture, frame, pointValue, timeValue) {
        let dir = Math.round(Math.random());
        if(dir == 0){ //Left
            super(scene, -borderUISize*offset, y, texture, frame);
            this.flipX = true;
            
        } else {
            super(scene, game.config.width + borderUISize*offset, y, texture, frame);
        }
        this.dir = dir;
        scene.add.existing(this);   // add to existing scene
        this.points = pointValue;   // store pointValue
        this.timevalue = timeValue;
        this.moveSpeed = game.settings.spaceshipSpeed;        // pixels per frame
    }

    update() {
        // move spaceship left
        if(this.dir == 0){
            this.x += this.moveSpeed;
        } else {
            this.x -= this.moveSpeed;
        }
        // wrap around from left edge to right edge or vice-versa
        if(this.dir == 1 && this.x <= 0 - this.width) {
            this.reset();
        } else if(this.dir == 0 && this.x >= game.config.width){
            this.reset();
        }
    }

    // position reset
    reset() {
        if(this.dir == 0){
            this.x = -this.width;
        } else {
            this.x = game.config.width;
        }
    }

    explode() { //Resets and also potentially changes direction
        this.dir = Math.round(Math.random());
        if(this.dir == 0){ //Left
            this.flipX = true;
        } else {
            this.flipX = false;
        }
        this.reset();
    }
}