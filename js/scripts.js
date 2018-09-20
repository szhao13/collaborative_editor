/**
* Returns the difference between two strings using the longest common 
* subsequence algorithm. 
*
* @param stringX
* @param stringY
* @return 		 the same, added, and deleted characters 
*/


function diff(stringX, stringY) {
	var x = stringX.split('');
	var y = stringY.split('');

	// m is row dimension, n is column dimension 
	var m = x.length;
	var n = y.length;
	var lcs = '';
	var value = null
	// Create an LCS table where x-axis is string 1 and y-axis is string 2 to hold 
	var c = [];

	var lcsLength = 0;
	var lcsRowIndex = 0;
	var lcsColumnIndex = 0;

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

			// Look for longest LCS, update length, column and row indices if found
			// to use for backtrace
			// if (c[i][j] > lcsLength) {
			// 	// console.log("c[i][j]: " + c[i][j])
			// 	lcsLength = c[i][j];
			// 	lcsRowIndex = i;
			// 	lcsColumnIndex = j;
			// }
		}

	}


	var lcs = backtrace(c, x, y, m, n);
	// console.log(c);
	// var same = [];
	// var added = [];
	// var deleted = [];
	var result = [];
	// console.log(diff(c, x, y, m, n, same, added, deleted));
	var diffResult = findDiff(c, x, y, m, n, result);
	return diffResult;
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
		// added.push(y[j-1]);
		result.push("+" + y[j-1]);
	}
	else if (i > 0 && (j == 0 || c[i][j-1] < c[i-1][j])) {
		findDiff(c, x, y, i-1, j, result);
		// deleted.push(x[i-1]);
		result.push("-" + x[i-1]);
	}

	return result;
	// else {
	// 	console.log(" ");
	// }
}

function diffHTML() {
	var old = $("input");
	



}
// console.log(diff("XMJYAUZ", "MZJAWXU"));
// 
