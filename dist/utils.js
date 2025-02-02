"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertRegValues = insertRegValues;
//function for splicing the string based on the inputted regex value

function insertRegValues(inserted_EXP, current_value, desired_value, filled_indices, regex_character) {
  // Find the start index of the current_value in the desired_example string
  const startIndex = inserted_EXP.indexOf(current_value);
  if (startIndex != -1) {
    // Skip if the value is not found
    // Calculate the end index of the current index string
    const inputEnd = startIndex + current_value.length;
    const expressionEnd = startIndex + desired_value.length;
    // Replace the matched portion with the desired regex pattern
    inserted_EXP = inserted_EXP.slice(0, startIndex) + desired_value + inserted_EXP.slice(inputEnd);
    filled_indices[startIndex] = [startIndex, expressionEnd, regex_character];
  }
}