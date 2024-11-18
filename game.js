import Level1 from "./Level1.js"
const config = {
    width: window.innerWidth,
    height: window,innerHeight,
   
    scene:[Level1],
    scale: {
        mode: Phaser.Scale.RESIZE, 
        autoCenter: Phaser.Scale.CENTER_BOTH 
    },
    physics: {
        default: "arcade", // Enable arcade physics
        arcade: {
            gravity: { y: 0 }, // No gravity since it's a top-down game
            
        }
    }
}
window.onload = ()=>{
    const desertWaterRush = new Phaser.Game(config)
    
}



