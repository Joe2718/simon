var sounds = []; // array of sound objects 
var best = []; // buttons on the game 
var last = []; // buttons on the game .. last can also be current.
var speed = 400; // beginning delay .. lower this is, faster game will be
var blinkMe = 100;
var strict = false;
var power = false;
var blinkMe = 100;

$(function (){
	createSounds();
	mapBorders();
	for (var i = 1; i <=4; i++){// hit all the colors once upon load to make sure sounds are loaded.
		colorClick(i);
	} 

});
// *********************** Game loop ****************************************
function game(){
	oldSpeed = speed;
	if (last.length <=25){
		speed = (Math.floor(600-((last.length +1)*15)));
	} else {
		speed = 225;
	}
	blinkMe = Math.floor(speed/6);
	console.log('speed is ' + speed);  // speed will change with length of array
	let ranKey = Math.floor((Math.random()*4)+1);
	last.push(ranKey);
	let score = last.length -1; // need to display this number 
	// set score 
	let templist = last.slice(0,last.length); // should duplicate array, kept getting just the pointer being passed and downsized.
	playList(templist, oldSpeed);  
}
//  ******************* play list of keys *********************************
function playList(list, oldSpeed){
	var delays;
	if (list.length == 1){let speed = oldSpeed;}
	if (list.length > 1) {
		colorClick(list[0]);
		list.shift();
		delays = window.setTimeout(function (){
			playList(list,oldSpeed);
		},speed+blinkMe);	
	} else { 
		speed = oldSpeed;
		colorClick(list[0]);
		list.shift();
	}	
}

// ************************* creates the sound objects *********************
function createSounds(){
	let soundLocs = ["mp3/A0.mp3", "mp3/C3.mp3","mp3/E3.mp3","mp3/G3.mp3","mp3/G4.mp3"];
	for (index in soundLocs){
		var audio = new Audio(soundLocs[index]);
		sounds.push(audio);
	}
}
// *********************** This just plays sounds then calls color change ***********************
function colorClick(noteNum){  // going to keep this here just in case I want to mess with sound
     sounds[noteNum].currentTime = 0;
	sounds[noteNum].play();
	setColor(noteNum);
}
// ********************** switches color ***************************************************
function setColor(colorNum){
	let brightColors = ["lightgrey","red"    ,"blue"    , "yellow"    ,"lime"];      // did these here just to make it easy to 
	let dullColors   = ["grey","darkred","darkblue", "goldenrod" ,"darkgreen"]; // see which colors are used and easy to change.
	var delays;
	switch (colorNum) {
		case 1: $("#colorCircle").css('border-top-color',brightColors[colorNum]); 
				delays =  window.setTimeout(function (){
					$("#colorCircle").css('border-top-color',dullColors[colorNum]); 
				}, speed);
				break;
		case 2: $("#colorCircle").css('border-right-color',brightColors[colorNum]); 
				delays =  window.setTimeout(function (){
					$("#colorCircle").css('border-right-color',dullColors[colorNum]); 
				}, speed);
				break;
		case 3: $("#colorCircle").css('border-bottom-color',brightColors[colorNum]); 
				delays =  window.setTimeout(function (){
					$("#colorCircle").css('border-bottom-color',dullColors[colorNum]); 
				}, speed);
				break;
		case 4:$("#colorCircle").css('border-left-color',brightColors[colorNum]); 
				delays =  window.setTimeout(function (){
					$("#colorCircle").css('border-left-color',dullColors[colorNum]); 
				}, speed);
				break;
		case 0: $("#centerCircle").css('background',brightColors[colorNum]); 
				delays =  window.setTimeout(function (){
					$("#centerCircle").css('background',dullColors[colorNum]); 
				}, speed);
				break;
	}
}
function toggleStrict (){
	strict = !strict;
	if (strict){
		$('#strictIndicator').css('background','red');
	} else {
		$('#strictIndicator').css('background','black');
	}
}

// ******************************** maps borders to sound clicks *********************
function mapBorders(){
	$('#colorCircle').click(function(ele){
		// let outer=$(this).outerHeight();
		// let inner=$(this).innerHeight();
		// let borderWidth = (outer-inner)/2;  // <--- border width
		// with borderWidth, ele offsetX and Y, I should be able to figure out 
		// where the click was made on the border.  
		// I don't even think I need this with only showing border.
		// if I translated from where the offset's base is (probalby the upper right corner)
		// to the center (innerWidth / 2 ) maybe this could be a general purpose function
		// for determining if you click on a border.  
		let x = ele.offsetX;
		let y = ele.offsetY; 
		// console.log(ele);
		if (x <= 0){ // X is negative
			if (y <= 0){ // Y is negative
				if (x > y){
					// console.log('top');
					colorClick(1);
				} else {
					// console.log('left')	
					colorClick(4);				
				}
			} else { // y is positive
				if (Math.abs(x) > y){
					// console.log('left');
					colorClick(4);
				} else {
					// console.log('bottom')
					colorClick(3);
				}
			}
		} else { // X is positive
			if (y <= 0){ // Y is negative
				if (x > Math.abs(y)){
					// console.log('right');
					colorClick(2);					
				} else {
					// console.log('top')
					colorClick(1);
				}
			} else { // y is positive
				if (x > y){
					// console.log('right ');
					colorClick(2);
				} else {
					// console.log('bottom');
					colorClick(3);
				}
			}
		}
	});
}