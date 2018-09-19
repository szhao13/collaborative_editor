//1. Find C table
/**
 * @param {string} string1
 * @param {string} string2
 * @return {string}
 */
function lcs(string1, string2) {
	var s1 = string1.split('');
	var s2 = string2.split('');

	var value = "foo";
	// Create LCS 2D Array 
	var substring2DArray = [...Array(s2.length + 1).fill(value)].map(e => Array(s1.length + 1).fill(value));
	console.log(substring2DArray)

	// Fill first column with 0s
	// for (var i = 0, i < s2.length, i++) {
	// 	substring2DArray[]
	// }

}
//3. Print diff

lcs("abcd", "def")