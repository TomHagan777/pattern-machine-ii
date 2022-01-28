let pattern1 = [];            //main pattern array
let grid = 200;               //spacing between
let swatchSize = 400;         //initial swatch size
let backing = 0;              //initial background behind the pattern
let densityButton1 = false;   //boolean switch to increases and decrease 'grid' value
let densityR = 0;           

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(2);               //throttle framerate to stagger pattern generation
  
  rectMode(CENTER);
  
  swatchSlider1 = createSlider(2,12,4);        //slider for swatch increase
  swatchSlider1.position(200,height-150);
  
  densityButton1 = createButton('+ / –');      //button creation for 'density'
  densityButton1.position(200,height-43);
  densityButton1.mousePressed(gridChange);
  densityButton1.style('padding-right:50px; padding-left:50px');
  
  colourR1 = createSlider(0,255,100);          //sliders for colour
  colourR1.position(20,height-150);
  colourG1 = createSlider(0,255,100);
  colourG1.position(20,height-125);
  colourB1 = createSlider(0,255,255);
  colourB1.position(20,height-100);
  
  colourL1 = createSlider(0,255,122);          //slider for second colour for lerping
  colourL1.position(20,height-40);
  
  exportButton = createButton('Save');         //button creation for exporting swatch
  exportButton.position(width-130,height-90);
  exportButton.mousePressed(swatchExport);
  exportButton.style('padding-left:50px; padding-top:50px'); 
  
  menu1 = createP('Colour');                   //menu type
  menu1.position(20,height-190);
  menu1.style('font-family:helvetica; sans-serif');
  menu2 = createP('Tone');
  menu2.position(20,height-83);
  menu2.style('font-family:helvetica; sans-serif');
  menu3 = createP('Swatch Size');
  menu3.position(200,height-190);
  menu3.style('font-family:helvetica; sans-serif');
  menu4 = createP('Density');
  menu4.position(200,height-83);
  menu4.style('font-family:helvetica; sans-serif');
}

function draw() {
  background(220);
  
  saveCanvas = createGraphics(swatchSize+backing, swatchSize+backing); //variable for swatch export
  
  let colourSlider1 = color(colourR1.value(),colourG1.value(),colourB1.value(),50)
  let lighten = color(colourL1.value());
  let lerpA = lerpColor(colourSlider1, lighten, 0.33); //to keep palette choice analagous
  let lerpB = lerpColor(colourSlider1, lighten, 0.66);
  
  stroke(lighten) //non essential decoration for focus A
  fill(0,0,0,0)
  rect(width/2,height/2,swatchSize+backing+50,swatchSize+backing+50)
  
  noStroke();
  
  fill(220) //non essential decoration for focus B
  rect(width/2,height/2,width,swatchSize/2);
  rect(width/2,height/2,swatchSize/2,height);
  
  fill(lerpA);
  rect(width/2,height/2,swatchSize+backing,swatchSize+backing);  //effectively background for swatch
  
  let centreReducer = swatchSize/2+densityR //enables me to center vertex shape for swatch resizing

  for (let x2 = 0; x2 < swatchSize; x2 = x2 + grid) {   //iterates points across
    for (let y2 = 0; y2 < swatchSize; y2 = y2 + grid) { //iterates points down
      let x = width/2 - centreReducer + x2;             //left/top most sides
      let y = height/2 - centreReducer + y2;             
      let fullx = width/2 + 200 - centreReducer + x2;   //right/bottom most sides
      let fully = height/2 + 200 - centreReducer + y2;       

      fill(colourSlider1);
      pattern1[0] = new Pattern(x, y, fullx, fully); //pushed variables into object class
      pattern1[0].generate();                        //runs random generation
      pattern1[0].display();                         //runs shape
      
      fill(lerpB);
      pattern1[1] = new Pattern(x, y, fullx, fully); //new pattern for added complexity
      pattern1[1].generate();
      pattern1[1].display();
      }
    }

  swatchSize = swatchSlider1.value()*100;  //swatch rescaling in intervals of one hundred
  
  if (densityButton1){
    grid = 200;
    backing = 0;
    densityR = 0;
    if (swatchSlider1.value() == 3 || swatchSlider1.value() == 5 || swatchSlider1.value() == 7 || swatchSlider1.value() == 9 || swatchSlider1.value() == 11){
      swatchSize = swatchSize + 100 //takes odd values on slider and rounds them up to even
    }
  } else {
    grid = 100;
    backing = 100;
    densityR = 50;            //recentres swatch again
  }
}

function gridChange(){        //switch for 'density' of the swatch
  if (densityButton1){
        densityButton1 = false;
    } else {
        densityButton1 = true;
  }
}

function swatchExport() {     //function to export swatch for tiling
  if (exportButton) {
    let w = width/2 - swatchSize/2 - densityR
    let h = height/2 - swatchSize/2 - densityR
    let c = get(w, h, swatchSize + backing, swatchSize + backing);
    saveCanvas.image(c, 0, 0);
    save(saveCanvas, "Pattern Swatch "+frameCount+".png");
  }
}

class Pattern {  //object rules
  constructor(x, y, fullx, fully) {
    this.x = x;
    this.y = y;
    this.fullx = fullx;
    this.fully = fully;
    this.r1 = int(random(0, 10));
    this.r2 = int(random(0, 10));
    this.r3 = int(random(0, 10));
    this.r4 = int(random(0, 10));
  }

  generate() {   //generates movement for points 2,4,6, and 8
    if (this.r1 > 5) {
      this.point2 = 100;
    } else {
      this.point2 = 0;
    }

    if (this.r2 > 5) {
      this.point4 = 100;
    } else {
      this.point4 = 0;
    }

    if (this.r3 > 5) {
      this.point6 = 100;
    } else {
      this.point6 = 0;
    }

    if (this.r4 > 5) {
      this.point8 = 100;
    } else {
      this.point8 = 0;
    }
  }

  display() {  //draws shape
    beginShape();
      vertex(this.x, this.y);                               //point 1
      vertex(this.fullx - 100, this.y + this.point2)        //point 2 (move)
      vertex(this.fullx, this.y);                           //point 3
      vertex(this.fullx - this.point4, this.fully - 100);   //point 4 (move)
      vertex(this.fullx, this.fully);                       //point 5
      vertex(this.fullx - 100, this.fully - this.point6);   //point 6 (move)
      vertex(this.x, this.fully);                           //point 7
      vertex(this.x + this.point8, this.fully - 100);       //point 8 (move)
      vertex(this.x, this.y);                               //point 9 (return)
    endShape();
  }
}