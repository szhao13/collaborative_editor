var ot = require('ot');

$(document).ready(function() {
  // var ot = require('ot');
  var old_input = "";

  // update on button click
  $("#update").click(function() {
    
    var str_1 = old_input;
    var str_2 = old_input;
    var new_input_1 = $("#textarea_1").val();
    var new_input_2 = $("#textarea_2").val();
    console.log("old input is " + old_input);
    // get difference between old and new input for user 1 and user 2
    var diff_result_1 = diff(old_input, new_input_1);
    var diff_result_2 = diff(old_input, new_input_2);

    // console.log("diff result 1 is " + diff_result_1);
    var operation_combo_1 = diffToOT(diff_result_1, str_1);
    var s1 = operation_combo_1.apply(str_1);
    // console.log("operation for user 1 is " + operation_combo_1);
    // var operation_combo_2 = new ot.TextOperation()
    //   .retain(0);
    var operation_combo_2 = diffToOT(diff_result_2, str_2);
    var s2 = operation_combo_2.apply(str_2);

    // console.log("operation for user 2 is " + operation_combo_2);


    var s1 = operation_combo_1.apply(old_input);
    var s2 = operation_combo_2.apply(old_input);
    var user_1_edits = diff(str_1, s1);
    var user_2_edits = diff(str_2, s2);

    var transformedPair = ot.TextOperation.transform(operation_combo_1, operation_combo_2);
    var operation1Prime = transformedPair[0];
    var operation2Prime = transformedPair[1];
    // console.log("1 Prime is " + operation1Prime);
    // console.log("2 Prime is " + operation2Prime); 
    // console.log("operation2prime's base length is " + operation2Prime.baseLength);
    // console.log("old_input's length is " + old_input.length);
    var str12Prime = operation1Prime.apply(s2); // "ipsum dolor"
    var str21Prime = operation2Prime.apply(s1);
    
    var user_2_edits_on_1 = diff(s1, str21Prime);

    console.log(user_2_edits_on_1);

    console.log("str12Prime is " + str12Prime);
    console.log("str21Prime is " + str21Prime);

    


    // empty previous output
    $("#textarea_1").val(str12Prime);
    $("#textarea_2").val(str12Prime); 


    // apply changes found by diff to operation

    // build new output by adding each char as a new span element of
    // the appropriate class (added, same, deleted)
    $("#output").empty();
    displayDiff(user_1_edits, 2);
    old_input = str12Prime;

    console.log("old_input at end of update is " + old_input);
  });
});

// Converts results of diff to a TextOperation object for OT 
function diffToOT(diff_result, str) {
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
    $.each(diff_result, function(diff_i, value) {
      
      if (value[0] === "+") {
        var operation_insert = new ot.TextOperation()
          .retain(output_i)
          .insert(value[1])
          .retain(len - output_i);

        operation_combo = operation_combo.compose(operation_insert);
        len++;
        output_i++;
      }
      else if (value[0] === " ") {
        output_i++;
      }
      else if (value[0] === '-') {
        var operation_delete = new ot.TextOperation()
          .retain(output_i)
          .delete(value[1])
          .retain(len - output_i - 1);
        var retain_val = len - output_i - 1;
        console.log("operation delete is " + operation_delete);
        console.log("number of chars remaining in str after delete is " + retain_val);
        console.log("combined operation before compose is " + operation_combo);

        operation_combo = operation_combo.compose(operation_delete);

        len--;
  
      }
    });
    return operation_combo;
};


function displayDiff(diff_result, user) {
  console.log("we get to displayDiff");
  $.each(diff_result, function(index, value) {
    var add_char = "";
    if (value[0] === "+") {
      add_char = "<span class=\"added" + user + "\">" + value[1] + "</span>";
      console.log("added element is " + add_char);
      $("#output").append(add_char);
    }
    else if (value[0] === " ") {
      add_char = "<span class=\"same\">" + value[1] + "</span>";
      $("#output").append(add_char);
    }
    else if (value[0] === '-') {
      add_char =  "<span class=\"deleted" + user + "\">" + value[1] + "</span>";
      $("#output").append(add_char);
    }
  });


};

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

  // for (var i = 0; i < diff_result.length; i++) {
  //   if (diff_result[i][])
  // }
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