

$(document).ready(function() {
	// var old_text = $("#output").text();
	var old_input = "";
	$("#update").click(function() {
		// diff(old_text, $("#input").text());
		// console.log("old text is " + old_input);
		var new_input = $("#input").val();

		// get difference between old and new input
		var diff_result = diff(old_input, new_input);

		// empty previous output
		$("#output").empty();

		// build new output by adding each char as a new span element of
		// the appropriate class (added, same, deleted)
		$.each(diff_result, function(index, value) {
			var add_char = ""
			if (value[0] === "+") {
				add_char = "<span class=\"added\">" + value[1] + "</span>";
				$("#output").append(add_char);
			}
			else if (value[0] === " ") {
				add_char = "<span class=\"same\">" + value[1] + "</span>";
				$("#output").append(add_char);
			}
			else if (value[0] === '-') {
				add_char =  "<span class=\"deleted\">" + value[1] + "</span>";
				$("#output").append(add_char);
			}
		});
		// $("#old_text").text($("#input").val());

		old_input = new_input;

	});
});

/**
* Returns the difference between two strings using the longest common 
* subsequence algorithm. 
*
*
* @param stringX
* @param stringY
* @return 		 same, added and deleted characters in order of appearance
*
* Note: returns an array of strings where the second char is the diff'ed char
* and the first char is '+', '-', or ' ' to indicate whether the second
* char is added, deleted and same character, respectively.
* 
* Ex: 
* console.log(diff("XMJYAUZ", "MZJAWXU"))
* // Prints ["-X", " M", "+Z", " J", "-Y", " A", "+W", "+X", " U", "-Z"]		
**/

// outputs an array of strings, where the first char in the string is eit
function diff(stringX, stringY) {
	var x = stringX.split('');
	var y = stringY.split('');

	// m is row dimension, n is column dimension 
	var m = x.length;
	var n = y.length;
	var lcs = '';
	// Create an LCS table where x-axis is string 1 and y-axis is string 2 to hold 
	var c = [];


	// calculate LCS table via dynamic programming
	for (var i = 0; i <= m; i++) {
		c[i] = [];
		for (var j = 0; j <= n; j++) {
			if (i === 0 || j === 0) {
				c[i][j] = 0;
			}
			else if (x[i-1] === y[j-1]) {
				c[i][j] = c[i - 1][j - 1] + 1;
			}
			else {
				c[i][j] = Math.max(c[i-1][j], c[i][j-1]);
			}
			// console.log(c);

		}

	}

	lcs = backtrace(c, x, y, m, n);

	var result = [];
	var diff_result = findDiff(c, x, y, m, n, result);
	console.log(diff_result);
	return diff_result;
}

// Recursively backtrace through lcs array
function backtrace(c, x, y, i, j) {
	if (i === 0 || j === 0) {
		return ''
	}
	if (x[i - 1] === y[j - 1]) {
		return backtrace(c, x, y, i-1, j-1) + x[i-1];
	}
	if (c[i][j-1] > c[i-1][j]) {
		return backtrace(c, x, y, i, j-1);
	}
	return backtrace(c, x, y, i-1, j);
}

// Recursively find same, added and deleted characters
function findDiff(c, x, y, i, j, result) {
	if (i > 0 && j > 0 && x[i-1] === y[j-1]) {
		findDiff(c, x, y, i-1, j-1, result);
		result.push(" " + x[i-1]);
	}
	else if (j > 0 && (i == 0 || c[i][j-1] >= c[i-1][j])) {
		findDiff(c, x, y, i, j-1, result);
		result.push("+" + y[j-1]);
	}
	else if (i > 0 && (j == 0 || c[i][j-1] < c[i-1][j])) {
		findDiff(c, x, y, i-1, j, result);
		result.push("-" + x[i-1]);
	}

	return result;

}

// function diffHTML() {
// 	var old = $("input");




// }
// console.log(diff("XMJYAUZ", "MZJAWXU"));
// 
