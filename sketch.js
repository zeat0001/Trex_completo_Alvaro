var trex ,trex_running, trex_collided;
var groundImage;
var invisibleGround;
var cloud, cloudImage;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var obstaclesGroup, cloudsGroup;
var restart, restartImg, gameOver, gameOverImg;
var jumpSound, dieSound, checkSound;
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");

  trex_collided = loadImage("trex_collided.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkSound = loadSound("checkpoint.mp3");
}

function setup(){
  createCanvas(600,200)
  text("Puntuacion" + score, 500, 50);
  score = score + frameCount / 60;
  
  //crear sprite de Trex
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;


  //crear sprite del suelo
  ground = createSprite(200,180,400,20);
  ground.addImage("ground", groundImage);

  //crear sprite del suelo invisible
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  //crear grupos de obstaculos y nubes
  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  restart = createSprite(300,140);
  restart.addImage(restartImg);

  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);

  restart.scale = 0.5;
  gameOver.scale = 0.5;

  var rango = Math.round(random(1,20));
  console.log(rango);

  trex.setCollider("circle", 0, 0, 40);
  trex.debug = false; //ver el colisionador
}

function draw(){
  background("white")
  text("Puntuacion: " + score, 500, 50);
  

  //Estados de juego
  if(gameState === PLAY){
  //mover el suelo
    ground.velocityX = -(4 + 3 + score/100);

    //generar puntuacion
    score = score + Math.round(getFrameRate() / 60);
    if(score > 0 && score % 100 === 0){
      checkSound.play();
    }

    //reiniciar el suelo
    if(ground.x < 0){
      ground.x = ground.width/2;
    }

 //salto del trex
  if(keyDown("space") && trex.y >= 160){
    trex.velocityY = -10;
    jumpSound.play();
  }
  //caida gravedad del trex
  trex.velocityY = trex.velocityY + 0.5;

  //llamado de la funcion de nubes
  spawnClouds();

  //llamado de la funcion de obstaculos
  spawnObstacles();

  if(obstaclesGroup.isTouching(trex)){
    gameState = END;
    dieSound.play();
  }

  gameOver.visible = false;
  restart.visible = false;
}
else if(gameState === END){
    //detener el suelo
    ground.velocityX = 0;
    trex.velocityY = 0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    gameOver.visible = true;
    restart.visible = true;

    //cambiar la animacion del Trex
    trex.changeAnimation("collided", trex_collided);

    //establecer lifetime de los objetos para que no sean destruidos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if(mousePressedOver(restart)){
      reset();
    }
  }


  //evitar que el trex caiga
  trex.collide(invisibleGround);

  drawSprites();
}

function spawnClouds(){
  if(frameCount % 60 == 0){
    cloud = createSprite(600, 100, 40, 10);
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(10,60))
    cloud.scale = 0.4;
    cloud.velocityX = -(6 + score/100);

    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //asignar ciclo de vida
    cloud.lifetime = 210;

    //agregar cada obstaculo al grupo
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles(){
  if(frameCount % 60 === 0){
    obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -(6 + score/100)

    //generar obstaculos al azar
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
      break;
      case 2: obstacle.addImage(obstacle2);
      break;
      case 3: obstacle.addImage(obstacle3);
      break;
      case 4: obstacle.addImage(obstacle4);
      break;
      case 5: obstacle.addImage(obstacle5);
      break;
      case 6: obstacle.addImage(obstacle6);
      break;
      default: break;
    }
    //asignar escala y tiempo de vida
    obstacle.scale = 0.5
    obstacle.lifetime = 210;

    //agregar cada obstaculo al grupo
    obstaclesGroup.add(obstacle);

  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);
  score = 0
}
