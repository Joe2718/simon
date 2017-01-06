

$(function (){
	// $( "#centerCircle" ).click(function() {
	//   alert( "Handler for .click() called." );
	// });
	// clicks have to be here after doc loads 
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
					colorClick(80);
				} else {
					console.log('left')	
					colorClick(50);				
				}
			} else { // y is positive
				if (Math.abs(x) > y){
					console.log('left');
					colorClick(50);
				} else {
					console.log('bottom')
					colorClick(60);
				}
			}
		} else { // X is positive
			if (y <= 0){ // Y is negative
				if (x > Math.abs(y)){
					console.log('right');
					colorClick(70);					
				} else {
					console.log('top')
					colorClick(80);
				}
			} else { // y is positive
				if (x > y){
					console.log('right ');
					colorClick(70);
				} else {
					console.log('bottom');
					colorClick(60);
				}
			}
		}



	});
	// directly from MIDI.js example



});


function colorClick(noteNum){
	MIDI.loadPlugin({
	soundfontUrl: "../../../lib/js/soundfont/",
	instrument: "acoustic_grand_piano",
	onprogress: function(state, progress) {
		console.log(state, progress);
	},
	onsuccess: function() {
		var delay = 0; // play one note every quarter second
		var note = noteNum; // the MIDI note
		var velocity = 127; // how hard the note hits
		// play the note
		MIDI.setVolume(0, 127);
		MIDI.noteOn(0, note, velocity, delay);
		MIDI.noteOff(0, note, delay + 0.75);
	}
});
}




function test(){
	console.log("test");
}

// .click(selectSquare) 