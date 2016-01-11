var lines;
var nouns = [];
var field;
var counts, startMillis;
var timeStart = 0;
var button;
var lexicon, markov;
var droppingPitch;
var time, timePass = 0;
var starChild, starChildSpr;
var resetTime = 30000;
// speech variables
var myVoice = new p5.Speech();
var listbutton;
var myTime = 0;

function preload() {
  lines = loadStrings("texts/space.txt");
  myFont = loadFont("fonts/OstrichSans-Black.otf");
  starChildSpr = loadImage("images/starChild.png");
}

function setup() {
  
  createCanvas(screen.width, screen.height);
  instructions();
  //console.log(myVoice.listVoices());
    for (var k in counts) {
    if (counts.hasOwnProperty(k)) {
      var tags = RiTa.getPosTags(k);
      if (tags[0] == 'nn') {
        nouns.push(k);
      }
    }
  }
}

function draw() {
  //noLoop();
  console.log(timeStart);
  textAlign(CENTER);
  noStroke();
  // set pitch

  var currentMillis = millis();
  if (currentMillis - startMillis < resetTime) {
    myTime += 1;
  }
  droppingPitch = getBaseLog(myTime, .5);
  console.log(droppingPitch * 2 + 15);
  if (currentMillis - startMillis >= resetTime) {
    //fill(0);
    //rect(0, 0, screen.width, screen.height);
    //starChildFn();
    scale(0.8);
    tint(255, 200); 
    image(starChildSpr, random(-400,0), random(-50,0));
    if(currentMillis - startMillis >= resetTime + 300){
      instructions();
      timeStart = 0;
      myTime = 0;
      myVoice.cancel();
    }
  }
  drawSprites();
}

function totalValues(obj) {
  var total = 0;
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      total += obj[k];
    }
  }
  return total;
}

function sayWord() {
  background(250, 3, 11);
  fill(254, 250, 67);
  if (timeStart == 0) {
    startMillis = millis();
    console.log(startMillis);
  }
  textAlign(CENTER);
  textSize(24);
  lines = markov.generateSentences(2);
  text(lines.join(' '), width / 2 - 300, height / 2 - 100, 600, 400);
  myVoice.setPitch(droppingPitch);
  myVoice.setVoice(Math.floor(random(myVoice.voices.length)));
  myVoice.setRate(droppingPitch * 2 + 20);
  
  myVoice.speak(lines);
  //draw adjectives in background
  
  for (var k in counts) {
    if (counts.hasOwnProperty(k)) {
      if (counts[k] / total > 0.001) {
        fill(161, 9, 32, 80);
        textSize((counts[k] / total) * 2000);
        text(lexicon.randomWord('jj'), random(width), random(height));
      }
    }
  }
}

function mousePressed() {
  sayWord();
  timeStart += 1;
  //myVoice.cancel();
}

//returns log of y with the base of x
function getBaseLog(x, y) {
  var decay = Math.log(x) / Math.log(y);
  if (decay > -12) {
    return Math.log(x) / Math.log(y);
  } else {
    return null;
  }
}

function starChildFn() {
  starChild = createSprite(screen.width/2 - 400, screen.height/2 - 100, screen.width, screen.height);
    //starChild.scale = 0.8;
  starChild.addImage(starChildSpr);
  starChild.life = 20;
}

function instructions (){
  background(250, 3, 11);
  textFont(myFont);
  textSize(35);
  var instructions = "Click for HAL Poetry Reading";
  lexicon = new RiLexicon();
  markov = new RiMarkov(4);
  markov.loadText(lines.join(' '));
  // goes through parts of speech in the sentence
  var params = {
    ignoreStopWords: true,
    ignoreCase: true,
    ignorePunctuation: true
  };
  counts = RiTa.concordance(lines.join(" "), params);
  // gets the return value of the total V
  total = totalValues(counts);
 
  fill(254, 250, 67);

  //image(starChildSpr, 0, 0);
  textAlign(LEFT);
  text(instructions, screen.width / 3, screen.height / 2 - 100);
  console.log(instructions.width);
}
