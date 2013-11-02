// Declare all global variables
var possibles = [], 
weeks = [], 
results = [], 
teams = [
	"Orbital War Brigade", 
	"Mom Told Me to Pause", 
	"Naming is Harder than Gaming", 
	"Tears Fully Stacked", 
	"Cereal Killers", 
	"Poptarts and Koreans", 
	"Mayonnaise Wagon", 
	"The Donger Squad"
], 
teams_shortened = [
	"Orbital War Brigade", 
	"Mom Told Me to Pause", 
	"Naming is Harder", 
	"Tears Fully Stacked", 
	"Cereal Killers", 
	"Poptarts and Koreans", 
	"Mayonnaise Wagon", 
	"The Donger Squad"
], 
uri = parseURL(location.href), 
current_week = 5, 
is_highlighted = false; 

// console.log(uri.params);

// LCS match data generated by our generator and put into JSON format
weeks = JSON.parse("["+
	"[[6,0],[7,4],[0,6],[3,7],[5,0],[1,3],[4,1],[2,6]],"+
	"[[5,3],[0,4],[3,4],[2,5],[4,2],[6,5],[3,2],[7,1]],"+
	"[[0,2],[1,7],[2,1],[5,4],[7,0],[6,2],[4,7],[3,1]],"+
	"[[6,1],[2,3],[4,0],[0,3],[7,5],[1,2],[7,6],[5,1]],"+
	"[[0,7],[4,5],[3,5],[7,2],[5,6],[1,4],[6,3],[2,7]],"+
	"[[3,0],[1,6],[5,7],[7,3],[4,3],[0,5],[6,7],[2,4]],"+
	"[[5,2],[0,1],[6,4],[2,0],[4,6],[3,6],[1,0],[7,3]]"+
"]");

// Results data; 1 = winner, 0 = loser; JSON format
results = JSON.parse("["+
	"[[1,0],[1,0],[1,0],[1,0],[1,0],[0,1],[0,1],[1,0]],"+
	"[[1,0],[1,0],[1,0],[1,0],[0,1],[0,1],[1,0],[1,0]],"+
	"[[0,1],[1,0],[0,1],[1,0],[0,1],[0,1],[1,0],[1,0]],"+
	"[[0,1],[0,1],[0,1],[0,1],[0,1],[0,1],[0,1],[1,0]],"+
	"[[1,0],[2,2],[2,2],[0,1],[2,2],[2,2],[2,2],[1,0]]"+
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

/** 
* Counts the number of times an item appears in an array
* Taken from a stackoverflow question
*/
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

/**
* This function creates a new anchor element and uses location
* properties (inherent) to get the desired URL data. Some String
* operations are used (to normalize results across browsers).
*/
function parseURL(url) {
	var a =  document.createElement('a');
	a.href = url;
	return {
		source: url,
		params: (function(){
			var ret = {},
			seg = a.search.replace(/^\?/,'').split('&'),
			len = seg.length, i = 0, s;
			for (;i<len;i++) {
				if (!seg[i]) { continue; }
				s = seg[i].split('=');
				ret[s[0]] = s[1];
			}
			return ret;
		})()
	};
}


// If we don't already have our LCS data generated
if(weeks.length <= 0) {
	
	/** 
	* Loop through all 8 teams and create an array of [x,n] matchups
	*/
	for(var i=0; i < 8; i++){ 

		possibles[i] = [];

		for(var k=0; k < 8; k++) {

			if (i !== k) {
				var temp = [i,k];
				possibles[i].push(temp);
			}

		}

	}
	
	// Seperate all of our possible matches to their over variables (optional)
	var team_1 = possibles[0], team_2 = possibles[1], team_3 = possibles[2], team_4 = possibles[3], team_5 = possibles[4], team_6 = possibles[5], team_7 = possibles[6], team_8 = possibles[7];

	// Shuffle all the matches of each team randomly
	shuffle(team_1);
	shuffle(team_2);
	shuffle(team_3);
	shuffle(team_4);
	shuffle(team_5);
	shuffle(team_6);
	shuffle(team_7);
	shuffle(team_8);
	
	// Seperate our LCS data into week format instead of per-team
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
		
		// Suff the week order
		shuffle(weeks[i]);

	}

	// Shuffle a couple more weeks, just to be safe and random
	shuffle(weeks[3]);
	shuffle(weeks[5]);

	// JSONify (JSONate?) our generated LCS data and log it
	var save_tmp = JSON.stringify(weeks);
	// console.log(save_temp);
}

// console.log(weeks);
// console.log(results);


/** 
* Exports the LCS data into the layout asa bracket.
* Adds in 'winner' and 'loser' class based on results.json
* Clears previous LCS bracket if it exists.
*/
function build_schedule(weeks, current_week, results){

	$('#bracket h3').text('Current Week: Week '+current_week);
	
	$('#bracket .week div').not('.header').remove();

	// Loop over the LCS data
	for(var i=0; i < weeks.length; i++) {

		// Loop over each week's matches
		for(var k=0; k < weeks[i].length; k++) {

			var winners = ['',''];

			// Do we have any results data we can show?
			if(i < results.length) {
				if( results[i][k][0] === 1 ) winners = [' winner',' loser'];
				else if( results[i][k][0] === 0 ) winners = [' loser',' winner'];
			}

			// Write all the matches to the DOM, could be optimized
			$('#week-'+(i+1)).append('<div class="match">'+
										'<span id="'+weeks[i][k][0]+'" class="team team_'+weeks[i][k][0]+' left'+winners[0]+'">'+teams[weeks[i][k][0]]+'</span>'+
										'<span id="'+weeks[i][k][1]+'" class="team team_'+weeks[i][k][1]+' right'+winners[1]+'">'+teams[weeks[i][k][1]]+'</span>'+
									'</div>');

		}

	}
	
	$('#bracket #week-'+current_week).addClass('current-week show');
	$('#week-pages a[href="?week='+current_week+'"]').addClass('pure-button-active');

}

/** 
* Creates the team standings
* Sorts by number of wins then number of losses (i.e. win percentage)
*/
function build_results_table(weeks, results, teams, teams_shortened) {

	// handwritten to save a for-loop
	var team_win_loss = [[0,[],[]],[1,[],[]],[2,[],[]],[3,[],[]],[4,[],[]],[5,[],[]],[6,[],[]],[7,[],[]]];

	// Loop over our results data
	for (var i=0; i < results.length; i++) {

		// Loop over each week's matches' results
		for (var k=0; k <results[i].length; k++) {

			var blue_team = weeks[i][k][0], purple_team = weeks[i][k][1];

			// Blue side wins
			if( results[i][k][0] === 1 ) {				
				// add win to first team
				team_win_loss[blue_team][1].push(purple_team);
				
				// add loss to second team
				team_win_loss[purple_team][2].push(blue_team);
			}

			// Purple side wins
			else if ( results[i][k][0] === 0 ) {				
				// add win to second team
				team_win_loss[purple_team][1].push(blue_team);
				
				// add loss to first team
				team_win_loss[blue_team][2].push(purple_team);
			}
			
			// shit, nobody won? log an error.
			else console.log('error for week '+i+' result '+k);
		}
		
	}

	// Where the magic sorting happens
	team_win_loss.sort(function(a, b) {
		return (a[1].length / a[2].length) < (b[1].length / b[2].length);
	});

	// console.log(team_win_loss);

	// Write all the results to the standings table
	var table = $('#standings tbody'), count = [];

	for (var j = 0; j < team_win_loss.length; j++) {
		
		count[0] = team_win_loss[j][0];
		count[1] = counter(team_win_loss[j][1]);
		count[2] = counter(team_win_loss[j][2]);
		// console.log(count);
		
		var expand_insert = [];
		for( var l=0; l < (count[1][0].length + count[2][0].length); l++) {

			if (l < count[1][0].length && count[2][0].indexOf(count[1][0][l]) === -1) {
				
				expand_insert[l] = '<tr class="win">'+
										'<td>vs.</td>'+
										'<td>'+teams_shortened[count[1][0][l]]+'</td>'+
										'<td>'+count[1][1][l]+'</td>'+
										'<td>0</td>'+
									'</tr>';
			}
			else if (count[2][0].indexOf(count[1][0][l]) !== -1) {
				
				expand_insert[l] = '<tr class="tie">'+
										'<td>vs.</td>'+
										'<td>'+teams_shortened[count[1][0][l]]+'</td>'+
										'<td>1</td>'+
										'<td>1</td>'+
									'</tr>';
			}
			else if (l >= count[1][0].length && count[1][0].indexOf(count[2][0][l - count[1][0].length]) === -1) {
				
				expand_insert[l] = '<tr class="loss">'+
										'<td>vs.</td>'+
										'<td>'+teams_shortened[count[2][0][l - count[1][0].length]]+'</td>'+
										'<td>0</td>'+
										'<td>'+count[2][1][l - count[1][0].length]+'</td>'+
									'</tr>';
				
			}
			
		}
		
		// console.log(expand_insert);
		
		temp = expand_insert.join(' ').toString();
		// console.log(temp);

		table.append('<tr id="standings-team-'+team_win_loss[j][0]+'" class="standings-open-close">'+
						'<td>'+(j + 1)+'</td>'+
						'<td>'+teams[team_win_loss[j][0]]+'</td>'+
						'<td>'+team_win_loss[j][1].length+'</td>'+
						'<td>'+team_win_loss[j][2].length+'</td>'+
					'</tr>'+
					'<tr class="results-expanded team-'+(team_win_loss[j][0])+' hide">'+
						'<td colspan="4">'+
							'<table class="expaned-table pure-table pure-table-horizontal">'+temp+'</table>'+
						'</td>'+
					'</tr>');

	}
	
}

/** 
* Adds the classes for each team's color to the standings and bracket
*/
function highlight(id) {
	$('#bracket span#' + id).each(function(){
		$(this).parent().addClass('color_'+id);
	});
	$('#standings-team-'+id).addClass('color_'+id);
}

/** 
* Removes the classes for each team's color to the standings and bracket
*/
function unhighlight(id) {
	$('#bracket span#' + id).each(function(){
		$(this).parent().removeClass('color_'+id);
	});
	$('#standings-team-'+id).removeClass('color_'+id);
}

/** 
* Change which week is currently shown 
* Just a simple show/hide class switch
* Also changes title H3 text
* And changes the paginator button classes to be correct after change
*/
function week_page_change(week, current_week) {
	$('#bracket .show').removeClass('show').addClass('hide');
	if( week === current_week ) $('#bracket h3').text('Current Week: Week '+current_week);
	else $('#bracket h3').text('Week '+week);
	$('#bracket .pure-button-active').removeClass('pure-button-active');
	$('#week-pages a[href="?week='+week+'"]').addClass('pure-button-active');
	$('#bracket #week-'+week).removeClass('hide').addClass('show');
}




build_schedule(weeks, current_week, results);
build_results_table(weeks, results, teams, teams_shortened);




// Keep menu bar full height
$(window).resize(function(){
	$('#menu').css('height', 'auto');
	if($(window).height() >= $(document).height()) $('#menu').css('height', $(window).height());
	else $('#menu').css('height', $(document).height());
});
$(window).trigger('resize');


// Open/close the menu bar
$('#menu-open-close').click(function(event){
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


// Manage which team is highlighted
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


// Did the URL request a specific week? change to it
if(uri.params.week){ 
	week_page_change(parseInt(uri.params.week, 10), current_week);
}


// Manage the week paginator buttons
$('#week-pages a[href!="#"]').click(function(event){
	event.preventDefault();
	
	var temp = location.href, 
	current = (temp.indexOf('?') !== -1) ? temp.substr(0,temp.indexOf('?')) : temp, 
	week = $(this).text();
	
	history.replaceState({}, 'Week '+uri.params.week, current+'?week='+week);
	
	week_page_change(parseInt(week, 10), current_week);
});

// Manage the Next/Prev paginator buttons
$('#week-pages a[href="#"]').click(function(event) {
	event.preventDefault();
	
	var viewing_week = $('#week-pages .pure-button-active').text(), 
	temp = location.href, 
	current = (temp.indexOf('?') !== -1) ? temp.substr(0,temp.indexOf('?')) : temp, 
	week = parseInt($('#week-pages .pure-button-active').text(), 10); 
	
	if ( $(this).hasClass('prev') ) {
		if ( week === 1 ) return false;
		else week--;
	}
	if ( $(this).hasClass('next') ){ 
		if ( week === 7 ) return false;
		else week++; 
	}
	
	var new_url = current+'?week='+week;
	history.replaceState({}, 'Week '+week, new_url);
	
	week_page_change(week, current_week);
});

$('#standings .standings-open-close').click(function() {
	var selected_team = $(this).attr('id').slice(-1);
	
	if( $('.results-expanded.team-'+selected_team).hasClass('hide') ){
		$('.results-expanded.show').removeClass('show').addClass('hide');
		$('.results-expanded.team-'+selected_team).removeClass('hide').addClass('show');
	}
	else $('.results-expanded').removeClass('show').addClass('hide');
});