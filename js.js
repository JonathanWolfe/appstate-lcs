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

	var team_1 = possibles[0], team_2 = possibles[1], team_3 = possibles[2], team_4 = possibles[3], team_5 = possibles[4], team_6 = possibles[5], team_7 = possibles[6], team_8 = possibles[7];

	shuffle(team_1);
	shuffle(team_2);
	shuffle(team_3);
	shuffle(team_4);
	shuffle(team_5);
	shuffle(team_6);
	shuffle(team_7);
	shuffle(team_8);

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
	// weeks[7] = shuffle(weeks[5].slice(0));
	// weeks[8] = shuffle(weeks[3].slice(0));

}

console.log(weeks);
console.log(results);

var save_tmp = JSON.stringify(weeks);

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

function build_results_table(weeks, results, teams) {

	var team_win_loss = [[0,0,0],[1,0,0],[2,0,0],[3,0,0],[4,0,0],[5,0,0],[6,0,0],[7,0,0]];

	for (var i=0; i < results.length; i++) {

		for (var k=0; k <results[i].length; k++) {

			var blue_team = weeks[i][k][0], purple_team = weeks[i][k][1];

			// Blue side wins
			if( results[i][k][0] === 1 ) {
				team_win_loss[blue_team][1] = parseInt(team_win_loss[blue_team][1], 10) + 1 ; // add win to first team
				team_win_loss[purple_team][2] = parseInt(team_win_loss[purple_team][2], 10) + 1 ; // add lose to second team
			}

			// Purple side wins
			else if ( results[i][k][0] === 0 ) {
				team_win_loss[purple_team][1] = parseInt(team_win_loss[purple_team][1], 10) + 1 ; // add win to second team
				team_win_loss[blue_team][2] = parseInt(team_win_loss[blue_team][2], 10) + 1 ; // add lose to first team
			}

			else console.log('error for week '+i+' result '+k);

		}

	}

	team_win_loss.sort(function(a, b) {
		if( a[1] === b[1] ) {
			var x = parseInt(a[2], 10), y = parseInt(b[2], 10);

			return x < y ? -1 : x > y ? 1 : 0; 
			/* 
			is x less than y? 
				true -> sort above; 
				false -> is x greater than y? 
					true -> sort below; 
					false -> sort same
			*/
		}

	return a[1] < b[1];
	});

	console.log(team_win_loss);

	var table = $('#standings tbody');
	for (var j = 0; j < team_win_loss.length; j++) {

		table.append('<tr id="standings-team-'+team_win_loss[j][0]+'">'+
						'<td>'+(j + 1)+'</td>'+
						'<td>'+teams[team_win_loss[j][0]]+'</td>'+
						'<td>'+team_win_loss[j][1]+'</td>'+
						'<td>'+team_win_loss[j][2]+'</td>'+
					'</tr>');

	}

}

build_schedule(weeks);
build_results_table(weeks, results, teams);

var is_highlighted = false;

function highlight(id) {
	$('#bracket span#' + id).each(function(){
		$(this).parent().addClass('color_'+id);
	});
	$('#standings-team-'+id).addClass('color_'+id);
}

function unhighlight(id) {
	$('#bracket span#' + id).each(function(){
		$(this).parent().removeClass('color_'+id);
	});
	$('#standings-team-'+id).removeClass('color_'+id);
}

$(window).resize(function(){
	if($(window).height() >= $(document).height()) $('#menu').css('height', $(window).height());
	else $('#menu').css('height', $(document).height());
});
$(window).trigger('resize');

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