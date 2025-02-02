"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//tests
var test_1 = require("./src/test");
describe('RegExMaker', function () {
    var regexMaker;
    beforeEach(function () {
        regexMaker = (0, test_1.RegMake)();
    });
    test('create_exp: basic regex creation', function () {
        var example = "p-[2rem]";
        var valueAttr = { any_number: ["2"], any_word: 'p' };
        var regex = regexMaker.create_exp(example, valueAttr, true, ['g']);
        expect(regex).toBe("(\\w+)-\\[(\\d+)rem\\]");
        expect(regexMaker.current_regex.source).toBe("(\\w+)-\\[(\\d+)rem\\]");
    });
    test('create_exp: regex with custom types', function () {
        regexMaker.add_custom('custom_type', '\\d{2}');
        var example = "id-1234";
        var valueAttr = { "any_number": ["12"] };
        var regex = regexMaker.create_exp(example, valueAttr, true, ['g'], { custom_type: ["12"] });
        expect(regex).toBe("id-(\\d{2})34");
    });
    test('create_exp: regex with special characters', function () {
        var example = "price: $100.50";
        var valueAttr = { any_number: ["100.50"] };
        var regex = regexMaker.create_exp(example, valueAttr, true, ['g']);
        expect(regex).toBe("price: \\$(\\d+(\\.\\d+)?)");
    });
    test('create_exp: regex without capture groups', function () {
        var example = "p-[2rem]";
        var valueAttr = { any_number: ["2"], any_word: 'p' };
        var regex = regexMaker.create_exp(example, valueAttr, false, ['g']);
        expect(regex).toBe("\\w+-\\[\\d+rem\\]");
    });
    test('merge_exp: merge two regex patterns', function () {
        var example1 = "p-[2rem]";
        var valueAttr1 = { any_number: ["2"], any_word: 'p' };
        regexMaker.create_exp(example1, valueAttr1, true, ['g']);
        var example2 = "w-[90%]";
        var valueAttr2 = { any_number: ["90"] };
        regexMaker.merge_exp(example2, valueAttr2, true);
        expect(regexMaker.current_regex.source).toBe("(\\w+)-\\[(\\d+)rem\\]|(\\w+)-\\[(\\d+)%\\]");
    });
    test('merge_exp: merge with custom types', function () {
        regexMaker.add_custom('custom_type', '\\d{2}');
        var example1 = "id-1234";
        var valueAttr1 = { custom_type: ["12"] };
        regexMaker.create_exp(example1, {}, true, ['g'], { custom_type: ["12"] });
        var example2 = "id-5678";
        var valueAttr2 = { "any_number": ["56"] };
        regexMaker.merge_exp(example2, {}, true);
        expect(regexMaker.current_regex.source).toBe("id-(\\d{2})34|id-(\\d{2})78");
    });
    test('test: regex matches string', function () {
        var example = "p-[2rem]";
        var valueAttr = { any_number: ["2"], any_word: 'p' };
        regexMaker.create_exp(example, valueAttr, true, ['g']);
        expect(regexMaker.test("p-[2rem]")).toBe(true);
    });
    test('test: regex does not match string', function () {
        var example = "p-[2rem]";
        var valueAttr = { any_number: ["2"], any_word: 'p' };
        regexMaker.create_exp(example, valueAttr, true, ['g']);
        expect(regexMaker.test("q-[3rem]")).toBe(false);
    });
    test('match: regex matches string', function () {
        var example = "p-[2rem]";
        var valueAttr = { any_number: ["2"], any_word: 'p' };
        regexMaker.create_exp(example, valueAttr, true, ['g']);
        expect(regexMaker.match("p-[2rem]")).toEqual(["p-[2rem]", "p", "2"]);
    });
    test('match: regex does not match string', function () {
        var example = "p-[2rem]";
        var valueAttr = { any_number: ["2"], any_word: 'p' };
        regexMaker.create_exp(example, valueAttr, true, ['g']);
        expect(regexMaker.match("q-[3rem]")).toEqual([""]);
    });
    test('exec: regex matches string', function () {
        var example = "p-[2rem]";
        var valueAttr = { any_number: ["2"], any_word: 'p' };
        regexMaker.create_exp(example, valueAttr, true, ['g']);
        expect(regexMaker.exec("p-[2rem]")).toEqual(["p-[2rem]", "p", "2"]);
    });
    test('exec: regex does not match string', function () {
        var example = "p-[2rem]";
        var valueAttr = { any_number: ["2"], any_word: 'p' };
        regexMaker.create_exp(example, valueAttr, true, ['g']);
        expect(regexMaker.exec("q-[3rem]")).toEqual([""]);
    });
    test('matchAll: fetch capture groups', function () {
        var example = "p-[2rem] w-[90%]";
        var valueAttr = { any_number: ["2", "90"], any_word: ['p', 'w'] };
        regexMaker.create_exp(example, valueAttr, true, ['g']);
        expect(regexMaker.matchAll("p-[2rem] w-[90%]", true)).toEqual(["p", "2", "w", "90"]);
    });
    test('matchAll: fetch all matches', function () {
        var example = "p-[2rem] w-[90%]";
        var valueAttr = { any_number: ["2", "90"], any_word: ['p', 'w'] };
        regexMaker.create_exp(example, valueAttr, true, ['g']);
        expect(regexMaker.matchAll("p-[2rem] w-[90%]", false)).toEqual(["p-[2rem]", "p", "2", "w-[90%]", "w", "90"]);
    });
    test('replace: replace matched groups', function () {
        var example = "p-[2rem]";
        var valueAttr = { any_number: ["2"], any_word: 'p' };
        regexMaker.create_exp(example, valueAttr, true, ['g']);
        expect(regexMaker.replace("p-[2rem]", "div-[3rem]")).toBe("div-[3rem]");
    });
    test('replace: replace with custom regex', function () {
        var example = "p-[2rem]";
        var valueAttr = { any_number: ["2"], any_word: 'p' };
        regexMaker.create_exp(example, valueAttr, true, ['g']);
        var customRegex = new RegExp("\\d+", "g");
        expect(regexMaker.replace("p-[2rem]", "3", customRegex)).toBe("p-[3rem]");
    });
    test('add_custom: add custom regex pattern', function () {
        regexMaker.add_custom('custom_type', '\\d{2}');
        expect(regexMaker.usersMap['custom_type']).toBe("\\d{2}");
    });
    test('remove_custom: remove custom regex pattern', function () {
        regexMaker.add_custom('custom_type', '\\d{2}');
        regexMaker.remove_custom('custom_type');
        expect(regexMaker.usersMap['custom_type']).toBeUndefined();
    });
    test('get_custom: retrieve custom regex patterns', function () {
        regexMaker.add_custom('custom_type', '\\d{2}');
        expect(regexMaker.get_custom()).toEqual({ custom_type: "\\d{2}" });
    });
    test('create_exp: handle empty value_attr', function () {
        var example = "p-[2rem]";
        var valueAttr = {};
        var regex = regexMaker.create_exp(example, valueAttr, true, ['g']);
        expect(regex).toBe("p-\\[2rem\\]");
    });
    test('create_exp: handle empty desired_example', function () {
        var example = "";
        var valueAttr = { any_number: ["2"], any_word: 'p' };
        var regex = regexMaker.create_exp(example, valueAttr, true, ['g']);
        expect(regex).toBe("");
    });
    test('merge_exp: handle empty desired_example', function () {
        var example1 = "p-[2rem]";
        var valueAttr1 = { any_number: ["2"], any_word: 'p' };
        regexMaker.create_exp(example1, valueAttr1, true, ['g']);
        var example2 = "";
        var valueAttr2 = { any_number: ["90"] };
        regexMaker.merge_exp(example2, valueAttr2, true);
        expect(regexMaker.current_regex.source).toBe("(\\w+)-\\[(\\d+)rem\\]");
    });
    test('merge_exp: handle empty value_attr', function () {
        var example1 = "p-[2rem]";
        var valueAttr1 = { any_number: ["2"], any_word: 'p' };
        regexMaker.create_exp(example1, valueAttr1, true, ['g']);
        var example2 = "w-[90%]";
        var valueAttr2 = {};
        regexMaker.merge_exp(example2, valueAttr2, true);
        expect(regexMaker.current_regex.source).toBe("(\\w+)-\\[(\\d+)rem\\]|w-\\[90%\\]");
    });
    test('matchAll: handle no matches', function () {
        var example = "p-[2rem]";
        var valueAttr = { any_number: ["2"], any_word: 'p' };
        regexMaker.create_exp(example, valueAttr, true, ['g']);
        expect(regexMaker.matchAll("q-[3rem]", true)).toEqual([]);
    });
    test('replace: handle no matches', function () {
        var example = "p-[2rem]";
        var valueAttr = { any_number: ["2"], any_word: 'p' };
        regexMaker.create_exp(example, valueAttr, true, ['g']);
        expect(regexMaker.replace("q-[3rem]", "div-[3rem]")).toBe("q-[3rem]");
    });
});
