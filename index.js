const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false // Changez à true pour voir les collisions
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
    this.load.image('background', 'assets/background.png'); // Charger l'image de fond
}

function create() {
    // Ajouter l'arrière-plan
    this.add.image(0, 0, 'background').setOrigin(0);

    // Générer les ennemis
    enemies = this.physics.add.group({
        key: 'enemy',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    enemies.children.iterate((enemy) => {
        enemy.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Ajouter le joueur comme sprite animé
    player = this.physics.add.sprite(100, 450, 'player');
    player.setScale(0.5); // Redimensionner le joueur
    player.setCollideWorldBounds(true);

    // Définir les animations du joueur
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    // Gérer les entrées clavier
    cursors = this.input.keyboard.createCursorKeys();

    // Gérer les collisions
    this.physics.add.collider(player, enemies, hitEnemy, null, this);

    // Afficher le score
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
}



function update() {
    // Déplacer le joueur
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('run', true);
        player.flipX = true; // Pour faire face à gauche
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('run', true);
        player.flipX = false; // Pour faire face à droite
    } else {
        player.setVelocityX(0);
        player.anims.stop('run');
        player.setTexture('player', 0); // Afficher la frame par défaut
    }

    // Tirer des flammes
    if (cursors.space.isDown) {
        shootFlame();
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
