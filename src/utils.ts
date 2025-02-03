import { regexDict, DefaultValues } from "./types";


 //reasoning behind this logic:
 //insertRegValues-> finds the key with regex that matches value_attr

 //then inserts it while filling in a array of values, with "start index, last index" of the value attr value of the user example string. the 2nd index of filled_array is the regex we will input as well(regex character)
 //
 export function insertRegexCharacters(values_map:regexDict, regexMap:regexDict, inserted_EXP:string,filled_indices:{ [key: number]: [number, number, string] }){
    //Note to self: in TS/JS, nonprimitive types are passed by reference and not reinitialized
    for (let regex_character of Object.keys(values_map)) {
        let desired_value = regexMap[regex_character as keyof regexDict];
        const current_value = values_map[regex_character as keyof DefaultValues];

        if (!desired_value || !current_value) continue;

        if (typeof current_value === "string") {
            findIndices(inserted_EXP, current_value,filled_indices,regex_character)
        } else {
            for (let value_to_change of current_value) {
                findIndices(inserted_EXP, value_to_change,filled_indices,regex_character)
            }
        }
    }

 }
 //finds positions of the string we want to insert, and then start building
//the key is the "FIRST INDEX", we will access by key, and then insert and 
//rebuild the regex
 function findIndices(inserted_EXP:string, current_value:string, filled_indices:{ [key: number]: [number, number, string] }, regex_character:string){
    const startIndex = inserted_EXP.indexOf(current_value);
    if (startIndex === -1)return;

    const inputEnd = startIndex + current_value.length;
    filled_indices[startIndex] = [startIndex, inputEnd, regex_character];
 }