// Declare all global variables
var num_weeks = 5,
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
weeks = JSON.parse("[" +
        "[[6,0],[7,4],[0,6],[3,7],[5,0],[1,3],[4,1],[2,6]]," +
        "[[5,3],[0,4],[3,4],[2,5],[4,2],[6,5],[3,2],[7,1]]," +
        "[[0,2],[1,7],[2,1],[5,4],[7,0],[6,2],[4,7],[3,1]]," +
        "[[6,1],[2,3],[4,0],[0,3],[7,5],[1,2],[7,6],[5,1]]," +
        "[[0,7],[4,5],[3,5],[7,2],[5,6],[1,4],[6,3],[2,7]]" +

    "]");

// Results data; 1 = winner, 0 = loser; JSON format
results = JSON.parse("[" +
        "[[1,0],[1,0],[1,0],[1,0],[1,0],[0,1],[0,1],[1,0]]," +
        "[[1,0],[1,0],[1,0],[1,0],[0,1],[0,1],[1,0],[1,0]]," +
        "[[0,1],[1,0],[0,1],[1,0],[0,1],[0,1],[1,0],[1,0]]," +
        "[[0,1],[0,1],[0,1],[0,1],[0,1],[0,1],[0,1],[1,0]]," +
        "[[1,0],[1,0],[1,0],[0,1],[1,0],[0,1],[0,1],[1,0]]" +
	"]");


/**
* Randomize array element order in-place.
* Using Fisher-Yates shuffle algorithm.
*/
function shuffle(array) {
	var m = array.length, t, i;

	// While there remain elements to shuffleâ€¦
	while (m) {

		// Pick a remaining elementâ€¦
		i = Math.floor(Math.random() * (m--));

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

/** 
* Loop through all 8 teams and create an array of [x,n] matchups
*/
function build_weeks(teams, num_weeks) {
	
	var possibles = [];
	
	for(var i=0; i < teams.length; i++){ 

		possibles[i] = [];

		for(var k=0; k < teams.length; k++) {

			if (i !== k) { // make sure we don't have a game versus ourselves
				var temp = [i,k];
				possibles[i].push(temp);
			}

		}
	
		// Shuffle all the matches of each team randomly
		shuffle(possibles[i]);			
	}
	
	// Seperate our LCS data into week format instead of per-team
	for (var j=0; (j < num_weeks) && (j < (possibles.length - 1)); j++) {

		weeks[j] = [];
		
		for (var l=0; l < possibles.length; l++) {
			// add a game from every team to the week
			weeks[j].push(possibles[l].shift());
		}
		
		// Shuffle the week order
		shuffle(weeks[j]);

		// Shuffle a couple more weeks, just to be safe and random
		if ( j % 2 !== 0 ) shuffle(weeks[j]);
		
	}
	
	while (weeks.length < (num_weeks + 1)){
	
		var temp_2 = Math.floor(Math.random() * (weeks.length - 1)) + 1,
			cloned = weeks[temp_2 - 1].slice(),
			length = weeks.length;
		
		weeks[length] = cloned;
		
		shuffle(weeks[length]);
		
	}

	// JSONify (JSONate?) our generated LCS data and log it
	var save_temp = JSON.stringify(weeks);
	console.log(save_temp);	
}

function build_fake_results(weeks) {
	
	for( var i=0; i < weeks.length; i++ ){
		
		results[i] = [];
	
		for ( var k=0; k < weeks[i].length; k++ ) {
			
			var temp = Math.floor(Math.random() * 2) + 1;
			
			if (temp - 1 === 0) results[i][k] = [0,1];
			else if (temp - 1 === 1) results[i][k] = [1,0];
			else results[i][k] = [2,2];
		}
		
	}
	
	// console.log(results);
	
}

/**
* Creates the highlighter menu widget
**/
function menu_hightlighter_widget(teams_shortened){
	var widget_html = '<ul id="highlighters">'+
		'<li class="pure-menu-heading">Highlight Team:</li>';
	
	for (var i=0; i < teams_shortened.length; i++){
	
		widget_html += '<li><a href="#" id="'+i+'" class="color_'+i+'">'+teams_shortened[i]+'</a></li>';
		
	}
	
	widget_html += '</ul>';
	
	$('#menu #wrapper').append(widget_html);
}

/** 
* Exports the LCS data into the layout as a bracket.
* Adds in 'winner' and 'loser' class based on results.json
* Clears previous LCS bracket if it exists.
*/
function build_schedule(weeks, current_week, results){

	$('#bracket').children().remove();
	
	$('#bracket').append('<h3>Current Week: Week '+current_week+'</h3>');

	// Loop over the LCS data
	for(var i=0; i < weeks.length; i++) {
		
		$('#bracket').append('<div id="week-'+(i+1)+'" class="week hide"><div class="header">Week '+(i+1)+'</div>');

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
	
	var paginator = '<ul id="week-pages" class="pure-paginator">'+
		'<li><a class="pure-button prev" href="#">&#171;</a></li>';
	for (var j=0; j < num_weeks; j++) {
		
		paginator += '<li><a class="pure-button" href="?week='+(j+1)+'">'+(j+1)+'</a></li>';
		
	}
	paginator += '<li><a class="pure-button next" href="#">&#187;</a></li></ul>';
	
	$('#bracket').append(paginator);
	
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
		return (a[1].length / a[2].length) < (b[1].length / b[2].length) ? 1 : -1;
	});

	// console.log(team_win_loss);

	// Write all the results to the standings table
	var table = $('#standings tbody'), count = [];

	for (var j = 0; j < team_win_loss.length; j++) {
		
		count[0] = team_win_loss[j][0];
		count[1] = counter(team_win_loss[j][1]);
		count[2] = counter(team_win_loss[j][2]);
		//console.log(count);
		
		var expand_insert = [], index_find, temp_wins, temp_loss, temp_team, result_class;
		
		for( var l=0; l < count[1][0].length; l++) {

			index_find = count[2][0].indexOf(count[1][0][l]);
			temp_wins = count[1][1][l];
			temp_loss = index_find === -1 ? 0 : count[2][1][index_find];
			temp_team = count[1][0][l];
			
			if (index_find !== -1){ count[2][0].splice(index_find, 1); count[2][1].splice(index_find, 1); }
			
			if (temp_wins > temp_loss) result_class = 'win';
			else if (temp_wins === temp_loss) result_class = 'tie';
			else if (temp_wins < temp_loss) result_class = 'loss';
		
			expand_insert[l] = '<tr class="'+result_class+'">'+
									'<td>vs.</td>'+
									'<td>'+teams_shortened[temp_team]+'</td>'+
									'<td>'+temp_wins+'</td>'+
									'<td>'+temp_loss+'</td>'+
								'</tr>';
				
		}
		for ( var n=0; n < count[2][0].length; n++ ){

			temp_wins = 0;
			temp_loss = count[2][1][n];
			temp_team = count[2][0][n];
			
			result_class = 'loss';
		
			expand_insert[expand_insert.length] = '<tr class="'+result_class+'">'+
									'<td>vs.</td>'+
									'<td>'+teams_shortened[temp_team]+'</td>'+
									'<td>'+temp_wins+'</td>'+
									'<td>'+temp_loss+'</td>'+
								'</tr>';
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




// Insert the highlight teams widget
menu_hightlighter_widget(teams_shortened);

// If we don't already have our LCS data generated
if(weeks.length <= 0) build_weeks(teams, num_weeks);

// Make some fake results for test purposes
if(results.length <= 0) build_fake_results(weeks);

// Make the schedule HTML
build_schedule(weeks, current_week, results);

// Make the results table
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
		if ( week === num_weeks ) return false;
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