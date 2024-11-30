import Scene from "./Scene.js"
const config = {
    width: window.innerWidth,
    height: window.innerHeight,
   
    scene:[Scene],
    scale: {
        mode: Phaser.Scale.RESIZE, 
        autoCenter: Phaser.Scale.CENTER_BOTH 
    },
    physics: {
        default: "arcade"
    }
}
window.onload = ()=>{
    const Astro_Salvage = new Phaser.Game(config)
    
}



