
export type DefaultValues = {
    any_number: string;
    any_char: string;
    any_word: string;
    lowercase_word: string;
    uppercase_word: string;
    first_word: string;
    alphanumeric: string;
    non_alphanumeric: string;
    neg_positive_number: string;
    hex: string;
    ascii: string;
};
export type userTypes = Record<string, string>;


//types to build regex, required flags for flags, special characters to escape, 
export type RequiredFlags = ('g' | 'i' | 'm' | 's' | 'u' | 'y' | '')[];

//helper to build regex by keepign special characters
export type SpecialCharacter = | '(' | ')' | '[' | ']' | '{' | '}' | '.' | '*' | '+' | '?' | '^' | '$' | '|';

//used to maintain regex creation for special characters
export const specialCharacterDict: { [key: string]: boolean } = {
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
    '|': true,
};

//user type that needs to be exported in order to use RegExMaker class
export type regexDict = Partial<{//only require partial key value pairs in here
    [K in keyof DefaultValues]: string | string[];
}>;
//you can add values that arent present inside, 
export type userParams = Partial<{//only require partial key value pairs in here
    [K in keyof userTypes]: string | string[];
}>;

