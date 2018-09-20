//1. Find C table
/**
 * @param {string} string1
 * @param {string} string2
 * @return {string}
 */
 // m is row dimension, n is column dimension 
 // uses dynamic programming and longest common subsequence alg
function diff(stringX, stringY) {
	var x = stringX.split('');
	var y = stringY.split('');

	// if (x)
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
			if (c[i][j] > lcsLength) {
				// console.log("c[i][j]: " + c[i][j])
				lcsLength = c[i][j];
				lcsRowIndex = i;
				lcsColumnIndex = j;
			}
		}

	}

	// console.log(c)

	var lcs = backtrace(c, x, y, m, n);

	// console.log(c);

	// console.log(lcs);
	// console.log(lcsColumnIndex)
	// console.log(lcsLength)
	var same = [];
	var added = [];
	var deleted = [];
	// console.log(diff(c, x, y, m, n, same, added, deleted));
	var diffResult = findDiff(c, x, y, m, n, same, added, deleted);
	return diffResult;
}

// recursive function to backtrace through lcs array
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


function findDiff(c, x, y, i, j, same, added, deleted) {
	if (i > 0 && j > 0 && x[i-1] === y[j-1]) {
		findDiff(c, x, y, i-1, j-1, same, added, deleted);
		same.push(x[i-1]);
		// console.log(" " + x[i-1]);
	}
	else if (j > 0 && (i == 0 || c[i][j-1] >= c[i-1][j])) {
		findDiff(c, x, y, i, j-1, same, added, deleted);
		added.push(y[j]);
		// console.log("+ " + y[j]);
	}
	else if (i > 0 && (j == 0 || c[i][j-1] < c[i-1][j])) {
		findDiff(c, x, y, i-1, j, same, added, deleted);
		deleted.push(x[i-1]);
		// console.log("- " + x[i-1]);
	}

	return {same: same, added: added, deleted: deleted};
	// else {
	// 	console.log(" ");
	// }
}

console.log(diff("XMJYAUZ", "MZJAWXU"));
// 
