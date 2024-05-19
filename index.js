const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player;
let cursors;
let enemies;
let score = 0;
let scoreText;

function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('flame', 'assets/flame.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('background', 'assets/background.png');
}

function create() {
    this.add.image(0, 0, 'background').setOrigin(0);

    enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    enemies.children.iterate((enemy) => {
        enemy.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    player = this.physics.add.sprite(100, 450, 'player');
    player.setScale(0.5);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, enemies, hitEnemy, null, this);
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
    addMenu(this);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('run', true);
        player.flipX = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('run', true);
        player.flipX = false;
    } else {
        player.setVelocityX(0);
        player.anims.stop('run');
        player.setTexture('player', 0);
    }
    if (cursors.space.isDown) {
        shootFlame.call(this);
    }
}

function shootFlame() {
    const flame = this.physics.add.image(player.x, player.y - 30, 'flame');
    flame.setVelocityY(-300);
    this.physics.add.collider(flame, enemies, destroyEnemy, null, this);
}

function destroyEnemy(flame, enemy) {
    enemy.disableBody(true, true);
    flame.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
}

function hitEnemy(player, enemy) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
}

function addMenu(scene) {
    const menuText = scene.add.text(100, 100, 'Menu', { fontSize: '32px', fill: '#fff' });

    menuText.setInteractive();
    menuText.on('pointerdown', toggleMenuVisibility);

    const option1 = scene.add.text(100, 150, 'recommencer', { fontSize: '24px', fill: '#fff' }).setAlpha(0);
    const option2 = scene.add.text(100, 200, 'classement', { fontSize: '24px', fill: '#fff' }).setAlpha(0);
    const option3 = scene.add.text(100, 250, 'quitter', { fontSize: '24px', fill: '#fff' }).setAlpha(0);

    function toggleMenuVisibility() {
        if (option1.alpha === 0) {
            option1.setAlpha(1);
            option2.setAlpha(1);
            option3.setAlpha(1);
        } else {
            option1.setAlpha(0);
            option2.setAlpha(0);
            option3.setAlpha(0);
        }
    }
}

