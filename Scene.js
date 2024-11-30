export default class Scene extends Phaser.Scene {
    constructor() {
        super("Scene");
        this.score = 0;
    }

    preload() {
        this.load.spritesheet("ship", "assets/spiceShp.png", { frameWidth: 80, frameHeight: 80 });
        this.load.image("space", "assets/s.png");
        this.load.image("smallAstro", "assets/astro1.png");
        this.load.image("medAstro", "assets/astro3.png");
        this.load.image("bigAstro", "assets/astro2.png");
        this.load.image("part1", "assets/pa1.png");
        this.load.audio("spaceSound", "assets/a.mp3");
    }

    create() {
        this.setupScene();
        this.addBackground();
        this.addPlayer();
        this.initializeAudio();
        this.createTextElements();
        this.addPhysicsGroups();
        this.setupCollisions();
        this.initializeControls();
        this.setupTimers();
    }

    update() {
        this.moveBackground();
        this.handlePlayerInput();
    }

    setupScene() {
        this.cam = this.cameras.main;
        this.cam.setBounds(0, 0, window.innerWidth, window.innerHeight);
    }

    addBackground() {
        this.space = this.add.tileSprite(
            this.cam.width / 2,
            this.cam.height / 2,
            window.innerWidth,
            window.innerHeight,
            "space"
        ).setScrollFactor(0);
    }

    addPlayer() {
        this.createPlayerAnimation();
        this.ship = this.physics.add.sprite(0, this.cam.height / 2, "ship")
            .setScale(1)
            .setCollideWorldBounds(true)
            .setAngle(90)
            .play("container-anim");
        this.cam.startFollow(this.ship);
    }

    createPlayerAnimation() {
        this.anims.create({
            key: "container-anim",
            frames: this.anims.generateFrameNumbers("ship", { frames: [8, 9, 10, 11] }),
            frameRate: 10,
            repeat: -1,
        });
    }

    initializeAudio() {
        this.sound.add("spaceSound", { loop: true }).play();
    }

    createTextElements() {
        this.scoreText = this.add.text(10, 10, `Score: 0 / 300`, { fontSize: "24px", fill: "#FFFFFF" }).setScrollFactor(0);
    }

    addPhysicsGroups() {
        this.parts = this.physics.add.group();
        this.astros = this.physics.add.group();
    }

    setupCollisions() {
        this.physics.add.overlap(this.ship, this.parts, this.collectPart, null, this);
        this.physics.add.overlap(this.ship, this.astros, this.hitAstro, null, this);
    }

    initializeControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    setupTimers() {
        this.time.addEvent({ delay: 1000, callback: this.spawnObject, callbackScope: this, loop: true });
    }

    moveBackground() {
        this.space.tilePositionX += 3;
    }

    handlePlayerInput() {
        const { up, down, left, right } = this.cursors;
        const velocity = 200;

        if (up.isDown) this.ship.setVelocityY(-velocity);
        else if (down.isDown) this.ship.setVelocityY(velocity);
        else if (left.isDown) this.ship.setVelocityX(-velocity);
        else if (right.isDown) this.ship.setVelocityX(velocity);
        else this.ship.setVelocity(0);
    }

    spawnObject() {
        const yPosition = Phaser.Math.Between(50, this.cam.height - 50);
        if (Phaser.Math.Between(0, 10) > 3) {
            this.spawnPart(yPosition);
        } else {
            this.spawnAstro(yPosition);
        }
    }

    spawnPart(y) {
        this.parts.create(this.cam.width, y, "part1")
            .setScale(0.55)
            .setVelocityX(-200);
    }

    spawnAstro(y) {
        const astroTypes = [
            { key: "smallAstro", scale: 0.6, damage: 10 },
            { key: "medAstro", scale: 0.9, damage: 20 },
            { key: "bigAstro", scale: 1.2, damage: 30 },
        ];
        const selectedAstro = Phaser.Utils.Array.GetRandom(astroTypes);

        this.astros.create(this.cam.width, y, selectedAstro.key)
            .setScale(selectedAstro.scale)
            .setVelocityX(-200)
            .setData("damage", selectedAstro.damage);
    }

    collectPart(_, part) {
        part.destroy();
        this.updateScore(10);
    }

    hitAstro(_, astro) {
        this.updateScore(-astro.getData("damage"));
        astro.destroy();
    }

    updateScore(amount) {
        this.score += amount;
        this.scoreText.setText(`Score: ${this.score} / 300`);
        this.checkGameEnd();
    }

    checkGameEnd() {
        if (this.score >= 300) this.endGame("Amazing! you cleaned the space", "#006400");
        else if (this.score <= -100) this.endGame("Oh no! you're ship was distroyed", "#FF0000");
    }

    endGame(message, color) {
        if (this.gameOverTriggered) return;

        this.gameOverTriggered = true;
        this.physics.pause();
        this.displayEndMessage(message, color);

        this.time.delayedCall(5000, () => {
            this.scene.restart();
            this.resetGame();
        });
    }

    displayEndMessage(message, color) {
        this.add.text(this.cam.width / 2 - 250, this.cam.height / 2 - 40, message, { fontSize: "32px", fill: color });
        this.add.text(this.cam.width / 2 - 100, this.cam.height / 2, `Final Score: ${this.score}`, { fontSize: "24px", fill: "#FFFFFF" });
    }

    resetGame() {
        this.gameOverTriggered = false;
        this.score = 0;
    }
}
