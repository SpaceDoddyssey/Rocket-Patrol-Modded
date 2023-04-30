//Cameron Dodd
//Rocket Patrol: Revengeance (Featuring Dante from the Devil May Cry series)

//Estimated time taken: 10-15 hours

//Mods implemented:
// -High score tracking (5)
// -Background Music (5)
// -Speed increase after 30 seconds (I chose to trigger it when 30 seconds remain instead of after 30 seconds) (5)
// -Randomize each spaceship's movement direction each time they spawn (5)
// -New scrolling tile sprite for the background (5)
// -Allow the player to control the Rocket after it's fired (I did reduce movement speed while firing) (5)
// (Subtotal: 30)

// -Create 4 new explosion sound effects and randomize which one plays on impact (10)
// -Display the time remaining (in seconds) on the screen (10)
// -parallax scrolling for the background (10)
// (Subtotal: 30)

// -New enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (15)
// -New timing/scoring mechanism that adds time to the clock for successful hits (15)
// -Mouse control for player movement and mouse click to fire (15)
// (Subtotal: 45)

// Total: 105

//Music generated with:           https://pernyblom.github.io/abundant-music/index.html
//Small rocket sprite from:       https://opengameart.org/content/rocket
//Space background created using: https://deep-fold.itch.io/space-background-generator

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene:[ Menu, Play ]
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// High score
let highScore = 0;

let mouseActive = false;