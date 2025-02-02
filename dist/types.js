"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.specialCharacterDict = void 0;
//types to build regex, required flags for flags, special characters to escape, 

//helper to build regex by keepign special characters

//used to maintain regex creation for special characters
const specialCharacterDict = exports.specialCharacterDict = {
  '(': true,
  ')': true,
  '[': true,
  ']': true,
  '{': true,
  '}': true,
  '.': true,
  '*': true,
  '+': true,
  '?': true,
  '^': true,
  '$': true,
  '|': true
};

//user type that needs to be exported in order to use RegExMaker class

//you can add values that arent present inside,