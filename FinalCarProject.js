//based on the example generated by the App...

let serial;
let latestData = "waiting for data";

let xCoord;
let prevXCoord;
let yCoord;
let prevYCoord;

let portName = '/dev/tty.usbmodem1421';//update this with the port you are using

let screen = 0;
let x;
let y;
let a;
let b;
let speed;
let score = 0;
let carSpeed;
let carWidth = 100;
let cars = []; 

let carX = -250;
let carY = 100;
let carY1 = 150;
let carY2 = 200;
let carY3 = 270;
let carY4 = 350;
let button;

let Space= 100;

let person = [];
let blue;
let orange;
let green;
let pink;
let yellow;
let purple;
let road, nightroad; 
let honkingSound, backgroundMusic, gaspNoise;
let light, light2; 

//let people = [];

function preload(){
	blue = loadImage('Blue.png');
	orange = loadImage('Orange.png');
	green = loadImage('Green.png');
	pink = loadImage('Pink.png');
	yellow = loadImage('Yellow.png');
	purple = loadImage('Purple.png');
  road = loadImage('road.png');
  nightroad = loadImage('nightroad.png');
  person = loadImage('person.png');
  dog = loadImage('dog.png');
  trafficLight2 = loadImage('lights2.png');
  honkingSound = loadSound('carnoise.mp3');
  backgroundMusic = loadSound('BackgroundMusic.mp3');
  gaspNoise = loadSound('Gasp.mp3');

}


function setup() {
 createCanvas(800, 800);
  backgroundMusic.loop();
	xCoord = width/2;
	yCoord = height - 40;

button = createButton('Click for night view');
button.position(50,50);
button.mouseClicked(changeColor);
button.style("font-size", "20");

  serial = new p5.SerialPort();

a = width/1.5;
b = height;

//for (p = 0; p < 100; p++) {
//  let start = random (10*width);
//  person[p] = new Pedestrian(start);

 //serial.list();
 serial.open(portName);

 serial.on('connected', serverConnected);

 serial.on('list', gotList);

 serial.on('data', gotData);

 serial.on('error', gotError);

 serial.on('open', gotOpen);

 serial.on('close', gotClose);

}

function changeColor() {
  background(0);
}

function serverConnected() {
 print("Connected to Server");
}

function gotList(thelist) {
 print("List of Serial Ports:");

 for (let i = 0; i < thelist.length; i++) {
  print(i + " " + thelist[i]);
 }
}

function gotOpen() {
 print("Serial Port is Open");
}

function gotClose(){
 print("Serial Port is Closed");
 latestData = "Serial Port is Closed";
}

function gotError(theerror) {
 print(theerror);
}

function gotData() {
 let currentString = serial.readLine();
  trim(currentString);//trim removes white spaces
 if (!currentString) return;
 console.log(currentString);
 latestData = currentString.split(',');
 console.log(latestData);
}

function draw() {


  // Display the contents of the current screen
  if (screen == 0) {
    startScreen();
  } else if (screen == 1) {
    gameStart();


    // if the screen variable was changed to 2, show the game over screen   
  } else if (screen == 2) {
    gameEnd();
  }

}


function mousePressed() {
  if (screen == 0) {
    screen = 1
  } else if (screen == 2) {
    screen = 0
  }
}

function startScreen() {
  reset();
  background(21,194,163);
  fill(255);
  textAlign(CENTER);
  textSize(40);
  text('CROSS THE ROAD SAFELY!', width / 2, height / 2);
  textSize(20);
  text('Click screen to start', width / 2, height / 2 + 50);
}

function gameStart() {

    //image(person, 100, 100, 50, 50);
background(road);

image(dog, b-50, a+60, 70,60);
image(trafficLight2, a, 50, 70,110);
textSize(15);
text('Reach this traffic light to speed up the cars', width/2, 50);

image(person, b, a, 100, 180);
a = a + random(-1,1);
b = b - 1;

if (b < 0) {
  b = height;
}
  imageMode(CORNER);
  image(blue, prevXCoord, prevYCoord, 115, 75)

 //   for (let p = 0; p < person.length; p++) {
// person[p].show();
 // person[p].move();


prevXCoord = xCoord;
xCoord = constrain(map(latestData[0],0,1023,0,width),0,width);

prevYCoord = yCoord;
yCoord = constrain(map(latestData[1],0,1023,0,height),0,height);

//other cars
  image(green, carX, carY, 115, 75);
  image(orange, carX+Space, carY1 + Space, 115, 75);
  image(pink, carX+ Space*2, carY2 + Space, 115, 75);
  image(yellow, carX+ Space*1.5, carY3 + Space, 115, 75);
  image(purple, carX+Space*3, carY4 + Space, 115, 75);
  
  carX += carSpeed;

  if (carX > width) {
    randomWidth();
    carX = -250;
  }
  //if you reach where the traffic light is, the cars will speed up
  if (prevYCoord < 50) {
    prevYCoord = height;
    carSpeed += 1;
  }

  //green car collision
  if (prevYCoord > carY && prevYCoord < carY + 20 && prevXCoord > carX && prevXCoord < carX + carWidth) {
    screen = 2
    honkingSound.play();
  }

  //orange car collision
  if (prevYCoord > carY1 && prevYCoord < carY1 + 20 && prevXCoord > carX && prevXCoord < carX+Space+carWidth) {
    screen = 2
     honkingSound.play();
  }

    //pink car collision
  if (prevYCoord > carY2 && prevYCoord < carY2 + 20 && prevXCoord > carX && prevXCoord < carX+ Space*2+carWidth) {
    screen = 2
     honkingSound.play();
  }
      //yellow car collision
  if (prevYCoord > carY3 && prevYCoord < carY3 + 20 && prevXCoord > carX && prevXCoord < carX+ Space*1.5+carWidth) {
    screen = 2
     honkingSound.play();
  }
    //purple car collision
  if (prevYCoord > carY4 && prevYCoord < carY4  + Space + 20 && prevXCoord > carX && prevXCoord < carX+Space*3+carWidth) {
    screen = 2
     honkingSound.play();
  }
  //person and dog collision
 if (prevYCoord > a && prevYCoord < a + 120 && prevXCoord > b && prevXCoord < b+180) {
    screen = 2
    gaspNoise.play();
  }
}

class Pedestrian {
  constructor(startX) {
    //this.s = 100; 
    this.x = startX;
    this.speed = -2.0;
  }

  move(){
    this.x += this.speed;
  }

  show(){
    image(person, this.x, 0, 100, 100);
  }
}

function gameEnd() {
  background(255, 0, 0);
  textAlign(CENTER);
  textSize(40);
  text('Oh no! Be safe', width / 2, height / 2)
  textSize(20);
  text('Click to play again', width / 2, height / 2 + 50);

}

function randomWidth() {
  carWidth = 115;
}

function randomSpace() {
  Space = random(0, 100)
}

function reset() {
  speed = 1;
  score = 0;
  carSpeed = 5;
  carY = 100;
  carX = -100;
  carY1 = 150;
  prevYCoord = height - 20;
  prevXCoord = width / 2;
}

function keyPressed(){
  if(key == 'l'){
    writeSerial(key);
  }
}

function writeSerial(writeOut){
	serial.write(writeOut);
}

