var game = new Phaser.Game(32, 32, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});

var paddle1;
var paddle2;
var bounceX;
var bounceY;
var ball_launched;
var ball_velocity;

var score1_text;
var score2_text;

var score1;
var score2;

function preload() {
  game.load.image('paddle', 'assets/paddle.png');
  game.load.image('ball', 'assets/ball.png');
}

function create() {
  score1 = 0;
  score2 = 0;
  bounceX = 1;
  bounceY = 1;
  ball_launched = false;
  ball_velocity = 10;
  paddle1 = create_paddle(0, game.world.centerY);
  paddle2 = create_paddle(game.world.width - 1, game.world.centerY);
  ball = create_ball(game.world.centerX, game.world.centerY);
  game.input.onDown.add(launch_ball, this);
  cursors = game.input.keyboard.createCursorKeys();


  score1_text = game.add.text(8, 0, '0', {
    font: '8px Ariel',
    fill: '#ffffff',
    align: 'center'
  });
  score2_text = game.add.text(game.world.width - 12, 0, '0', {
    font: '8px Ariel',
    fill: '#ffffff',
    align: 'center'
  });
}

function update() {
  score1_text.text = score1;
  score2_text.text = score2;
  // control_paddle(paddle1, game.input.y);

  if (cursors.up.isDown) {
    control_paddle(paddle1, paddle1.y - 1)
  } else if (cursors.down.isDown) {
    control_paddle(paddle1, paddle1.y + 1)
  }

  if (ball.body.blocked.left) {
    console.log('Player 2 Scores!');
    score2 += 1;
  } else if (ball.body.blocked.right) {
    console.log('Player 1 Scores!');
    score1 += 1;
  }

  paddle2.body.velocity.setTo(ball.body.velocity.y);
  paddle2.body.velocity.x = 0;
  paddle2.body.maxVelocity.y = 4;
  game.physics.arcade.collide(paddle1, ball);
  game.physics.arcade.collide(paddle2, ball);
}

function create_paddle(x, y) {
  var paddle = game.add.sprite(x, y, 'paddle');
  paddle.anchor.setTo(0.5, 0.5);
  game.physics.arcade.enable(paddle);
  paddle.body.collideWorldBounds = true;
  paddle.body.immovable = true;
  return paddle;
}

function create_ball(x, y) {
  var ball = game.add.sprite(x, y, 'ball');
  ball.anchor.setTo(0.5, 0.5);
  game.physics.arcade.enable(ball);
  ball.body.collideWorldBounds = true;
  ball.body.bounce.setTo(bounceX, bounceY);
  return ball;
}

function control_paddle(paddle, y) {
  paddle.y = y;
  if (paddle.y < paddle.height / 2) {
    paddle.y = paddle.height / 2;
  } else if (paddle.y > game.world.height - paddle.height / 2) {
    paddle.y = game.world.height - paddle.height / 2;
  }
}

function launch_ball() {
  if (ball_launched) {
    ball.x = game.world.centerX;
    ball.y = game.world.centerY;
    ball.body.velocity.setTo(0, 0);
    ball_launched = false;
  } else {
    ball.body.velocity.x = -ball_velocity;
    ball.body.velocity.y = ball_velocity;
    ball_launched = true;
  }
}
