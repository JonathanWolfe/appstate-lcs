var possibles = [], weeks = [], results = [], teams = ["Orbital War Brigade", "Mom Told Me to Pause", "Naming is Harder than Gaming", "Tears Fully Stacked", "Cereal Killers", "Poptarts and Koreans", "Mayonnaise Wagon", "The Donger Squad"];

weeks = JSON.parse("["+
		"[[6,0],[7,4],[0,6],[3,7],[5,0],[1,3],[4,1],[2,6]],"+
		"[[5,3],[0,4],[3,4],[2,5],[4,2],[6,5],[3,2],[7,1]],"+
		"[[0,2],[1,7],[2,1],[5,4],[7,0],[6,2],[4,7],[3,1]],"+
		"[[6,1],[2,3],[4,0],[0,3],[7,5],[1,2],[7,6],[5,1]],"+
		"[[0,7],[4,5],[3,5],[7,2],[5,6],[1,4],[6,3],[2,7]],"+
		"[[3,0],[1,6],[5,7],[7,3],[4,3],[0,5],[6,7],[2,4]],"+
		"[[5,2],[0,1],[6,4],[2,0],[4,6],[3,6],[1,0],[7,3]]"+
	"]");

results = JSON.parse("["+
		"[[1,0],[1,0],[1,0],[1,0],[1,0],[0,1],[0,1],[1,0]]"+
	"]");

/**
* Randomize array element order in-place.
* Using Fisher-Yates shuffle algorithm.
*/
function shuffle(array) {
	var m = array.length, t, i;

	// While there remain elements to shuffle…
	while (m) {

		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);

		// And swap it with the current element.
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}

	return array;
}

function counter(arr) {
	var a = [], b = [], prev;

	arr.sort();
	for ( var i = 0; i < arr.length; i++ ) {
		if ( arr[i] !== prev ) {
			a.push(arr[i]);
			b.push(1);
		} else {
			b[b.length-1]++;
		}
		prev = arr[i];
	}

	return [a, b];
}

if(weeks.length <= 0) {

	for(var i=0; i < 8; i++){ 

		possibles[i] = [];

		for(var k=0; k < 8; k++) {

			if (i !== k) {
				var temp = [i,k];
				possibles[i].push(temp);
			}

		}

	}

// console.log(possibles);

var team_1 = possibles[0], team_2 = possibles[1], team_3 = possibles[2], team_4 = possibles[3], team_5 = possibles[4], team_6 = possibles[5], team_7 = possibles[6], team_8 = possibles[7];

// console.log(team_1);

shuffle(team_1);
shuffle(team_2);
shuffle(team_3);
shuffle(team_4);
shuffle(team_5);
shuffle(team_6);
shuffle(team_7);
shuffle(team_8);

/** 
console.log(team_1); console.log(team_2); console.log(team_3); console.log(team_4); console.log(team_5); console.log(team_6); console.log(team_7); console.log(team_8); 
**/

for (var i=0; i < 7; i++) {

	weeks[i] = [];
	weeks[i].push(team_1.shift());
	weeks[i].push(team_2.shift());
	weeks[i].push(team_3.shift());
	weeks[i].push(team_4.shift());
	weeks[i].push(team_5.shift());
	weeks[i].push(team_6.shift());
	weeks[i].push(team_7.shift());
	weeks[i].push(team_8.shift());

	shuffle(weeks[i]);

}

shuffle(weeks[3]);
shuffle(weeks[5]);
weeks[7] = shuffle(weeks[5].slice(0));
weeks[8] = shuffle(weeks[3].slice(0));

}

/* 
var temp = weeks.slice(0), count = [];
for (var i=0; i < 9; i++) {
	var temp_2 = temp[i].join();
	count[i] = counter(temp_2.split(','));
	console.log(count[i][1]);
}
*/

// console.log(count);

console.log(weeks);
console.log(results);

var save_tmp = JSON.stringify(weeks);
// console.log(save_tmp);

function build_schedule(weeks){
	$('#bracket .week div').not('.header').remove();

	for(var i=0; i < weeks.length; i++) {

		for(var k=0; k < weeks[i].length; k++) {

			var winners = ['',''];

			if(i < results.length) {
				if(results[i][k][0] === 1) winners = [' winner',' loser'];
				else winners = [' loser',' winner'];
			}

			$('#week-'+(i+1)).append('<div class="match">'+
					'<span id="'+weeks[i][k][0]+'" class="team team_'+weeks[i][k][0]+' left'+winners[0]+'">'+teams[weeks[i][k][0]]+'</span>'+
					'<span id="'+weeks[i][k][1]+'" class="team team_'+weeks[i][k][1]+' right'+winners[1]+'">'+teams[weeks[i][k][1]]+'</span>'+
				'</div>');

		}

	}
}

build_schedule(weeks);

var is_highlighted = false;

function highlight(id) {
	$('#bracket').find('span#' + id).each(function(){
		$(this).parent().addClass('color_' + $(this).attr('id'));
	});
}

function unhighlight(id) {
	$('#bracket').find('span#' + id).each(function(){
		$(this).parent().removeClass('color_' + $(this).attr('id'));
	});
}

/*
$('.team').hover(
	function() {
		if( !is_highlighted ) highlight($(this).attr('id'));
	}, 
	function() {
		if( !is_highlighted ) unhighlight($(this).attr('id'));
	}
);
*/

$('#highlighters a').click(function(event){
	event.preventDefault();

	if( is_highlighted === false ) {
		highlight($(this).attr('id'));
		$(this).addClass('pure-menu-selected');
		is_highlighted = $(this).attr('id');
	}

	else if ( is_highlighted === $(this).attr('id') ) {
		unhighlight(is_highlighted); 
		$(this).removeClass('pure-menu-selected');
		is_highlighted = false;
	}

	else {
		unhighlight(is_highlighted); 
		$('#highlighters .pure-menu-selected').removeClass('pure-menu-selected'); 
		highlight($(this).attr('id'));
		$(this).addClass('pure-menu-selected');
		is_highlighted = $(this).attr('id');
	}
});

$('#menu').css('height', $(window).height());

$('#open-close').click(function(event){
	event.preventDefault();

	if( $('#menu').hasClass('closed') ) {
		$('#menu').removeClass('closed').addClass('opened');
		$('#wrapper').show().addClass('pure-menu-open');
	}
	else {
		$('#menu').removeClass('opened').addClass('closed');
		$('#wrapper').hide().removeClass('pure-menu-open');
	}
});