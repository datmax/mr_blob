var playState = {

	create: function(){


		//player sprite.
        this.player = game.add.sprite(60, 40, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;

        this.player.animations.add('right', [1, 2], 8, true);
        this.player.animations.add('left', [3,4], 8, true);

		//player death particles.
		this.emitter = game.add.emitter(0, 0, 15);
		this.emitter.makeParticles('pixel');

		//set the y speed between -150 and 150.Will be choosen randomly.
		this.emitter.setYSpeed(-150, 150);

		//same for x speed.
		this.emitter.setXSpeed(-150, 150);
		//no gravity for them
		this.emitter.gravity = 0;

        //sounds.
       	this.jumpSound = game.add.audio('jump');
       	this.coinSound = game.add.audio('coin');
       	this.deadSound = game.add.audio('dead');

        //creating the walls.
        this.createWalls();

        //coin creation.
        this.coin = game.add.sprite(60, 140, 'coin');
        game.physics.arcade.enable(this.coin);
        this.coin.anchor.setTo(0.5, 0.5);

        //create enemies.
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        //create 10 enemies with the 'enemy' image in the group.
        //the enemies are "dead" by default, so they are invisible in the game.
        this.enemies.createMultiple(10, 'enemy');

        //call 'addEnemy' every 2.2 seconds.
				this.nextEnemy = 0;

        //cursor keys.
				game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN,
												 Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
		        this.cursor = game.input.keyboard.createCursorKeys();
				this.wasd = {
					up: game.input.keyboard.addKey(Phaser.Keyboard.W),
					left: game.input.keyboard.addKey(Phaser.Keyboard.A),
					right: game.input.keyboard.addKey(Phaser.Keyboard.D)
				};

		        //display score.
		        this.scoreLabel = game.add.text(30, 30, 'score: 0',
		        				  {font: '18px Arial', fill: '#ffffff'});
		        game.global.score = 0;
	},


//-------------------------------------------------------
//-------------------------------------------------------


	    update : function(){
			this.movePlayer();
			game.physics.arcade.collide(this.player, this.layer);
			game.physics.arcade.collide(this.enemies, this.layer);


			//create enemies.
			if(this.nextEnemy < game.time.now){
				//define our variables.
				var start = 4000, end = 1000, score = 100;

				//formula to decrease the enemy delay over time.
				var delay = Math.max(start - (start-end)*game.global.score/score ,end);
				//create the enemy and update the nextEnemy time.
				this.addEnemy();
				this.nextEnemy = game.time.now + delay;
			}


			//--why doesn't this work if i put in the movePlayer function?
			if((this.cursor.up.isDown ||this.wasd.up.isDown) && this.player.body.onFloor()) {
				// Move the player upward (jump)
				this.jumpSound.play();
				this.player.body.velocity.y = -320;
			}
			if(!this.player.inWorld){
				this.playerDie();
			}

			//collect coins.
			game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);

			//call the playerDie function when they overlap.
			game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

		},

			movePlayer:function() {
		// If the left arrow key is pressed
			if(this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft) {
				// Move the player to the left
				this.player.animations.play('left');
				this.player.body.velocity.x = -200;
			}
			// If the right arrow key is pressed
			else if(this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight) {
				// Move the player to the right
				this.player.animations.play('right');
				this.player.body.velocity.x = 200;
		}
			// If neither the right or left arrow key is pressed
			else{
				// Stop the player
				this.player.animations.stop()
				this.player.frame = 0;
				this.player.body.velocity.x = 0;
			}


			},
			createWalls: function(){
				// Create our wall group with Arcade physics
				this.map = game.add.tilemap('map');

				//add the tileset to the map.
				this.map.addTilesetImage('tileset');

				//create the layer.
				this.layer = this.map.createLayer('Livello tile 1');

				this.layer.resizeWorld();

				//set the blue for collision.
				this.map.setCollision(1);

			},

			playerDie: function(){
				//if the player is already died, do nothing.
				if(!this.player.alive){
					return;
				}

				//kill the player.
				this.player.kill();

				this.emitter.x = this.player.x;
				this.emitter.y = this.player.y;
				this.emitter.start(true, 600, null, 15);
				this.deadSound.play();
				game.time.events.add(1000, this.startMenu, this);
			},

			takeCoin: function(){
				//scale the player for a moment.
				game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to(
													{x: 1, y: 1}, 50).start();
				//scale the coin when you catch it.
				this.coin.scale.setTo(0, 0);
				game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start()

				this.coinSound.play();

				game.global.score += 5;
				this.scoreLabel.text = 'Score:  ' + game.global.score;
				this.updateCoinPos();
			},

			updateCoinPos: function(){
				//Store all the possible positions in an array.
				var coinPos = [
				{x: 140, y:  60},  {x: 360, y:  60},
				{x:  60, y: 140},  {x: 440, y: 140},
				{x: 130, y: 300},  {x: 370, y: 300}
				];

				/*remove the current pos from the array or the coin would appear again in the
				same spot.*/
				for(var i = 0; i < coinPos.length; i++){
					if(coinPos[i].x === this.coin.x){
						coinPos.splice(i, 1);
					}
				};

				//randomly select a new position.
				var newPos = coinPos[game.rnd.integerInRange(0, coinPos.length - 1)];

				//reset position.
				this.coin.reset(newPos.x, newPos.y);


			},

			addEnemy: function(){
				//get the first dead enemy of the group.
				var vector = [-1, 1];

				var enemy = this.enemies.getFirstDead();
				if(!enemy){
					return;
				}

				//initialize the enemy.
				enemy.anchor.setTo(0.5, 1);
				enemy.reset(game.world.centerX, 0);
				enemy.body.gravity.y = 500;
				enemy.body.velocity.x = 100 * vector[game.rnd.integerInRange(0, vector.length - 1)];
				enemy.body.bounce.x = 1;
				enemy.checkWorldBounds = true;
				enemy.outOfBoundsKill = true;
			},

			startMenu: function(){
				game.state.start('menu');
			},
}
