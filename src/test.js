"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegMake = RegMake;
var types_1 = require("./types");
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
var RegExMaker = /** @class */ (function () {
    //add your own key and values for regex expression
    function RegExMaker() {
        //readonly makes it uneditable after first class declaration
        this.regexMap = {
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
            ascii: '[\\x20-\\x7E]+',
        };
        this.usersMap = {};
        this.current_regex = new RegExp("//");
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
    *value_attr = { any_number: ["2"], any_word: 'p' }
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
    RegExMaker.prototype.create_exp = function (desired_example, value_attr, capture_values, flags, newTypes) {
        if (capture_values === void 0) { capture_values = false; }
        var inserted_EXP = desired_example;
        var final_EXP = '';
        var filled_indices = {};
        try {
            for (var _i = 0, _a = Object.keys(value_attr); _i < _a.length; _i++) {
                var regex_character = _a[_i];
                var desired_value = this.regexMap[regex_character];
                var current_value = value_attr[regex_character];
                if (!desired_value || !current_value)
                    continue;
                if (typeof current_value === "string") {
                    var startIndex = inserted_EXP.indexOf(current_value);
                    if (startIndex === -1)
                        continue;
                    var inputEnd = startIndex + current_value.length;
                    filled_indices[startIndex] = [startIndex, inputEnd, regex_character];
                }
                else {
                    for (var _b = 0, current_value_1 = current_value; _b < current_value_1.length; _b++) {
                        var value_to_change = current_value_1[_b];
                        var startIndex = inserted_EXP.indexOf(value_to_change);
                        if (startIndex === -1)
                            continue;
                        var inputEnd = startIndex + value_to_change.length;
                        filled_indices[startIndex] = [startIndex, inputEnd, regex_character];
                    }
                }
            }
            if (newTypes) {
                for (var _c = 0, _d = Object.keys(newTypes); _c < _d.length; _c++) {
                    var regex_character = _d[_c];
                    console.log("reg", regex_character);
                    var desired_value = this.usersMap[regex_character];
                    var current_value = newTypes[regex_character];
                    if (!desired_value || !current_value)
                        continue;
                    if (typeof current_value === "string") {
                        var startIndex = inserted_EXP.indexOf(current_value);
                        if (startIndex === -1)
                            continue;
                        var inputEnd = startIndex + current_value.length;
                        filled_indices[startIndex] = [startIndex, inputEnd, regex_character];
                    }
                    else {
                        for (var _e = 0, current_value_2 = current_value; _e < current_value_2.length; _e++) {
                            var value_to_change = current_value_2[_e];
                            var startIndex = inserted_EXP.indexOf(value_to_change);
                            if (startIndex === -1)
                                continue;
                            var inputEnd = startIndex + value_to_change.length;
                            filled_indices[startIndex] = [startIndex, inputEnd, regex_character];
                        }
                    }
                }
            }
            var orig_str_index = 0;
            while (orig_str_index < inserted_EXP.length) {
                if (!filled_indices[orig_str_index]) {
                    var char = inserted_EXP[orig_str_index];
                    final_EXP += types_1.specialCharacterDict[char] ? '\\' + char : char;
                    orig_str_index++;
                }
                else {
                    var _f = filled_indices[orig_str_index], start = _f[0], end = _f[1], regexKey = _f[2];
                    var pattern = this.regexMap[regexKey] || this.usersMap[regexKey];
                    if (pattern) {
                        final_EXP += capture_values ? "(".concat(pattern, ")") : pattern;
                    }
                    orig_str_index = end;
                }
            }
            this.current_regex = new RegExp(final_EXP, (flags === null || flags === void 0 ? void 0 : flags.join('')) || '');
            return final_EXP;
        }
        catch (error) {
            console.error("Error in create_exp:", error);
            return '';
        }
    };
    /**
     * takes in a key and value string param which adds to the usersMap dictionary
     * Instead of this function, you can directly manipulate the usersMap like:
     * ```
     * const regexMaker = RegMake()
     * regexMaker.usersMap["only_example"] ="\b\w+(?=\s+example\b)"
     * console.log(regexMaker.usersMap)
     *  ```
     
    **/
    RegExMaker.prototype.add_custom = function (key, value) {
        this.usersMap[key] = value;
    };
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
    RegExMaker.prototype.get_custom = function () {
        return this.usersMap;
    };
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
    RegExMaker.prototype.remove_custom = function (key) {
        delete this.usersMap[key];
    };
    /**
     * Merges a new regex pattern with the existing regex pattern.
     * if there is no existing pattern. then it creates one.
     *    #### Example:
    * ```
    *const regexMaker = RegMake()
    *
    *value_attr = { any_number: ["2"]}
    *const firstRegex = "p-[2rem]"
    *regexMaker.create_exp(firstRegex, value_attr, true, ['g'])

    *value_attr = { any_number: ["90"] };
    *const secondRegex = "w-[90%]";
    *regexMaker.merge_exp(secondRegex, value_attr, true,);

    *value_attr = { any_number: ["500"] }
    *const thirdRegex = "bg-indigo-500"
    *regexMaker.merge_exp(anotherExample, value_attr, true, ['g'])

    *const input = "p-[4rem] w-[40%] bg-indigo-500";
    *
    *console.log(regexMaker.current_regex)
    * //see matchAll to see logic behind output
    *console.log(regexMaker.matchAll(input, true))
    * //Output:
    * R'/(\w+)-\[(\d+)rem\]|(\w+)-\[(\d+)%\]|bg-(\w+)-(\d+)/g
    * [ 'p', '4', 'w', '40', 'indigo', '500' ]
    *
    * ```
     * @param {string} desired_example - An example of a string you want to capture and manipulate with the preceding params.
     * @param {regexDict} value_attr - A dictionary of keys that must match any type and values defined in regexMap in the class.
     * @param {boolean} [capture_values=false] - Whether to capture the values as groups defined in your value_attr.
     * @param {string[]} [flags] - An array of regex flags (e.g., 'g', 'i') you want to add to be matched.
     * @param {regexDict} [newTypes] - User-defined types, all types must be added via add_custom() function before using them here.
     * @returns {RegExp} - The combined regex pattern.
     */
    RegExMaker.prototype.merge_exp = function (desired_example, value_attr, capture_values, flags, newTypes) {
        if (capture_values === void 0) { capture_values = false; }
        if (desired_example && this.current_regex) {
            var old_regex = this.current_regex;
            this.create_exp(desired_example, value_attr, capture_values, flags, newTypes);
            // Ensure old_regex is properly formatted before merging
            var oldRegexSource = old_regex instanceof RegExp ? old_regex.source : old_regex;
            var oldFlags = this.flags;
            var newRegexSource = this.current_regex instanceof RegExp ? this.current_regex.source : this.current_regex;
            this.flags.concat(oldFlags);
            // Preserve flags if necessary
            var combinedRegex = new RegExp("".concat(oldRegexSource, "|").concat(newRegexSource), flags ? flags.join('') : '');
            this.current_regex = combinedRegex;
            console.log(this.current_regex);
            return this.current_regex;
        }
        else {
            this.create_exp(desired_example, value_attr, capture_values, flags, newTypes);
        }
    };
    /**
     * Tests if the current regex matches a given string.
     * @param {string} stringVal - The string to test against the current regex.
     * @returns {boolean}[True ] - True if the string matches the regex, false otherwise.
     */
    RegExMaker.prototype.test = function (stringVal) {
        return this.current_regex.test(stringVal);
    };
    /**
    * Matches the current regex against a given string.
    * @param {string} stringVal - The string to match against the current regex.
    * @returns {string[]} - The matched values.
    */
    RegExMaker.prototype.match = function (stringVal) {
        console.log(this.current_regex);
        var matchedVal = stringVal.match(this.current_regex);
        if (matchedVal) {
            return matchedVal;
        }
        return [''];
    };
    /**
     * Executes the current regex against a given string.
     * @param {string} stringVal - The string to execute the regex against.
     * @returns {string[]} - The matched values.
     */
    RegExMaker.prototype.exec = function (stringVal) {
        var matchedVal = this.current_regex.exec(stringVal);
        if (matchedVal) {
            return matchedVal;
        }
        return [''];
    };
    /**
 * Matches all occurrences of the current regex in a given string and optionally retrieves capture groups.
 * @param {string} stringVal - The string to match against the current regex.
 * @param {boolean} fetchCaptures - true-> will capture only groups, false->captures every defined value.
 * @returns {string[]} - The matched values
 */
    RegExMaker.prototype.matchAll = function (stringVal, fetchCaptures) {
        var matches = Array.from(stringVal.matchAll(this.current_regex));
        if (fetchCaptures) {
            return matches
                .map(function (m) { return m.slice(1); })
                .flat()
                .filter(function (val) { return val !== undefined; });
        }
        // Return full matches and their capture groups
        return matches
            .map(function (m) { return m.filter(function (val) { return val !== undefined; }); }) // Filter undefined values from full match and capture groups
            .flat();
    };
    /**
 * Replaces parts of a string based on the current regex.
 * @param {string} stringVal - The string to perform the replacement on.
 * @param {string} groups - The replacement string or a function that returns the replacement string.
 * @param {RegExp} [desired_regex] - An optional regex pattern to use instead of the current regex.
 * @returns {string} - The modified string with replacements.
 */
    RegExMaker.prototype.replace = function (stringVal, groups, desired_regex) {
        //allows to return 
        return stringVal.replace(desired_regex ? desired_regex : this.current_regex, groups);
    };
    return RegExMaker;
}());
/**
 * Creates and returns a new instance of the {@link RegExMaker} class.
 *
 * For more info: [Documentation](https://github.com)
 */
function RegMake() {
    return new RegExMaker();
}
// Create an instance of RegExMaker
var regexMaker = RegMake();
// regexMaker.add_custom("add_value", "\\w{10}")
// const regex1 = regexMaker.create_exp("(1232151913)", value_attr,true, ['g'], {"add_value": "1232151913"});
// console.log(regexMaker.usersMap)
// console.log(regexMaker.current_regex)
// console.log(regexMaker.exec('(1231233129)'))
//note that we want to record the expected runtime of this whole thing below:
//for accessing the dict ->
// //o(m)(o(n)) where n is the size of teh dictionary which we loop, and  n is the size of the list of the keys
exports.default = RegExMaker;
