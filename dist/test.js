"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegExMaker = void 0;
exports.RegMake = RegMake;
var _utils = require("./utils");
var _types = require("./types");
/**
 * A utility for generating and managing dynamic regular expressions to be used during runtime if needed.
 * @method {@link create_exp} - Creates a new regular expression from a desired example and optional flags.(replaces any existing saved regular expression)
 * @method {@link exec}  - Executes the current regex against a given string.
 * @method {@link replace} - Replaces parts of a string based on the current regex.
 * @method {@link merge_exp} - creates a new regex expression and combines it with an existing regex expression 
 * 
 * {@link regexMap} - all default regex expressions you can reference in create_exp and merge_exp to add to your final regex pattern.
 * 
 * {@link usersMap} - custom regex expressions(will be in the same form as regexMap)you can edit and add any custom regex expressions you may want to capture in runtime. Treat it as another regexDict that isn't restricted by default types. 
 * 
 * **(Class values you can reference)**
 * @param {string} [current_regex] - The default pattern for the regular expression.
 * @param {string[]} [flags] - default flags in an array: (e.g., "g", "i", "m").
 */
class RegExMaker {
  //readonly makes it uneditable after first class declaration
  regexMap = {
    any_number: '\\d+',
    any_char: '.*?',
    any_word: '\\w+',
    lowercase_word: '[a-z]+',
    uppercase_word: '[A-Z]+',
    first_word: '[A-Za-z]+',
    alphanumeric: '[a-zA-Z0-9]+',
    non_alphanumeric: '[^a-zA-Z0-9]+',
    neg_positive_number: '[+-]?\\d+(\\.\\d+)?',
    hex: '[A-Fa-f0-9]+',
    ascii: '[\\x20-\\x7E]+'
  };
  usersMap = {};
  //add your own key and values for regex expression

  constructor() {
    this.current_regex = new RegExp(`//`);
    this.flags = [''];
  }

  // Creating custom regex based on dynamic input
  /**
  * Creates a dynamic regex pattern based on your desired provided example and value attributes.      
  * For combined documentation: [Docs](https://github.com)
  * 
  * *  #### Example:
  * ```
  *const regexMaker = RegMake()
  *let value_attr = { any_number: ["2"], any_word: 'p' }
  *const firstExample = "p-[2rem]"
  *regexMaker.create_exp(firstExample, value_attr, true, ['g'])
  *console.log(regexMaker.current_regex)
  * //Output:
  * "/(\w+)-\[(\d+)rem\]/g"
  * ```
  * @param desired_example - An example of a string you want to capture and manipulate with the preceding params.
  * @param value_attr - A dictionary of keys that must match any type and values defined in regexMap in the class
  * See {@link regexMap} for required keys and values. 
  * @param capture_values - **(Optional)** Whether to capture the values as groups defined in your value_attr
  * See {@link RequiredFlags} for required type. 
  * @param flags - **(Optional)** An array of regex flags (e.g., 'g', 'i') you want to add to be match
  * @param newTypes - **(Optional)** user-defined types, this is the same as value attr for expected type injection, but **ONLY** will use your added custom types in usersMap
  * 
  * @returns The final regex pattern as a string(you can also reference this value from `current_regex`)
  * 
  *
  */
  create_exp(desired_example, value_attr, capture_values = false, flags, newTypes) {
    let inserted_EXP = desired_example;
    let final_EXP = '';
    let filled_indices = {};
    try {
      (0, _utils.insertRegexCharacters)(value_attr, this.regexMap, inserted_EXP, filled_indices);
      if (newTypes) {
        (0, _utils.insertRegexCharacters)(newTypes, this.regexMap, inserted_EXP, filled_indices);
      }
      let orig_str_index = 0;
      while (orig_str_index < inserted_EXP.length) {
        if (!filled_indices[orig_str_index]) {
          const char = inserted_EXP[orig_str_index];
          final_EXP += _types.specialCharacterDict[char] ? '\\' + char : char;
          orig_str_index++;
        } else {
          const [start, end, regexKey] = filled_indices[orig_str_index];
          const pattern = this.regexMap[regexKey] || this.usersMap[regexKey];
          if (pattern) {
            final_EXP += capture_values ? `(${pattern})` : pattern;
          }
          orig_str_index = end;
        }
      }
      this.current_regex = new RegExp(final_EXP, (flags === null || flags === void 0 ? void 0 : flags.join('')) || '');
      return final_EXP;
    } catch (error) {
      console.error("Error in create_exp:", error);
      return '';
    }
  }
  /**
   * takes in a key and value string param which adds to the usersMap dictionary
   * Instead of this function, you can directly manipulate the usersMap like:
   * ```
   * const regexMaker = RegMake()
   * regexMaker.usersMap["only_example"] ="\b\w+(?=\s+example\b)"
   * console.log(regexMaker.usersMap)
   *  ```
   
  **/
  add_custom(key, value) {
    this.usersMap[key] = value;
  }
  /**
  * Retrieves the custom regex patterns.
  * 
  * Instead of this function, you can directly manipulate the usersMap like:
  * ```
  * const regexMaker = RegMake()
  * regexMaker.usersMap["only_example"] ="\b\w+(?=\s+example\b)"
  * console.log(regexMaker.usersMap)
  *  ```
  * @returns {regexDict} - The custom regex patterns.
  */
  get_custom() {
    return this.usersMap;
  }
  /**
   * Removes a custom regex pattern from the usersMap dictionary.
   * 
   * Instead of this function, you can directly manipulate the usersMap like:
   * ```
   * const regexMaker = RegMake()
   * regexMaker.usersMap["only_example"] ="\b\w+(?=\s+example\b)"
   * console.log(regexMaker.usersMap)
   *  ```
   * @param {string} key - The key for the custom regex pattern to remove.
   */
  remove_custom(key) {
    delete this.usersMap[key];
  }
  /**
   * Merges a new regex pattern with the existing regex pattern.
   * if there is no existing pattern. then it creates one.
   *    #### Example:
  * ```
  *const regexMaker = RegMake()
  *
  *let value_attr = { any_number: ["2"]}
  *const firstRegex = "p-[2rem]"
  *regexMaker.create_exp(firstRegex, value_attr, true, ['g'])
    *value_attr = { any_number: ["90"] };
  *const secondRegex = "w-[90%]";
  *regexMaker.merge_exp(secondRegex, value_attr, true,);
    *value_attr = { any_number: ["500"] }
  *const thirdRegex = "bg-indigo-500"
  *regexMaker.merge_exp(thirdRegex, value_attr, true, ['g'])
    *const input = "p-[4rem] w-[40%] bg-indigo-500";
  * 
  *console.log(regexMaker.current_regex)
  * //see matchAll to see logic behind output
  *console.log(regexMaker.matchAll(input, true))
  * //Output:
  * R'/p-\[(\d+)rem\]|w-\[(\d+)%\]|bg-indigo-(\d+)/g
  * [ '4', '40', '500' ]
  * 
  * ```
   * @param {string} desired_example - An example of a string you want to capture and manipulate with the preceding params.
   * @param {regexDict} value_attr - A dictionary of keys that must match any type and values defined in regexMap in the class.
   * @param {boolean} [capture_values=false] - Whether to capture the values as groups defined in your value_attr.
   * @param {string[]} [flags] - An array of regex flags (e.g., 'g', 'i') you want to add to be matched.
   * @param {regexDict} [newTypes] - User-defined types, all types must be added via add_custom() function before using them here.
   * @returns {RegExp} - The combined regex pattern.
   */
  merge_exp(desired_example, value_attr, capture_values = false, flags, newTypes) {
    if (!desired_example) {
      return;
    }
    if (this.current_regex) {
      const old_regex = this.current_regex.source;
      this.create_exp(desired_example, value_attr, capture_values, flags, newTypes);
      const new_regex = this.current_regex.source;
      this.current_regex = new RegExp(`${old_regex}|${new_regex}`, (flags === null || flags === void 0 ? void 0 : flags.join('')) || '');
    } else {
      this.create_exp(desired_example, value_attr, capture_values, flags, newTypes);
    }
    return this.current_regex;
  }
  /**
   * Tests if the current regex matches a given string.
   * @param {string} stringVal - The string to test against the current regex.
   * @returns {boolean}[True ] - True if the string matches the regex, false otherwise.
   */
  test(stringVal) {
    return this.current_regex.test(stringVal);
  }
  /**
  * Matches the current regex against a given string.
  * @param {string} stringVal - The string to match against the current regex.
  * @returns {string[]} - The matched values.
  */
  match(stringVal) {
    console.log(this.current_regex);
    const matchedVal = stringVal.match(this.current_regex);
    if (matchedVal) {
      return matchedVal;
    }
    return [''];
  }
  /**
   * Executes the current regex against a given string.
   * @param {string} stringVal - The string to execute the regex against.
   * @returns {string[]} - The matched values.
   */
  exec(stringVal) {
    const matchedVal = this.current_regex.exec(stringVal);
    if (matchedVal) {
      return matchedVal;
    }
    return [''];
  }
  /**
  * Matches all occurrences of the current regex in a given string and optionally retrieves capture groups.
  * @param {string} stringVal - The string to match against the current regex.
  * @param {boolean} fetchCaptures - true-> will capture only groups, false->captures every defined value.
  * @returns {string[]} - The matched values
  */
  matchAll(stringVal, fetchCaptures) {
    const matches = Array.from(stringVal.matchAll(this.current_regex));
    if (fetchCaptures) {
      return matches.map(m => m.slice(1)).flat().filter(val => val !== undefined);
    }

    // Return full matches and their capture groups
    return matches.map(m => m.filter(val => val !== undefined)) // Filter undefined values from full match and capture groups
    .flat();
  }
  /**
  * Replaces parts of a string based on the current regex.
  * @param {string} stringVal - The string to perform the replacement on.
  * @param {string} groups - The replacement string or a function that returns the replacement string.
  * @param {RegExp} [desired_regex] - An optional regex pattern to use instead of the current regex.
  * @returns {string} - The modified string with replacements.
  */
  replace(stringVal, groups, desired_regex) {
    //allows to return 
    return stringVal.replace(desired_regex ? desired_regex : this.current_regex, groups);
  }
}
/**
 * Creates and returns a new instance of the {@link RegExMaker} class.
 * 
 * For more info: [Documentation](https://github.com)
 */
exports.RegExMaker = RegExMaker;
function RegMake() {
  return new RegExMaker();
}

// Create an instance of RegExMaker
// const regexMaker = RegMake()

// let value_attr = { any_number: ["2"]}
// const firstRegex = "p-[2rem]"
// regexMaker.create_exp(firstRegex, value_attr, true, ['g'])

// value_attr = { any_number: ["90"] };
// const secondRegex = "w-[90%]";
// regexMaker.merge_exp(secondRegex, value_attr, true,);

// value_attr = { any_number: ["500"] }
// const thirdRegex = "bg-indigo-500"
// regexMaker.merge_exp(thirdRegex, value_attr, true, ['g'])

// const input = "p-[4rem] w-[40%] bg-indigo-500";

// console.log(regexMaker.current_regex)
// //see matchAll to see logic behind output
// console.log(regexMaker.matchAll(input, true))

// regexMaker.add_custom("add_value", "\\w{10}")
// const regex1 = regexMaker.create_exp("(1232151913)", value_attr,true, ['g'], {"add_value": "1232151913"});
// console.log(regexMaker.usersMap)
// console.log(regexMaker.current_regex)
// console.log(regexMaker.exec('(1231233129)'))

//note that we want to record the expected runtime of this whole thing below:
//for accessing the dict ->
// //o(m)(o(n)) where n is the size of teh dictionary which we loop, and  n is the size of the list of the keys