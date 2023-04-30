class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }

    preload() {
      // load images/tile sprites
      this.load.image('rocket', './assets/rocket.png');
      this.load.image('spaceship', './assets/spaceship.png');
      this.load.image('smallship', './assets/small_ship.png')
      this.load.image('starfield', './assets/Space Background.png');
      this.load.image('planets', './assets/Space Background Planets.png');

      // load spritesheets
      this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
      // green UI background
      this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
      // white borders
      this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
      this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
      this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
      this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

      // place tile sprite
      this.starfield = this.add.tileSprite(0, 0, 0, 480, 'starfield').setOrigin(0, 0);
      this.planets   = this.add.tileSprite(0, 0, 0, 480, 'planets').setOrigin(0, 0);

      // add rocket (p1)
      this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

      // define keys
      keyF     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
      keyR     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
      keyLEFT  = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
      keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

      // add spaceships (x3)
      this.ship01    = new Spaceship(this, 6, borderUISize*5                  , 'spaceship', 0, 30, 3).setOrigin(0,0);
      this.ship02    = new Spaceship(this, 3, borderUISize*6 + borderPadding*1, 'spaceship', 0, 20, 2).setOrigin(0,0);
      this.ship03    = new Spaceship(this, 0, borderUISize*7 + borderPadding*2, 'spaceship', 0, 10, 1).setOrigin(0,0);
      this.smallShip = new Smallship(this, 9, borderUISize*3                  , 'smallship', 0, 80, 10).setOrigin(0,0);

      // animation config
      this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
        frameRate: 30
      });

      // initialize score
      this.p1Score = 0;
      // display score
      let scoreConfig = {
        fontFamily: 'Courier',
        fontSize: '28px',
        backgroundColor: '#F3B141',
        color: '#843605',
        align: 'right',
        padding: {
          top: 5,
          bottom: 5,
        },
        fixedWidth: 150
      }
      this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, "SCORE:"+this.p1Score, scoreConfig);
      this.scoreHigh = this.add.text(game.config.width-borderPadding-borderUISize-scoreConfig.fixedWidth, borderUISize + borderPadding*2, "HIGH:"+highScore, scoreConfig);

      //display timer
      this.timeInSeconds = Math.round(game.settings.gameTimer / 1000);
      let timerConfig = scoreConfig;
      timerConfig.align = 'left';
      timerConfig.fixedWidth = 120;
      this.timerText = this.add.text(game.config.width / 2 - 60, borderUISize + borderPadding*2, "TIME:" + this.timeInSeconds, timerConfig);

      // GAME OVER flag
      this.gameOver = false;

      // play clock
      scoreConfig.fixedWidth = 0;
      this.timer = this.time.addEvent({delay: 1000, callback: this.updateTimer, callbackScope: this, loop: true });
    
      var backgroundMusic = this.sound.add('song');
      backgroundMusic.loop = true;
      backgroundMusic.play();
    }

    updateTimer(){
      if(this.timeInSeconds > 0){
        this.timeInSeconds--;
      }
      if(this.timeInSeconds == 30){
        this.ship01.moveSpeed *= 1.2;
        this.ship02.moveSpeed *= 1.2;
        this.ship03.moveSpeed *= 1.2;
      }
      if(this.timeInSeconds == 0){
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart', scoreConfig).setOrigin(0.5);
        this.gameOver = true;
      }
      this.timerText.setText("TIME:" + this.timeInSeconds);
    }

    update() {
      // check key input for restart
      if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
        this.scene.restart();
      }
      
      this.starfield.tilePositionX -= 2;
      this.planets.tilePositionX   -= 3;

      if (!this.gameOver) {               
        this.p1Rocket.update();         // update rocket sprite
        this.ship01.update();           // update spaceships (x3)
        this.ship02.update();
        this.ship03.update();
        this.smallShip.update();
      }

      // check collisions
      if(this.checkCollision(this.p1Rocket, this.ship01)) {
          this.p1Rocket.reset();
          this.shipExplode(this.ship01);
      }
      if (this.checkCollision(this.p1Rocket, this.ship02)) {
          this.p1Rocket.reset();
          this.shipExplode(this.ship02);
      }
      if (this.checkCollision(this.p1Rocket, this.ship03)) {
          this.p1Rocket.reset();
          this.shipExplode(this.ship03);
      }
      if (this.checkCollision(this.p1Rocket, this.smallShip)) {
        this.p1Rocket.reset();
        this.shipExplode(this.smallShip);
      }
    }

    checkCollision(rocket, ship) {
      // simple AABB checking
      if (rocket.x < ship.x + ship.width && 
        rocket.x + rocket.width > ship.x && 
        rocket.y < ship.y + ship.height &&
        rocket.height + rocket.y > ship. y) {
        return true;
      } else {
        return false;
      }
    }

    shipExplode(ship) {
      // temporarily hide ship
      ship.alpha = 0;                         
      // create explosion sprite at ship's position
      let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
      boom.anims.play('explode');             // play explode animation
      boom.on('animationcomplete', () => {    // callback after ani completes
        ship.explode();                       // reset ship position
        ship.alpha = 1;                     // make ship visible again
        boom.destroy();                     // remove explosion sprite
      });
      // score add and repaint
      this.p1Score += ship.points;
      this.scoreLeft.text = "SCORE:" + this.p1Score;
      if(this.p1Score > highScore){
        highScore = this.p1Score;
        this.scoreHigh.text = "HIGH:" + this.p1Score;
      }
      this.timeInSeconds += ship.timevalue + 1;
      this.updateTimer();

      let sfxnum = Math.floor(Math.random() * 7); 
      this.sound.play('explosion' + sfxnum);
    }
  }