var bootState = {

	preload: function(){
		//load the image
		game.load.image('progressBar', 'assets/progressBar.png')
	},


	create: function(){
		//Set some settings.
		game.stage.backgroundColor = "#3498db";
		game.physics.startSystem(Phaser.Physics.ARCADE);


		game.state.start('load');
	},


}
