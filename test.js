const keyMap = new Map([
  ["Digit0", "0"],
  ["Digit1", "1"],
  ["Digit2", "2"],
  ["Digit3", "3"],
  ["Digit4", "4"],
  ["Digit5", "5"],
  ["Digit6", "6"],
  ["Digit7", "7"],
  ["Digit8", "8"], // must check if it's multiply
  ["Digit9", "9"],

  ["Numpad0", "0"],
  ["Numpad1", "1"],
  ["Numpad2", "2"],
  ["Numpad3", "3"],
  ["Numpad4", "4"],
  ["Numpad5", "5"],
  ["Numpad6", "6"],
  ["Numpad7", "7"],
  ["Numpad8", "8"],
  ["Numpad9", "9"],

  ["NumpadAdd", "+"],
  ["NumpadSubtract", "−"],
  ["NumpadMultiply", "×"],
  ["NumpadDivide", "÷"],
  ["NumpadDecimal", "."],

  ["Period", "."],
  ["Minus", "−"],
  ["Slash", "÷"],

  ["Equal", "="], // must check if it's actually +
  ["Enter", "="],
  ["NumpadEnter", "="],
  ["Backspace", "DEL"],
  ["Escape", "AC"],
]);

console.log(keyMap.get("Digit0"));

const arr = ["a", "b", "c", "d", "e"];

console.log(arr.slice(-5));

console.log(/[÷×+-]/.test(""));

arr.pop();

console.log(arr);
