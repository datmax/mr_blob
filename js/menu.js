var menuState = {
	create: function(){



		//Add a background image.
		game.add.image(0, 0, 'background');

		//add the mute button.
		this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
		//if the mouse is on the button, it becomes a hand cursor.
		this.muteButton.input.useHandCursor = true;
		//if the game is already muted
		if(game.sound.mute){
			this.muteButton.frame = 1;
		}


		//display the name of the game.
		var nameLabel = game.add.text(game.world.centerX, -50, 'Mr.Blob',
							          {font: '70px Geo', fill: '#ffffff' });
		nameLabel.anchor.setTo(0.5, 0.5);

		//create a tween on the label.
		var tween = game.add.tween(nameLabel).to({y: 80}, 1000).easing(
				    Phaser.Easing.Bounce.Out).start();

		//show the score at the center of the screen.
		var text = 'score: ' + game.global.score + '\nbest score: ' +
							   localStorage.getItem('bestScore');

		var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, text,
									   {font: '25px Arial', fill: '#ffffff',
										align: 'center'});
		scoreLabel.anchor.setTo(0.5, 0.5);


		//explain how to start the game.

		var text = 'Press the arrow key to start.';

		var startLabel = game.add.text(game.world.centerX, game.world.height - 80,text,
									   {font: '25px Arial', fill: '#ffffff'});
		startLabel.anchor.setTo(0.5, 0.5);
		var tween = game.add.tween(startLabel).to({angle: -1}, 500).to(
					{angle: 1}, 500).to({angle: 0}, 500).loop().start();


		//create an upArrowKey variable.
		var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

		//when the key is pressed, it will start the start function one time.
		upKey.onDown.addOnce(this.start, this);
		wKey.onDown.addOnce(this.start, this);


		//add a best score to the game.
		//if bestscore is not defined that means that it's
		//the first time the game is played
		if(!localStorage.getItem('bestScore')){
			localStorage.setItem('bestscore', 0);
		}

		if(game.global.score > localStorage.getItem('bestScore')){
			localStorage.setItem('bestScore', game.global.score);
		}
	},

	start: function(){
		game.state.start('play');
	},

	toggleSound: function(){
		game.sound.mute = !game.sound.mute;

		//chane the frame of the button.
		this.muteButton.frame = game.sound.mute ? 1 : 0;
	}
}
