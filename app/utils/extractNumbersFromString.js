function extractNumbersFromString(inputString) {
  // Regular expression to match numbers in the string
  const numberPattern = /\d+/g;
  // Use the match method to find all occurrences of numbers in the string
  const numbersArray = inputString.match(numberPattern);
  // Return the array of numbers
  return numbersArray;
}

export default extractNumbersFromString;
