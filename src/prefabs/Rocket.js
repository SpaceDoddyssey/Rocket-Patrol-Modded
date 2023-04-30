// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // add to existing, displayList, updateList
        this.isFiring = false;      // track rocket's firing status
        this.moveSpeed = 2;         // pixels per frame

        scene.input.on('pointerdown', this.fire.bind(this));
    }

    update() {
        // fire button
        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            this.fire()
        }
        // if fired, move up
        if(this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        // reset on miss
        if(this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }

        if(game.input.mousePointer.x >= 0 && game.input.mousePointer.x <= game.config.width){
            let speed = (this.isFiring ? this.moveSpeed / 2 : this.moveSpeed);
            if(     this.x < game.input.mousePointer.x) { this.x += speed; } 
            else if(this.x > game.input.mousePointer.x) { this.x -= speed; }
        }
    }

    fire(){
        if(!this.isFiring){
            this.isFiring = true;
            this.scene.sound.play('sfx_rocket');  // play sfx
        }
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}
