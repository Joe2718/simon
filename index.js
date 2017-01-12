var sounds = []; // array of sound objects 
// var best = []; // buttons on the game 
var current = []; // current key list
var speed = 400; // beginning delay .. lower this is, faster game will be
var strict = false;
var power = false;
var blinkMe = 100;
var progress = 0; // step in user playback
var inGame = false;
var isComputer = true;
var soundList = []; // need to use this for the NUMBER and sounds for the sound OBJ.  
var masterSoundList = [];  // built from JSON file in soundfont directory
var brightColors = ["lightgrey","red"    ,"blue"    , "yellow"    ,"lime"];      // did these here just to make it easy to 
var dullColors   = ["grey","darkred","darkblue", "goldenrod" ,"darkgreen"]; // see which colors are used and easy to change.
var $toneLoc;  // standard JS select of tonekey Divs, masterSoundList[0]=$toneLoc[0]    
				// see options panel to understand.
var colorSelected=0;// number of color selected fail-0, red-1 blue-2 yellow-3 green-4   
var previous=0; // previous selected.  I should have done this with a class or two, too many globals going on.  
			// although I never planned on it going this far

// ********************* Main onload function  *******************************
$(function (){
	addKeys();    // adds keys
	soundListCreator();  // creates master sound list and assigns default sounds.
	mapBorders();  // makes things clickable
	addTabs();

});
// ************************** New Round ***********************************
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
	// blinkMe = Math.floor(speed/6); trying the static blink for a bit
	blinkMe = 150;
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
	$('#title').css('color','black');
	var delays;
	if (list.length == 1){let speed = oldSpeed;}
	if (list.length > 1) {
		colorSelect(list[0]);
		list.shift();
		delays = window.setTimeout(function (){
			playList(list,oldSpeed);
		},speed+blinkMe);	
	} else { 
		delays = window.setTimeout(function (){
			// want to flash the border of the middle green to indicate "user turn"
			$('#title').css('color','silver');
			isComputer=false;
		},speed+blinkMe);	
	
		speed = oldSpeed;
		colorSelect(list[0]);
		list.shift();
	}	
}

// ************************* creates the sound array *********************
// sound0 = fail, sound1 = top, sound2 = right, sound3 = bottom, sound4 = left
function createSounds(arr){
	sounds.length=0; // clears old sounds 
	$toneLoc =  document.getElementsByClassName('tonekeys'); // can this really be this easy?
	arr.forEach(function (soundNum,index){
		sounds.push(masterSoundList[soundNum]);  // have to make masterList first
		// have to figure out how to get the specific node number in the class 'tonekeys' and set it's background 
		// to the dullColors[]
		$toneLoc[soundNum].style.backgroundColor = dullColors[index];
	})

}
// ******* going to use some of the mp3's from https://github.com/mudcube/MIDI.js/ *********

function soundListCreator(callback){
	// Acoustic Piano List Load.
	let masterCount =0;
	$.ajax({
		 dataType: "json",
		 url: "../../../lib/js/soundfont/list.json",
		 success: function (success){
		 	soundList = success.sounds;
		 	//console.log(Object.keys(soundList));
		 	// console.log(success);
		 	for (tempkey in soundList){
				// console.log(soundList[tempkey].name);
		 		// Header file for accordian 
		 		$('#soundURL').append(
		 			$('<H3/>').text(soundList[tempkey].name)
		 			.css('clear','left')
		 			.attr({
		 				'class': "acc-header"
		 			}));
// ********************************  this is area I need to look at for accordian ********************************
		 		$('#soundURL').append(
		 			$('<div/>').attr({
		 				'class':'acc-container'
		 				}) // .css('clear','left')
		 			);
		 		// need to stick file loop here
		 		var $accContainer = $('.acc-container:last');  // doing this before loop so it doesn't search everytime.
		 		for (index in soundList[tempkey].files){
		 			let filePath = "../../../"+soundList[tempkey].path+soundList[tempkey].files[index];
		 			// console.log(soundList[tempkey].files[index]);
		 			//console.log(filePath + "  is the file being pushed as a path");
		 			var audio = new Audio(filePath);
		 			// console.log(audio);
		 			masterSoundList.push(audio);
		 			masterCount++;
		 			let toneName = soundList[tempkey].files[index];
		 			$accContainer.append(						
			 			$('<div/>').attr({
			 				'class':'tonekeys',
			 				'tone':masterCount-1
			 				// 'onClick': optKey(tAudio[index])
			 			})
			 			//.addEventListener("click", optKey(tAudio[index],true))
			 			.click(function (){
			 				var toneNum = $(this).attr('tone');
			 				optKey(masterSoundList[toneNum]);
			  			})
			 			.text(toneName.substring(0,toneName.length-4))
		 			);
		 		}
		 	}
		 soundList= [0,34, 57, 78, 79];
		 createSounds(soundList);
		}	//  end of Success 
	}) // end of file import, get Json was simpler than this ajax type.
	$('#soundColor span').click(colorEdit);
	if(typeof callback === 'function'){ callback;}
}

function optKey(tone){
	tone.currentTime = 0;
	tone.play();
}


// *********************** This just plays sounds then calls color change ***********************
function colorSelect(noteNum){  // going to keep this here just in case I want to mess with sound
	sounds[noteNum].currentTime = 0;
	sounds[noteNum].play();
	setColor(noteNum);
}
// ********************** switches color ***************************************************
function setColor(colorNum){
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
		// for (var i = 1; i <=4; i++){ // hit all the colors once upon ON. 
		// 	colorSelect(i);         // for some reason I think some games used to do that.  
		// } 

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
// ******************************* main  on click routine *********************************
function colorClick(num){
	// ok, now only the player will be here and can process and check stuff
	if (power && !isComputer){
		if (inGame){
			if (num == current[progress]){
				progress++;				
				console.log("Match!  "+ (progress) + "   "+current.length);
				colorSelect(num);
				if(progress == current.length){
					isComputer=true;
					delays =  window.setTimeout(game, 2000);
				}
			} else {
				colorSelect(0);
				if (strict){
					// console.log('you lose.');
					$('#title').css('color','black');
					inGame=false;
				} else {
					// console.log('Try again.');
					progress=0;
					isComputer=true;
					let templist = current.slice(0,current.length); 
					// should duplicate array, kept getting just the pointer being passed and downsized.
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
			//console.log("8");
			colorClick(1);
			break;
		case 68:
		case 39:
		case 102:
			//console.log("6");
			colorClick(2);
			break;
		case 83:
		case 40:
		case 98:
			//console.log("2");
			colorClick(3);
			break;
		case 65:
		case 37:
		case 100:
			//console.log("4");
			colorClick(4);
			break;

		// shows keys not tagged yet	
		default: // console.log(k.keyCode + " keycode has not been mapped.");
		}
	}, false);
}
// *************************** all Instruction and Options below **********************

function addTabs(){
	var delays;
	var tabOpen= '';
	$('.menu').click( function(obj){ // clicking instructions tab.
		var tempClick="";
		// if (this.id == 'options-tab' || this.id == 'options'){  // getting rid of click on options panel due to accordian trial
		if (this.id == 'options-tab'){
			tempClick = 'opt';
			// console.log(tempClick + "  is tempClick");
		}
		if (this.id == 'instructions-tab' || this.id == '#instructions'){
			tempClick = 'ins';
			// console.log(tempClick + "  is tempClick");
		}
		switch (tabOpen){
			case tempClick:  // clicked is already open - needs to close and end.
				// console.log(tempClick +' is already opened and will be closed.');
				tabOpen = '';
				closeTab(tempClick);
				$('.tab').css('border-color','black black black black');
				break;  // ends close only routine
			case 'opt': // tempClick needs to be Opened AFTER opt is closed
				// console.log(tempClick +' needs to be Opened AFTER opt is closed');
				closeTab(tabOpen,tempClick);
				tabOpen = tempClick;
				break;
			case 'ins':// tempClick needs to be Opened AFTER ins is closed
				// console.log(tempClick +' needs to be Opened AFTER ins is closed');
				closeTab(tabOpen,tempClick);
				tabOpen = tempClick;
				break;
			default: // nothing needs to be closed, only open tempClick.
				// console.log(tempClick +' needs to be Opened because nothing is open yet.');
				closeTab("", tempClick);
				tabOpen = tempClick;
				$('.tab').css('border-color','black black tan black');
		}
	});

	var openIns = function (){ $('#instructions').css('display','block').animate({width: '400px',opacity: 1},1000); 
				$('#instructions-tab').css('z-index',9);
				}
	var openOpt = function (){ $('#options').css('display','block').animate({width: '400px',opacity: 1},1000); 
				$('#options-tab').css('z-index',9);
				}
	var closeIns = function (){ $('#instructions').css('display','block').animate({width: '50px',opacity: 0},1000, 
				function (){$('#instructions').css('display','none');}); 
				$('#instructions-tab').css('z-index',7);
				}
	var closeOpt = function (){ $('#options').css('display','block').animate({width: '50px',opacity:0},1000, 
				function (){$('#options').css('display','none');}); 
				$('#options-tab').css('z-index',7);
				}

	function closeTab(closeMe, openMe){
		if(!openMe){ // only closes
			if (closeMe == 'ins'){ closeIns();	}
			if (closeMe == 'opt'){ closeOpt();	}
		}
		if(!closeMe){ //only opens
			//console.log(openMe);
			if (openMe == 'ins'){ openIns(); } 
			if (openMe == 'opt'){ openOpt(); }
		}
		if (openMe && closeMe){
			if (closeMe == 'ins'){ closeIns();	}
			if (closeMe == 'opt'){ closeOpt();	}
			if (openMe == 'ins'){ setTimeout(openIns,1000); } 
			if (openMe == 'opt'){ setTimeout(openOpt,1000); }
		}
	}
}
function colorEdit(color){
	let colorList = ['fail','red','blue','yellow','green'];
	let id= $(this).attr('id');
	$toneLoc[(soundList[previous])].style.backgroundColor = dullColors[previous]; // make previous key dull 
	let tempselector = "#" + colorList[previous];   // making the 'id' to get the correct previous color
	$(tempselector).css('background-color',dullColors[colorSelected]); // make the previous dull
	colorSelected = colorList.indexOf(id);  
	$(this).css('background-color',brightColors[colorSelected]); // light the one selected 
	// also have to light up the corresponding key in the list, can get that from the soundList 
	$toneLoc[(soundList[colorSelected])].style.backgroundColor = brightColors[colorSelected]; // with any luck this will work
	previous=colorSelected;  // alright, this is working
}	
