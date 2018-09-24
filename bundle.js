(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

// var StringBinding = require('sharedb-string-binding');
var unique = require('uniq');

var data = [1, 2, 2, 3, 4, 5, 5, 5, 6];

console.log(unique(data));

$(document).ready(function() {
  // var ot = require('ot');
  var old_input = "";
  // update on button click
  $("#update").click(function() {
    var new_input_1 = $("#input_1").val();
    var new_input_2 = $("#input_2").val();

    // get difference between old and new input
    var diff_result = diff(old_input, new_input_1);

    // empty previous output
    $("#output").empty();

    // build new output by adding each char as a new span element of
    // the appropriate class (added, same, deleted)
    $.each(diff_result, function(index, value) {
      var jsonDiff = {}
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

    old_input = new_input;

  });
});

// function dynamicallyLoadScript(url) {
//     var script = document.createElement("script"); //Make a script DOM node
//     script.src = url; //Set it's src to the provided URL
//     document.head.appendChild(script); //Add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
// }
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
//  var old = $("input");




// }
// console.log(diff("XMJYAUZ", "MZJAWXU"));
// 
},{"uniq":2}],2:[function(require,module,exports){
"use strict"

function unique_pred(list, compare) {
  var ptr = 1
    , len = list.length
    , a=list[0], b=list[0]
  for(var i=1; i<len; ++i) {
    b = a
    a = list[i]
    if(compare(a, b)) {
      if(i === ptr) {
        ptr++
        continue
      }
      list[ptr++] = a
    }
  }
  list.length = ptr
  return list
}

function unique_eq(list) {
  var ptr = 1
    , len = list.length
    , a=list[0], b = list[0]
  for(var i=1; i<len; ++i, b=a) {
    b = a
    a = list[i]
    if(a !== b) {
      if(i === ptr) {
        ptr++
        continue
      }
      list[ptr++] = a
    }
  }
  list.length = ptr
  return list
}

function unique(list, compare, sorted) {
  if(list.length === 0) {
    return list
  }
  if(compare) {
    if(!sorted) {
      list.sort(compare)
    }
    return unique_pred(list, compare)
  }
  if(!sorted) {
    list.sort()
  }
  return unique_eq(list)
}

module.exports = unique

},{}]},{},[1]);
