

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
					MIDIjs.stop();
					MIDIjs.play('E-red.mid');
				} else {
					console.log('left')
					MIDIjs.stop();
					MIDIjs.play('G-green.mid');
					
				}
			} else { // y is positive
				if (Math.abs(x) > y){
					console.log('left');
					MIDIjs.stop();
					MIDIjs.play('G-green.mid');
				} else {
					console.log('bottom')
					MIDIjs.stop();
					MIDIjs.play('C-yellow.mid');
				}
			}
		} else { // X is positive
			if (y <= 0){ // Y is negative
				if (x > Math.abs(y)){
					console.log('right');
					MIDIjs.stop();
					MIDIjs.play('G-blue.mid');
					
				} else {
					console.log('top')
					MIDIjs.stop();
					MIDIjs.play('E-red.mid');
				}
			} else { // y is positive
				if (x > y){
					console.log('right ');
					MIDIjs.stop();
					MIDIjs.play('G-blue.mid');
				} else {
					console.log('bottom');
					MIDIjs.stop();
					MIDIjs.play('C-yellow.mid');
					
				}
			}
		}



	});
});






function test(){
	console.log("test");
}

// .click(selectSquare) 