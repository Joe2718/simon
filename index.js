var sounds = []; // array of sound objects 
// var best = []; // original button on the game 
var current = []; // current key list
var speed = 400; // beginning delay .. lower this is, faster game will be
var strict = false;
var power = false;
var blinkMe = 100;
var progress = 0; // step in user playback
var inGame = false;
var isComputer = true;
var soundList = []; // need to use this for the NUMBER and sounds for the sound OBJ.  
var masterCount =0; // I should get rid of this since it's really not necessary.
var masterSoundList = [];  // built from JSON file in soundfont directory
var brightColors = ["lightgrey","red"    ,"blue"    , "yellow"    ,"lime"];      // did these here just to make it easy to 
var dullColors   = ["grey","darkred","darkblue", "goldenrod" ,"darkgreen"]; // see which colors are used and easy to change.
var $toneLoc;  // standard JS select of tonekey Divs, masterSoundList[0]=$toneLoc[0]    
				// see instructions'instructions' panel to understand.
var colorSelected=0;// number of color selected fail-0, red-1 blue-2 yellow-3 green-4   
var previous=0; // previous selected.  I should have done this with a class or two, too many globals going on.  
			// although I never planned on it going this far
var useDim;	
var context = new AudioContext();  // needed to be able to shut it off when new is pressed
var o; // needed to shut tone off (should have made all sounds subclasses)
// ********************* Main onload function  *******************************
$(function (){
	addKeys();    // adds keys
	soundListCreator();  // creates master sound list and assigns default sounds.
	mapBorders();  // makes things clickable
	addTabs();
	setTimeout(scaleMe,100); // 1/10 second just .. not having issue so not sure why I did this.
});
// ***************************************** New Round ******************************************************
function newRound(){
	if (power){
		inGame=true;
		current.length = 0;
		game();
	}
}

// ******************************************** Game loop *****************************************************
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
//  ******************************************** play list of keys ************************************************
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
// ****************************************** creates the sound array ********************************************
// 0 = fail, 1 = top, 2 = right, 3 = bottom, 4 = left
function createSounds(arr){
	sounds.length=0; // clears old sounds 
	$toneLoc =  document.getElementsByClassName('tonekeys'); // can this really be this easy?
	arr.forEach(function (soundNum,index){
		sounds.push(masterSoundList[soundNum]);  // have to make masterList first
		// have to figure out how to get the specific node number in the class 'tonekeys' and set it's background 
		// to the dullColors[] unless it's the one selected.		
		if (index === previous){
			$toneLoc[soundNum].style.backgroundColor = brightColors[index];
		} else {
			$toneLoc[soundNum].style.backgroundColor = dullColors[index];
		}
	})

}
// ******* going to use some of the mp3's from https://github.com/mudcube/MIDI.js/ ********************************

function soundListCreator(callback){
	//  Master Sound List Load.

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
		 			masterSoundList.push(audio);  // everything in this should be playable.
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
			 				optKey(toneNum);									 				
			  			})
			 			.text(toneName.substring(0,toneName.length-4))
		 			);
		 		}
		 	}
		 // soundList= [0,34, 57, 78, 79];
		 // createSounds(soundList);
		 addOscTones();  // add oscillation tones .. function below
		 // put OSC in a seperate function so it's not confused with the previous file import.
		}	//  end of Success 
	}); 
	$('#soundColor span').click(colorEdit);
	if(typeof callback === 'function'){ callback;}
}
// *******************************   oscillation tones   *******************************
function addOscTones(){
	$('#soundURL').append(
		$('<H3/>').text('Oscillator Tones')
			.css('clear','left')
			.attr({
				'class': "acc-header"
	}));
	$('#soundURL').append(
		$('<div/>').attr({
			'class':'acc-container'
			}) // .css('clear','left')
	);
	var $accContainer = $('.acc-container:last');
	var trim =0;  // going to trim the ultra low tones
	for (var key in noteValues){  // heck, this guys method way of storing was easier seems like a hashmap
		trim++;
		if (trim > 13){
			// console.log(key, noteValues[key]);
			masterSoundList.push(noteValues[key]);  // just pushing the numbers
			masterCount++;  // why am I doing this?  I could just masterSoundList.length.
			let toneName = key;
			$accContainer.append(						
				$('<div/>').attr({
					'class':'tonekeys',
					'tone':masterCount-1
					// 'onClick': optKey(tAudio[index])
				})
				//.addEventListener("click", optKey(tAudio[index],true))
				.click(function (){
					var toneNum = $(this).attr('tone');
					optKey(toneNum);									 				
				})
				.text(toneName)
			);
		}	
	}
	addPresets();
}
// *******************************   Presets tones   *******************************
function addPresets(){

	$('#soundURL').append(
	$('<H3/>').text('Presets')
		.css('clear','left')
		.attr({
			'class': "acc-header"
	}));
	$('#soundURL').append(
		$('<div/>').attr({
			'class':'acc-container'
			}) // .css('clear','left')
	);
	var $accContainer = $('.acc-container:last');
	// ok, ready to add a div with whatever presets I want to  set.
 // this is the default on load list
 	//  soundList= [0,34, 57, 78, 79];  // original Piano list
 	soundList= [0,225,232,238,242];  // all tones
	createSounds(soundList);
}
// ********************* clicking on a piano like key in options points here **********************
function optKey(toneNum){
	console.log(typeof masterSoundList[toneNum], toneNum);
	if (typeof  masterSoundList[toneNum] === 'object'){
		masterSoundList[toneNum].currentTime = 0;
		masterSoundList[toneNum].play();
	} else { // just a tone
		toneGen(masterSoundList[toneNum],1000);
	}
	// previous is storing the selected colornumber to edit
	// soundList is storing the sounds for the colorNumbers
	// which also gives me the key divs via $toneloc
	// change previous background color to white in tonloc (previous is a number relating to a color)
	// $toneLoc[(soundList[colorSelected])].style.backgroundColor = brightColors[colorSelected];
	$toneLoc[soundList[previous]].style.backgroundColor = "white";
	// change current background color to previous color in toneloc
	$toneLoc[toneNum].style.backgroundColor = brightColors[previous];
	// change soundList to store current divkey 
	soundList[previous]=toneNum;
	// assign the colors to the game via 
	createSounds(soundList); // easy enough to hit enter to finish that step
}


// *********************** This just plays sounds then calls color change ***********************************
function colorSelect(noteNum){  // going to keep this here just in case I want to mess with sound
	if (typeof sounds[noteNum]=== 'object'){
		sounds[noteNum].currentTime = 0;
		sounds[noteNum].play();
	} else {
		toneGen(sounds[noteNum],500);  // plays tone but shorter than normal 1000
	}
	setColor(noteNum);
}
// ********************** switches color **************************************************************
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

// **************************************  power on ***************************************************
function powerOn(){
	power = !power;
	if (power){ // have to turn power on here
		$('#scoreDiv').css('color','red')
		.empty()
		.text('0');
		// I'll make this relative to it's container 
		// since button dimensions are smaller, length it get's dragged is increased by 2
		// since it's smaller by 4 and want to keep the 2px border.
		// to scale this slider, just scale $("#power .switch").width()
		let tempMove = ""+($("#power .switch").width()/2+2)+"px";
		$('#sliderButton').animate({left: tempMove});
	} else { 		// have to turn power off here
		$('#scoreDiv').css('color','black')
		.empty()
		.text('88');
		$('#sliderButton').animate({left: '2px'});
	}
}

// ********************************** toggles strict *********************************************
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
// ****************************************** main  on click routine *********************************
function colorClick(num){
	// ok, now only the player will be here and can process and check stuff
	if (power && !isComputer){
		if (inGame){
			if (num == current[progress]){
				progress++;				
				// console.log("Match!  "+ (progress) + "   "+current.length);
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
		if (this.id == 'options-tab' || this.id == 'X'){  // getting rid of click on options panel due to accordian trial
		// if (this.id == 'options-tab'){
			tempClick = 'opt';
			// console.log(tempClick + "  is tempClick");
		}
		if (this.id == 'instructions-tab' || this.id == 'instructions'){
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


// ********************************* window scalability ************************************************************
$(window).resize(scaleMe);

function scaleMe(){
	// alright, need to figure out what I want here.
	// console.log('resize functioning');
	var offset = $('main-container').css('border-width');  // might not use this
	var height  = $(window).height();
	var width = $(window).width();
	if (height > width){ 
		useDim = width;
	} else {
	 	useDim = height; 	
	}
	// first scale outside ONLY - with the border's border.
	// #outerRim - width & height=  ((useDim -20)/ 2) 
	// #colorCircle - border = outerRim's height or width /2)
	if(useDim >= 400){
		let setThis = "" + (useDim -30)+"px"; // going to use just a little padding
		$('#outerRim').css('height',setThis).css('width',setThis);
		setThis = "" + (useDim-10)+"px"; 
		$('.container').css('height',setThis).css('width',setThis);
		setThis = "" + (((useDim -30)/2)+1)+ "px solid" ;
		$('#colorCircle').css({
			'border':setThis,
			'border-top-color': 'darkred',
			'border-right-color': 'darkblue',
			'border-bottom-color': 'goldenrod',
			'border-left-color':' darkgreen'
		});
		$('#info').css('display','block');
		// center 
		setThis = "" + ((useDim - 40)/2) + "px";
		$('#centerCircle').css('height',setThis).css('width',setThis);  // this should be pretty close to ratio
		// position for this is negative (width + (2*border)) / 2
		let tempWidth = ((useDim - 40)/2);
		setThis = "" + ((tempWidth + (2*10))*-1)/2 + "px";
		$('#centerCircle').css('top',setThis).css('left',setThis); // now to do all the stuff inside this circle
		// this is the challenge part - although shouldn't be that bad if I do it right.  tempWidth is going to be key
		setThis = "" + (tempWidth * .25) + "px"; // font 23% of relative window
		$('#title').css('font-size',setThis);
		$('#title').css('height',setThis);
		// score row just happened that they're squares so made it easy.
		setThis = "" + (tempWidth * .29) + "px"; // .01 to keep rounding errors from pushing it down
		$('#scoreContainer').css('width',setThis).css('height',setThis);
		$('#startDiv').css('width',setThis).css('height',setThis);
		$('#strictDiv').css('width',setThis).css('height',setThis);
		// now subcompents of scorerow - the dreaded part for me
		let tempWidth2 = (tempWidth * .29);  // each component size 
		let setThisW = "" + (tempWidth2 * .85) + "px";
		let setThisH = "" + (tempWidth2 * .6) + "px";
		setThis = "" + (tempWidth2 * .66) + "px"; // font size 
		$('#scoreDiv').css('width',setThisW).css('height',setThisH).css('font-size',setThis).css('line-height',setThis); 
		setThis = "" + (tempWidth2 * .3) + "px"; // font size 
		$('#scoreContainer').css('font-size',setThis);
		$('#startDiv').css('font-size',setThis);
		$('#strictDiv').css('font-size',setThis);
		// first subcomponent finish
		// gamebutton and strict buttons with texts now
		setThisW = "" + (tempWidth2 * .42) + "px";
		$('.button').css('width',setThisW).css('height',setThisW);
		setThisW = "" + (tempWidth2 * .1) + "px";
		$('#strictIndicator').css('width',setThisW).css('height',setThisW);
		setThisH = "" + (tempWidth2 * .05) + "px";
		setThisW = "" + (tempWidth2 * .44) + "px";
		$('#strictIndicator').css('top',setThisH).css('left',setThisW);
		// power switch now... trashing current power switch and making new one
		tempWidth2 = $("#power").width()/4;
		setThisW = "" + (tempWidth2) + "px";
		setThisH = "" + (tempWidth2/2) + "px";
		// console.log(setThisW);
		$('#power .switch').css('width',setThisW).css('height',setThisH);
		setThisW = "" + (tempWidth2/2-4) + "px";
		setThisH = "" + (tempWidth2/2-4) + "px";
		$('#sliderButton').css('width',setThisW).css('height',setThisH);
		setThisH = "" + (tempWidth2/2-4) + "px";
		$('#power span').css('font-size',setThisH);
	} else { // smaller screen so going to hide options and instructions buttons
		$('#info').css('display','none');
	}
	// restructured just a bit and it went simple
	// if that reaches some amount (400px ) pop the middle out and place it under or next to the original
	// I didn't care for popping it out at all, just freezing it at 400px min.
	// seemed fine at 1600 all the way down to min.. blah, going to scale middle 
}

function toneGen(toneNum,duration){
	if (!duration){ duration = 1000;}
	if(o){
		// console.log('stopping '+ o)
		o.stop();
	} 
	// var context = new AudioContext();
	o = context.createOscillator();
	o.type = "sine";
	// o.connect(context.destination);
	var  g = context.createGain();
	o.connect(g);
	g.connect(context.destination);
	var frequency = toneNum;
	o.frequency.value = frequency;
	o.start();
	setTimeout(function (){
		g.gain.exponentialRampToValueAtTime( 0.00001, context.currentTime + .2 );
	},duration); // woot!  I have a functioning sound button that makes a tone!
}