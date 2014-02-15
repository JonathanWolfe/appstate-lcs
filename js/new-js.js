// Declare all global variables
var num_weeks = 3,
    weeks = [
		[
			[[3, 2], [0, 1]],
			[[2, 0], [1, 3]],
			[[2, 1], [0, 3]]
		],
		[
			[[3, 0], [2, 1]],
			[[3, 2], [0, 1]],
			[[0, 2], [1, 3]]
		]
	],
    results = [
		[
			[[0, 0], [0, 0]],
			[[0, 0], [0, 0]],
			[[0, 0], [0, 0]]
		],
		[
			[[0, 0], [0, 0]],
			[[0, 0], [0, 0]],
			[[0, 0], [0, 0]]
		]
	],
    teams = [
		[
			[
				"Ditch Six",
				"Team Riven Mid",
				"Force Tornado",
				"Rageholics Anonymous"
			],
			[
				"D6TCH",
				"RIVEN",
				"FORCE",
				"RAGE"
			]
		],
		[
			[
				"Orbital War Brigade",
				"Bronx Village",
				"Mom's Spaghetti",
				"Team Horse Tornado"
			],
			[
				"ORB",
				"BRONX",
				"SPAGH",
				"THT"
			]
		]
	],
	current_week = 1;



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
* Loop through all teams and create an array of [x,n] matchups
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
			
			results[i][k] = [];
			
			for ( var j=0; j < weeks[i][k].length; j++ ){
				var temp = Math.floor(Math.random() * 3) + 1;
			
				if (temp - 1 === 0) results[i][k][j] = [1,1];
				else if (temp - 1 === 1) results[i][k][j] = [2,0];
				else if (temp - 1 === 2) results[i][k][j] = [0,2];
				else results[i][k][j] = [0,0];
			}
			
		}
		
	}
	
	//console.log(results);
	
}

/** 
* Exports the LCS data into the layout as a bracket.
* Adds in 'winner' and 'loser' class based on results.json
* Clears previous LCS bracket if it exists.
*/
function build_schedule(weeks, current_week){
	var matches_html = [
		[
			[
				"<div class=\"color_"+weeks[0][0][0][0]+" team pure-u-1-2\"><h3>"+teams[0][0][weeks[0][0][0][0]]+"</h3></div><div class=\"color_"+weeks[0][0][0][1]+" team pure-u-1-2\"><h3>"+teams[0][0][weeks[0][0][0][1]]+"</h3></div>",
				"<div class=\"color_"+weeks[0][0][1][0]+" team pure-u-1-2\"><h3>"+teams[0][0][weeks[0][0][1][0]]+"</h3></div><div class=\"color_"+weeks[0][0][1][1]+" team pure-u-1-2\"><h3>"+teams[0][0][weeks[0][0][1][1]]+"</h3></div>"
			],
			[
				"<div class=\"color_"+weeks[0][1][0][0]+" team pure-u-1-2\"><h3>"+teams[0][0][weeks[0][1][0][0]]+"</h3></div><div class=\"color_"+weeks[0][1][0][1]+" team pure-u-1-2\"><h3>"+teams[0][0][weeks[0][1][0][1]]+"</h3></div>",
				"<div class=\"color_"+weeks[0][1][1][0]+" team pure-u-1-2\"><h3>"+teams[0][0][weeks[0][1][1][0]]+"</h3></div><div class=\"color_"+weeks[0][1][1][1]+" team pure-u-1-2\"><h3>"+teams[0][0][weeks[0][1][1][1]]+"</h3></div>"
			],
			[
				"<div class=\"color_"+weeks[0][2][0][0]+" team pure-u-1-2\"><h3>"+teams[0][0][weeks[0][2][0][0]]+"</h3></div><div class=\"color_"+weeks[0][2][0][1]+" team pure-u-1-2\"><h3>"+teams[0][0][weeks[0][2][0][1]]+"</h3></div>",
				"<div class=\"color_"+weeks[0][2][1][0]+" team pure-u-1-2\"><h3>"+teams[0][0][weeks[0][2][1][0]]+"</h3></div><div class=\"color_"+weeks[0][2][1][1]+" team pure-u-1-2\"><h3>"+teams[0][0][weeks[0][2][1][1]]+"</h3></div>"
			]
		],
		[
			[
				"<div class=\"color_"+weeks[1][0][0][0]+" team pure-u-1-2\"><h3>"+teams[1][0][weeks[1][0][0][0]]+"</h3></div><div class=\"color_"+weeks[1][0][0][1]+" team pure-u-1-2\"><h3>"+teams[1][0][weeks[1][0][0][1]]+"</h3></div>",
				"<div class=\"color_"+weeks[1][0][1][0]+" team pure-u-1-2\"><h3>"+teams[1][0][weeks[1][0][1][0]]+"</h3></div><div class=\"color_"+weeks[1][0][1][1]+" team pure-u-1-2\"><h3>"+teams[1][0][weeks[1][0][1][1]]+"</h3></div>"
			],
			[
				"<div class=\"color_"+weeks[1][1][0][0]+" team pure-u-1-2\"><h3>"+teams[1][0][weeks[1][1][0][0]]+"</h3></div><div class=\"color_"+weeks[1][1][0][1]+" team pure-u-1-2\"><h3>"+teams[1][0][weeks[1][1][0][1]]+"</h3></div>",
				"<div class=\"color_"+weeks[1][1][1][0]+" team pure-u-1-2\"><h3>"+teams[1][0][weeks[1][1][1][0]]+"</h3></div><div class=\"color_"+weeks[1][1][1][1]+" team pure-u-1-2\"><h3>"+teams[1][0][weeks[1][1][1][1]]+"</h3></div>"
			],
			[
				"<div class=\"color_"+weeks[1][2][0][0]+" team pure-u-1-2\"><h3>"+teams[1][0][weeks[1][2][0][0]]+"</h3></div><div class=\"color_"+weeks[1][2][0][1]+" team pure-u-1-2\"><h3>"+teams[1][0][weeks[1][2][0][1]]+"</h3></div>",
				"<div class=\"color_"+weeks[1][2][1][0]+" team pure-u-1-2\"><h3>"+teams[1][0][weeks[1][2][1][0]]+"</h3></div><div class=\"color_"+weeks[1][2][1][1]+" team pure-u-1-2\"><h3>"+teams[1][0][weeks[1][2][1][1]]+"</h3></div>"
			]
		]
	];
	
	$('#league-1 #match-1').append(matches_html[0][current_week - 1][0]);
	$('#league-1 #match-2').append(matches_html[0][current_week - 1][1]);
	
	$('#league-2 #match-1').append(matches_html[1][current_week - 1][0]);
	$('#league-2 #match-2').append(matches_html[1][current_week - 1][1]);
}

/** 
* Creates the team standings
* Sorts by number of wins then number of losses (i.e. win percentage)
*/
function build_results_table(weeks, results, teams) {

	// handwritten to save a for-loop
	var team_win_loss = [
		[
			[0,[],[],0],
			[1,[],[],0],
			[2,[],[],0],
			[3,[],[],0]
		],
		[
			[0,[],[],0],
			[1,[],[],0],
			[2,[],[],0],
			[3,[],[],0]
		]
	];

	// Loop over our results data
	for (var league=0; league < results.length; league++) {
		
		for (var i=0; i < results[league].length; i++) {

			// Loop over each week's matches' results
			for (var k=0; k <results[league][i].length; k++) {

				var blue_team = weeks[league][i][k][0], purple_team = weeks[league][i][k][1], copy;

				// Blue side wins
				if( results[league][i][k][0] === 2 ) {
					copy = purple_team;
					// add win to first team
					team_win_loss[league][blue_team][1].push(purple_team);
					team_win_loss[league][blue_team][1].push(copy);
					team_win_loss[league][blue_team][3] += 2;

					copy = blue_team;
					// add loss to second team
					team_win_loss[league][purple_team][2].push(blue_team);
					team_win_loss[league][purple_team][2].push(copy);
				}

				// Purple side wins
				else if ( results[league][i][k][1] === 2 ) {
					copy = blue_team;
					// add win to second team
					team_win_loss[league][purple_team][1].push(blue_team);
					team_win_loss[league][purple_team][1].push(copy);
					team_win_loss[league][purple_team][3]+= 2;

					copy = purple_team;
					// add loss to first team
					team_win_loss[league][blue_team][2].push(purple_team);
					team_win_loss[league][blue_team][2].push(copy);
				}
				
				// Both sides tie
				else if ( results[league][i][k][0] === 1 ) {
					copy = purple_team;
					// add win to first team
					team_win_loss[league][blue_team][1].push(copy);
					team_win_loss[league][blue_team][3] += 1;
					copy = blue_team;
					// add win to second team
					team_win_loss[league][purple_team][1].push(copy);
					team_win_loss[league][purple_team][3] += 1;
					
					// add loss to first team
					team_win_loss[league][blue_team][2].push(purple_team);
					// add loss to second team
					team_win_loss[league][purple_team][2].push(blue_team);
				}

				// shit, nobody won? log an error.
				else console.log('error for league '+league+' week '+i+' game '+k);
			}

		}
	}

	// Where the magic sorting happens
	team_win_loss[0].sort(function(a, b) {
		return (a[3] < b[3]) ? 1 : -1;
	});
	team_win_loss[1].sort(function(a, b) {
		return (a[3] < b[3]) ? 1 : -1;
	});

	// console.log(team_win_loss);

	// Write all the results to the standings table
	$('.standings').each(function (index) {
		var table = $(this).find('tbody'), expanded_table = $('#expanded-standings-'+(index + 1)+' table'), count = [];
		for (var j = 0; j < team_win_loss[index].length; j++) {

			count[0] = team_win_loss[index][j][0];
			count[1] = counter(team_win_loss[index][j][1]);
			count[2] = counter(team_win_loss[index][j][2]);
			//console.log(count);

			var expand_insert = [], index_find, temp_wins, temp_loss, temp_team, temp_points, result_class;

			for( var l=0; l < count[1][0].length; l++) {

				index_find = count[2][0].indexOf(count[1][0][l]);
				temp_wins = count[1][1][l];
				temp_loss = index_find === -1 ? 0 : count[2][1][index_find];
				temp_team = count[1][0][l];
				if (temp_wins === 2) temp_points = '+2';
				else if (temp_wins === 1) temp_points = '+1';
				else if (temp_wins === 0) temp_points = '+0';
				else temp_points = '+?';
				

				if (index_find !== -1){ count[2][0].splice(index_find, 1); count[2][1].splice(index_find, 1); }

				if (temp_wins > temp_loss) result_class = 'win';
				else if (temp_wins === temp_loss) result_class = 'tie';
				else if (temp_wins < temp_loss) result_class = 'loss';

				expand_insert[l] = '<tr class="'+result_class+'">'+
										'<td></td>'+
										'<td>'+teams[index][0][temp_team]+'</td>'+
										'<td>'+temp_wins+'</td>'+
										'<td>'+temp_loss+'</td>'+
										'<td>'+temp_points+'</td>'+
									'</tr>';

			}
			for ( var n=0; n < count[2][0].length; n++ ){

				temp_wins = 0;
				temp_loss = count[2][1][n];
				temp_team = count[2][0][n];
				if (temp_wins === 2) temp_points = '+2';
				else if (temp_wins === 1) temp_points = '+1';
				else if (temp_wins === 0) temp_points = '+0';
				else temp_points = '+?';

				result_class = 'loss';

				expand_insert[expand_insert.length] = '<tr class="'+result_class+'">'+
										'<td>vs.</td>'+
										'<td>'+teams[index][0][temp_team]+'</td>'+
										'<td>'+temp_wins+'</td>'+
										'<td>'+temp_loss+'</td>'+
										'<td>'+temp_points+'</td>'+
									'</tr>';
			}
			// console.log(expand_insert);

			temp = expand_insert.join(' ').toString();
			// console.log(temp);
			expanded_table.append('<tbody class="for-team-'+count[0]+' hide">'+temp+'</tbody>');

			table.append('<tr id="'+index+'-'+team_win_loss[index][j][0]+'" class="color_'+team_win_loss[index][j][0]+' standings-open-close">'+
							'<td>'+(j + 1)+'</td>'+
							'<td>'+teams[index][0][team_win_loss[index][j][0]]+'</td>'+
							'<td>'+team_win_loss[index][j][1].length+'</td>'+
							'<td>'+team_win_loss[index][j][2].length+'</td>'+
							'<td>'+team_win_loss[index][j][3]+'</td>'+
						'</tr>');

		}
	});
	
}



// If we don't already have our LCS data generated
if(weeks.length <= 0) build_weeks(teams[0][0], num_weeks);

// Make some fake results for test purposes
if(results.length <= 0) build_fake_results(weeks);

// Make the schedule HTML
build_schedule(weeks, current_week);

// Make the results table
build_results_table(weeks, results, teams);




$('.standings-open-close').click(function() {
	var ids = $(this).attr('id').split('-'), league = ids[0], selected_team = ids[1], expanded_standings = $(this).parents('.league').find('.expanded-standings');
	console.log('tbody.for-team-'+selected_team);
	
	if( expanded_standings.find('tbody.for-team-'+selected_team).is(':hidden') ){
		expanded_standings.removeClass('hide');
		expanded_standings.find('tbody:visible').addClass('hide');
		expanded_standings.find('.for-team-'+selected_team).removeClass('hide');
		expanded_standings.find('h4 span').removeClass();
		expanded_standings.find('h4 span').addClass('color_'+selected_team+'_text').text(teams[league][0][selected_team]);
	}
	else {
		expanded_standings.find('tbody:visible').addClass('hide');
		expanded_standings.find('h4 span').removeClass();
		expanded_standings.addClass('hide');
	}
});