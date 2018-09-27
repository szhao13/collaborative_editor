var ot = require('ot');

// Note: uses ot.js to resolve differences between two users
$(document).ready(function() {
  // var ot = require('ot');
  var old_input = "";

  // update on button click
  $("#update").click(function() {
    
    var str_1 = old_input;
    var str_2 = old_input;
    var new_input_1 = $("#textarea_1").val();
    var new_input_2 = $("#textarea_2").val();
    // get difference between old and new input for user 1 and user 2
    var diff_results_1 = diff(old_input, new_input_1, 1);
    var diff_results_2 = diff(old_input, new_input_2, 2);


    // Combine operations for user 1 
    var operation_combo_1 = diffToOT(diff_results_1, str_1);
    var s1 = operation_combo_1.apply(str_1);

    // Combine operations for user 2
    var operation_combo_2 = diffToOT(diff_results_2, str_2);
    var s2 = operation_combo_2.apply(str_2);

    var s1 = operation_combo_1.apply(old_input);
    var s2 = operation_combo_2.apply(old_input);

    // Find edits made by user 1 and user 2 
    var user_1_edits = diff(str_1, s1, 1);
    var user_2_edits = diff(str_2, s2, 2);

    // Use operational transform to resolve differences between
    // two users
    var transformedPair = ot.TextOperation.transform(operation_combo_1, operation_combo_2);
    var operation1Prime = transformedPair[0];
    var operation2Prime = transformedPair[1];

    var str12Prime = operation1Prime.apply(s2); 
    var str21Prime = operation2Prime.apply(s1);
    
    // get edits from user 2 
    var user_2_edits_on_1 = diff(s1, str21Prime, 2);


    // replace previous output with current
    // Note - the diffs for each user are displayed
    // on two different lines, due to a bug
    $("#textarea_1").val(str12Prime);
    $("#textarea_2").val(str21Prime); 

    // build new output by adding each char as a new span element of
    // the appropriate class (added, same, deleted)
    $("#output1").empty();
    $("#output2").empty();

    displayDiff(user_1_edits, 1);
    displayDiff(user_2_edits_on_1, 2);

    // Replace old input with the current output
    old_input = str12Prime;

  });
});

// Converts results of diff to a an operation for OTs
function diffToOT(diff_results, str) {
  var len = str.length;

  // the index of the output string
  var output_i = 0;

  var operation_combo = new ot.TextOperation();
  if (len != 0) {
    operation_combo
      .retain(len);
  }
  
  // iterate through diff array, add an operation to the combined
  // operation for each added and deleted character 
    // $.each(diff_results, function(diff_i, diff) {
    for (var i = 0; i < diff_results.length; i++) {

    var status = diff_results[i].status;
    var char = diff_results[i].char;
    var user = diff_results[i].user;
      if (status === "+") {
        var operation_insert = new ot.TextOperation()
          .retain(output_i)
          .insert(char)
          .retain(len - output_i);
        operation_combo = operation_combo.compose(operation_insert);
        len++;
        output_i++;
      }
      else if (status === " ") {
        output_i++;
      }
      else if (status === '-') {
        var operation_delete = new ot.TextOperation()
          .retain(output_i)
          .delete(char)
          .retain(len - output_i - 1);
        var retain_val = len - output_i - 1;
  
        operation_combo = operation_combo.compose(operation_delete);

        len--;
  
      };
    }
    return operation_combo;
};

// create elements to display diff logs
// Note: diff logs for user 1 and user 2 are on separate lines due to a 
// bug. 
function displayDiff(diff_results, user) {
  for (var i = 0; i < diff_results.length; i++) {
    var status = diff_results[i].status;
    var char = diff_results[i].char;
    var user = user;
    var add_char = "";
    if (status === "+") {
      add_char = "<span class=\"added" + user + "\">" + char + "</span>";
      if (user === 1) {
        $("#output1").append(add_char);
      }
      else {
        $("#output2").append(add_char);

      }
    }
    else if (status === " ") {
      add_char = "<span class=\"same\">" + char + "</span>";
      if (user === 1) {
        $("#output1").append(add_char);
      }
      else {
        $("#output2").append(add_char);

      }
    }
    else if (status === '-') {
      add_char =  "<span class=\"deleted" + user + "\">" + char + "</span>";
      if (user === 1) {
        $("#output1").append(add_char);
      }
      else {
        $("#output2").append(add_char);
      }
    }
  };


};


// defines an object that contains each char of the diff'd string
// status is either "+", "-", " " for added, deleted or no change respectively
// User is either 0, 1 or 2, for unchanged, edited by user 1
// or edited by user 2, respectively
function DiffResult(status, char, user) {
  this.status = status;
  this.char = char;
  this.user = user;
}
/**
* Returns the difference between two strings using the longest common 
* subsequence algorithm. 
*
*
* @param stringX
* @param stringY
* @return      same, added and deleted characters in order of appearance
*
* Note: returns an array of strings where the second char is the diff'ed char
* and the first char is '+', '-', or ' ' to indicate whether the second
* char is added, deleted or the same character, respectively.
* 
* Ex: 
* console.log(diff("XMJYAUZ", "MZJAWXU"))
* // Prints ["-X", " M", "+Z", " J", "-Y", " A", "+W", "+X", " U", "-Z"]    
**/

function diff(stringX, stringY, user) {
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

    }

  }

  lcs = backtrace(c, x, y, m, n);

  var results = [];
  var diff_results = findDiff(c, x, y, m, n, results, user);

  // for (var i = 0; i < diff_result.length; i++) {
  //   if (diff_result[i][])
  // }
  // console.log(diff_results);
  return diff_results;
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
function findDiff(c, x, y, i, j, results, user) {
  if (i > 0 && j > 0 && x[i-1] === y[j-1]) {
    findDiff(c, x, y, i-1, j-1, results, user);
    diff_result = new DiffResult();
    diff_result.char = x[i-1];
    diff_result.status = " ";
    diff_result.user = 0;
    results.push(diff_result);
  }
  else if (j > 0 && (i == 0 || c[i][j-1] >= c[i-1][j])) {
    findDiff(c, x, y, i, j-1, results, user);
    diff_result = new DiffResult();
    diff_result.char = y[j-1];
    diff_result.status = "+";
    diff_result.user = user;
    results.push(diff_result);

  }
  else if (i > 0 && (j == 0 || c[i][j-1] < c[i-1][j])) {
    findDiff(c, x, y, i-1, j, results, user);
    diff_result = new DiffResult();
    diff_result.char = x[i-1];
    diff_result.status = "-";
    diff_result.user = user;
    results.push(diff_result);   
  }

  return results;

}