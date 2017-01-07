var sounds = []; // array of sound objects 
// var best = []; // buttons on the game 
var current = []; // current key list
var speed = 400; // beginning delay .. lower this is, faster game will be
var blinkMe = 100;
var strict = false;
var power = false;
var blinkMe = 100;
var progress = 0; // step in user playback
var inGame = false;
var isComputer = true;


$(function (){
	addKeys();    // adds keys
	createSounds();  // creates sounds
	mapBorders();  // makes things clickable

});
// ******************** New Round ******************************
function newRound(){
	if (power){
		inGame=true;
		current.length = 0;
		game();
	}
}

// *********************** Game loop ****************************************
function game(){
	isComputer=true;
	progress=0;
	oldSpeed = speed;
	if (current.length < 25){
		speed = (Math.floor(600-((current.length +1)*15)));
	} else {
		speed = 225;
	}
	blinkMe = Math.floor(speed/6);
	console.log('speed is ' + speed);  // speed will change with length of array
	let ranKey = Math.floor((Math.random()*4)+1);
	current.push(ranKey);
	let score = current.length; // need to display this number 
	// set score 
	$('#scoreDiv').empty().text(score);
	let templist = current.slice(0,current.length); // should duplicate array, kept getting just the pointer being passed and downsized.
	playList(templist, oldSpeed);  
}
//  ******************* play list of keys *********************************
function playList(list, oldSpeed){
	var delays;
	if (list.length == 1){let speed = oldSpeed;}
	if (list.length > 1) {
		colorSelect(list[0]);
		list.shift();
		delays = window.setTimeout(function (){
			playList(list,oldSpeed);
		},speed+blinkMe);	
	} else { 
		speed = oldSpeed;
		colorSelect(list[0]);
		list.shift();
		isComputer=false;
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
function colorSelect(noteNum){  // going to keep this here just in case I want to mess with sound
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

// **********************************power on ***********************************
function powerOn(){
	power = !power;
	if (power){
		$('#scoreDiv').css('color','red')
		.empty()
		.text('0');
		for (var i = 1; i <=4; i++){ // hit all the colors once upon ON. 
			colorSelect(i);         // for some reason I think some games used to do that.  
		} 

	} else {
		$('#scoreDiv').css('color','black')
		.empty()
		.text('88');
	}
}

// ********************************** toggles strict ******************************
function toggleStrict (){
	if(power){
		strict = !strict;
		if (strict){
			$('#strictIndicator').css('background','red');
		} else {
			$('#strictIndicator').css('background','black');
		}
	}
}
// ******************************* on click routine *********************************
function colorClick(num){
	// ok, now only the player will be here and can process and check stuff
	if (power && !isComputer){
		if (inGame){
			if (num == current[progress]){
				progress++;				
				console.log("Match!  "+ (progress) + "   "+current.length);
				colorSelect(num);
				if(progress == current.length){
					delays =  window.setTimeout(game, 2000);
				}
			} else {
				colorSelect(0);
				if (strict){
					console.log('you lose.');
					inGame=false;
				} else {
					console.log('Try again.');
					progress=0;
					isComputer=true;
					let templist = current.slice(0,current.length); // should duplicate array, kept getting just the pointer being passed and downsized.
					delays =  window.setTimeout(function (){  
						playList(templist, 500); 
					}, 2000);
					
				}
			}
		} else {
			colorSelect(num); // will play the sound when not in a game
		}		
	}
}
// ******************************** maps borders to mouse clicks *********************
function mapBorders(){
	$('#colorCircle').click(function(ele){
		// let outer=$(this).outerHeight();
		// let inner=$(this).innerHeight();
		// let borderWidth = (outer-inner)/2;  // <--- border width
		// with borderWidth, ele offsetX and Y, I should be able to figure out 
		// where the click was made on the border.  
		// I don't even think I need this with only showing border.
		// if I translated from where the offset's base is (probalby the upper right corner)
		// to the center (innerWidth / 2 ) I should expand this into a general purpose function
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

// ***************************** keyboard *************************************
function addKeys(){
	document.addEventListener("keydown", function(k){
	// console.log(k.keyCode);	
	switch(k.keyCode){
		case 38:
		case 87:
		case 104:
			console.log("8");
			colorClick(1);
			break;
		case 68:
		case 39:
		case 102:
			console.log("6");
			colorClick(2);
			break;
		case 83:
		case 40:
		case 98:
			console.log("2");
			colorClick(3);
			break;
		case 65:
		case 37:
		case 100:
			console.log("4");
			colorClick(4);
			break;

		// shows keys not tagged yet	
		default: console.log(k.keyCode + " keycode has not been mapped.");
		}
	}, false);
}