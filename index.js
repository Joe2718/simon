var sounds = []; // array of sound objects 


$(function (){
	createSounds();
	mapBorders();
	// directly from MIDI.js example



});

// *********************** This just plays sounds **************************************
function colorClick(noteNum){  // going to keep this here just in case I want to mess with sound
     sounds[noteNum].currentTime = 0;
	sounds[noteNum].play();
	console.log(noteNum);
}


function test(){
	console.log("test");
}
// ************************* creates the sound objects *********************
// hoping that it loads them upon creation too. 
function createSounds(){
	let soundLocs = ["mp3/A0.mp3", "mp3/C3.mp3","mp3/E3.mp3","mp3/G3.mp3","mp3/G4.mp3"];
	for (index in soundLocs){
		var audio = new Audio(soundLocs[index]);
		sounds.push(audio);
	}
	console.log(sounds)
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
		// if I translated where the offset is (probalby the upper right corner)
		// to the center (innerWidth / 2 ) maybe this could be a general purpose function
		// for determining if you click on a border.  
		// side project and something to put up on git hub
		let x = ele.offsetX;
		let y = ele.offsetY; 
		// console.log(ele);
		if (x <= 0){ // X is negative
			if (y <= 0){ // Y is negative
				if (x > y){
					console.log('top');
					colorClick(1);
				} else {
					console.log('left')	
					colorClick(4);				
				}
			} else { // y is positive
				if (Math.abs(x) > y){
					console.log('left');
					colorClick(4);
				} else {
					console.log('bottom')
					colorClick(3);
				}
			}
		} else { // X is positive
			if (y <= 0){ // Y is negative
				if (x > Math.abs(y)){
					console.log('right');
					colorClick(2);					
				} else {
					console.log('top')
					colorClick(1);
				}
			} else { // y is positive
				if (x > y){
					console.log('right ');
					colorClick(2);
				} else {
					console.log('bottom');
					colorClick(3);
				}
			}
		}
	});
}