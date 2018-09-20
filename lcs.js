//1. Find C table
/**
 * @param {string} string1
 * @param {string} string2
 * @return {string}
 */
 // m is row dimension, n is column dimension 
 // uses dynamic programming and longest common subsequence alg
function lcs(stringX, stringY) {
	var x = stringX.split('');
	var y = stringY.split('');

	// if (x)
	var m = x.length;
	var n = y.length;
	var lcs = '';
	var value = null
	// Create an LCS table where x-axis is string 1 and y-axis is string 2 to hold 
	var c = [...Array(n + 1).fill(value)].map(e => Array(m + 1).fill(value));
	

	// Fill first column with 0s
	// i is row index
	for (var i = 0; i < n + 1; i++) {
		c[i][0] = 0;
	};

	// Fill first row with 0s
	// j is column index
	for (var j = 0; j < m + 1; j++) {
		c[0][j] = 0
	};

	var lcsLength = 0;
	var lcsRowIndex = 0;
	var lcsColumnIndex = 0;

	// calculate LCS table via dynamic programming
	for (var i = 1; i < m + 1; i++) {
		for (var j = 1; j < n + 1; j++) {
			if (x[i-1] === y[j-1]) {
				c[i][j] = c[i - 1][j - 1] + 1;
			}
			else {
				c[i][j] = Math.max(c[i][j - 1], c[i - 1][j]);
			}

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

	// no LCS found
	if (lcsLength == 0) {
		return '';
	}
	// console.log(c)

	var lcs = backtrace(c, x, y, m, n);



	// // console.log(c)
	// console.log(lcsRowIndex)
	// console.log(lcsColumnIndex)
	// console.log(lcsLength)
	return lcs

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
//3. Print diff

console.log(lcs("xmjyauz", "mzjawxu"))