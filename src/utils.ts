//function for splicing the string based on the inputted regex value



export function insertRegValues(inserted_EXP:string,current_value:string, desired_value: string, filled_indices:{ [key: number]: [number, number, string], }, regex_character:string):void {
     // Find the start index of the current_value in the desired_example string
     const startIndex = inserted_EXP.indexOf(current_value);
     if (startIndex != -1){// Skip if the value is not found
     // Calculate the end index of the current index string
     const inputEnd = startIndex + current_value.length;
     const expressionEnd = startIndex + desired_value.length
     // Replace the matched portion with the desired regex pattern
     inserted_EXP = inserted_EXP.slice(0, startIndex) + desired_value + inserted_EXP.slice(inputEnd);
     filled_indices[startIndex] = [startIndex, expressionEnd, regex_character]
     }

}