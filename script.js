import Color from "./color.js";

const calculator = document.querySelector(".calculator");
window.addEventListener("load", () => calculator.focus());
calculator.addEventListener("pointerdown", () => calculator.focus());

const theme = {
  redM: {
    fill: "#E23E2F",
    shadow: Color.rgbToShadowHsl("#E23E2F"),
    width: "119px",
    height: "78px",
  },
  yellowM: {
    fill: "#FCC218",
    shadow: Color.rgbToShadowHsl("#FCC218"),
    width: "119px",
    height: "78px",
  },
  yellowL: {
    fill: "#FCC218",
    shadow: Color.rgbToShadowHsl("#FCC218"),
    width: "160px",
    height: "78px",
  },
  greenS: {
    fill: "#20AB7B",
    shadow: Color.rgbToShadowHsl("#20AB7B"),
    width: "78px",
    height: "78px",
  },
  blueS: {
    fill: "#1C7FD5",
    shadow: Color.rgbToShadowHsl("#1C7FD5"),
    width: "78px",
    height: "78px",
  },
  blueM: {
    fill: "#1C7FD5",
    shadow: Color.rgbToShadowHsl("#1C7FD5"),
    width: "119px",
    height: "78px",
  },
  blueL: {
    fill: "#1C7FD5",
    shadow: Color.rgbToShadowHsl("#1C7FD5"),
    width: "160px",
    height: "78px",
  },
  screen: {
    fill: "#0C1E33",
    shadow: "#041122",
    width: "324px",
    height: "88px",
  },
};

const rows = Array.from({ length: 6 }, (_, i) => {
  const row = document.createElement("div");
  row.classList.add(`row-${i}`);
  row.classList.add(`rows`);
  return row;
});

const createBtn = (label, config = {}) => {
  const btn = document.createElement("button");
  btn.classList.add("cal-btn");
  btn.setAttribute("type", "button");
  btn.style.setProperty("cursor", "pointer");

  const btnContainer = document.createElement("div");
  btnContainer.classList.add("cal-btn-container");

  btnContainer.style.setProperty("--btn-width", config.width);
  btnContainer.style.setProperty("--btn-fill", config.fill);
  btnContainer.style.setProperty("--btn-shadow", config.shadow);

  const btnOuter = document.createElement("div");
  btnOuter.classList.add("cal-btn-outer");

  const btnInner = document.createElement("div");
  btnInner.classList.add("cal-btn-inner");

  const txt = document.createElement("h1");
  txt.textContent = label;
  btnInner.appendChild(txt);
  btnOuter.appendChild(btnInner);
  btnContainer.appendChild(btnOuter);
  btn.append(btnContainer);

  return btn;
};

rows[1].appendChild(createBtn("DEL", theme.redM));
rows[1].appendChild(createBtn("AC", theme.redM));
rows[1].appendChild(createBtn("÷", theme.greenS));

rows[2].appendChild(createBtn("7", theme.blueS));
rows[2].appendChild(createBtn("8", theme.blueS));
rows[2].appendChild(createBtn("9", theme.blueS));
rows[2].appendChild(createBtn("×", theme.greenS));

rows[3].appendChild(createBtn("4", theme.blueS));
rows[3].appendChild(createBtn("5", theme.blueS));
rows[3].appendChild(createBtn("6", theme.blueS));
rows[3].appendChild(createBtn("−", theme.greenS));

rows[4].appendChild(createBtn("1", theme.blueS));
rows[4].appendChild(createBtn("2", theme.blueS));
rows[4].appendChild(createBtn("3", theme.blueS));
rows[4].appendChild(createBtn("+", theme.greenS));

rows[5].appendChild(createBtn("0", theme.blueM));
rows[5].appendChild(createBtn(".", theme.blueS));
rows[5].appendChild(createBtn("=", theme.yellowM));

rows.forEach((row) => {
  calculator.appendChild(row);
});

const screen = document.createElement("div");
screen.classList.add("screen");
const screenMsg = document.createElement("h1");
screen.appendChild(screenMsg);

rows[0].appendChild(screen);

document.querySelectorAll(".cal-btn").forEach((btn) => {
  const label = btn.querySelector("h1");
  btn.setAttribute("value", label.textContent);
  btn.setAttribute("tabindex", "-1");
});

const parseExpressions = (expr) => {
  expr = expr.replace(/−/g, "-");
  const tokens = expr.match(/-?\d+(?:\.\d+)?|[÷×+-]/g);

  if (/[÷×+-]$/.test(tokens.slice(-1))) tokens.pop();

  return tokens;
};

const reduceByOperator = (tokenArr, operator, fn) => {
  let result = tokenArr.slice();
  while (true) {
    const idx = result.indexOf(operator);
    if (idx === -1) break;

    const left = Number(result[idx - 1]);
    const right = Number(result[idx + 1]);

    if (operator === "÷" && right === 0) {
      return { ok: false, error: "Zero?! (×_×)" };
    }

    const value = fn(left, right);
    result.splice(idx - 1, 3, value);
  }
  return { ok: true, value: result };
};

const ceilTo = (num, decimals) => {
  const factor = 10 ** decimals;
  return Math.ceil(num * factor) / factor;
};

const states = {
  error: "error",
  beforeCalculated: "beforeCalculated",
  afterCalculated: "afterCalculated",
};

let state = states.beforeCalculated;

function expHandler(n, charRoom) {
  const defaultExp = n.toExponential();
  const isOverFlow = defaultExp.length > charRoom;

  const negRoom = n >= 0 ? 0 : 1;
  const expRoom = defaultExp.match(/(?<=e[+-])\d+$/)[0].length;
  const notationRoom = "d.±e".length;
  const decimalRoom = charRoom - (negRoom + expRoom + notationRoom);

  return isOverFlow ? n.toExponential(decimalRoom) : n.toExponential();
}

function overFlowHandler(n, maxCharRoom = 12) {
  const negRoom = n >= 0 ? 0 : 1;
  const dotRoom = 1;

  const stringfied = Math.abs(n).toString(10);

  const [_, int, decimal] = stringfied.match(/^(\d+)(?:\.(\d+))?$/);
  const isIntOverFlow = int.length + negRoom > maxCharRoom;
  if (isIntOverFlow) return expHandler(n, maxCharRoom);
  else {
    const decimalRoom = maxCharRoom - (int.length + dotRoom + negRoom);
    const neg = negRoom === 0 ? "" : "-";
    const decimalAdjusted = roundTo(parseFloat("0." + decimal), decimalRoom)
      .toString()
      .slice(1);
    return neg + int + decimalAdjusted;
  }
}

function roundTo(num, decimals) {
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
}

const formatCalcResult = (n, maxCharRoom = 13) => {
  const finite = Number.isFinite(n);

  let result;
  if (!finite) {
    result = n;
  }
  if (finite) {
    const stringfied = n.toString(10);
    const isExpAlready = /e/i.test(n);
    const isAsIs = !isExpAlready && stringfied.length <= maxCharRoom;
    const isOverFlow = !isExpAlready && stringfied.length > maxCharRoom;

    if (isExpAlready) result = expHandler(n, maxCharRoom);
    if (isAsIs) result = n.toString();
    if (isOverFlow) result = overFlowHandler(n, maxCharRoom);
  }
  return result;
};

const MAXCHAR = 13;
const MAXRESULTROOM = MAXCHAR - 2;

const calculate = (expr) => {
  const tokens = parseExpressions(expr);
  const afterMul = reduceByOperator(tokens, "×", (a, b) => a * b);
  const afterDiv = reduceByOperator(afterMul.value, "÷", (a, b) => a / b);

  let result;
  if (afterDiv.ok) {
    const noPlus = afterDiv.value.filter((el) => el !== "+");
    const num = noPlus.reduce((a, b) => Number(a) + Number(b));
    result = formatCalcResult(num, MAXRESULTROOM);
  } else {
    result = afterDiv.error;
    state = states.error;
  }

  return result;
};

const clearAll = () => "";
const deleteLastChar = (str) => str.slice(0, -1);
const replaceLastChar = (str, char) => str.slice(0, -1) + char;
const appendChar = (str, char) => (str += char);

const isDel = (x) => x === "DEL";
const isAc = (x) => x === "AC";
const isZero = (x) => x === "0";
const isDot = (x) => x === ".";
const isMinus = (x) => x === "−";
const isEquality = (x) => x === "=";
const operatorsArr = ["÷", "×", "+"];
const oneToNineArr = Array.from({ length: 9 }, (_, i) => {
  return `${i + 1}`;
});
const isOperators = (x) => (operatorsArr.includes(x) ? true : false);
const isOneToNine = (x) => (oneToNineArr.includes(x) ? true : false);
const isZeroAppendable = (msg) =>
  /(?:^|[÷×−+])(?:−?$|−?[1-9]\d*|−?\d+\.\d*)$/.test(msg);
const isDotAppendable = (msg) => /(?:^|[÷×+−])-?\d+$/.test(msg);
const isCalculable = (msg) => /\d+[÷×−+]−?\d+/.test(msg);

let message = "";

const handleAfterCalculate = (input) => {
  const hasRoom = message.length < MAXCHAR;

  if (isDel(input)) {
    message = deleteLastChar(message);
  } else if (isAc(input)) {
    message = clearAll();
  } else if ((isOperators(input) && hasRoom) || (isMinus(input) && hasRoom)) {
    message = appendChar(message, input);
  } else if (isOneToNine(input) || isZero(input)) {
    message = clearAll();
  } else if (isDot(input)) {
    if (isDotAppendable(message)) {
      message = appendChar(message, input);
    }
  }
  state = states.beforeCalculated;
  return;
};

const handleBeforeCalculate = (input) => {
  const secondToLastChar = message.slice(-2, -1);
  const lastChar = message.slice(-1);

  const hasRoom = message.length < MAXCHAR;

  if (isDel(input)) {
    message = deleteLastChar(message);
    return;
  }

  if (isAc(input)) {
    message = clearAll();
    return;
  }

  if (isZero(input) && hasRoom) {
    if (isZeroAppendable(message) || isDot(lastChar)) {
      message = appendChar(message, input);
      return;
    }
  }

  if (isOneToNine(input) && hasRoom) {
    if (
      (isMinus(secondToLastChar) && isZero(lastChar)) ||
      (isOperators(secondToLastChar) && isZero(lastChar))
    ) {
      message = replaceLastChar(message, input);
      return;
    } else {
      message = appendChar(message, input);
      return;
    }
  }

  if (isMinus(input) && hasRoom) {
    if (lastChar === "+") {
      message = replaceLastChar(message, input);
      return;
    } else if (!isMinus(lastChar) && !isDot(lastChar)) {
      message = appendChar(message, input);
      return;
    }
  }

  if (isOperators(input) && hasRoom) {
    if (isOneToNine(lastChar) || isZero(lastChar)) {
      message = appendChar(message, input);
      return;
    } else if (isOperators(secondToLastChar) && isMinus(lastChar)) {
      message = message.slice(0, -2) + input;
      return;
    } else if (
      secondToLastChar &&
      lastChar !== input &&
      message !== "" &&
      !isZero(lastChar) &&
      !isDot(lastChar)
    ) {
      message = replaceLastChar(message, input);
      return;
    }
  }

  if (isDot(input) && hasRoom) {
    if (isDotAppendable(message)) {
      message = appendChar(message, input);
      return;
    }
  }

  if (isEquality(input) && isCalculable(message)) {
    message = calculate(message);
    state = states.afterCalculated;
    return;
  }
};

const handleError = (input) => {
  if (input) {
    message = clearAll();
  }

  state = states.beforeCalculated;

  return;
};

const updateScreen = (input) => {
  switch (state) {
    case states.beforeCalculated: {
      handleBeforeCalculate(input);
      break;
    }
    case states.afterCalculated: {
      handleAfterCalculate(input);
      break;
    }
    case states.error: {
      handleError(input);
      break;
    }
  }
  screenMsg.textContent = message;
};

const press = (elem) => elem.classList.add("is-pressed");
const release = (elem) => elem.classList.remove("is-pressed");

const wirePress = (btn) => {
  btn.addEventListener("pointerdown", (e) => {
    btn.setPointerCapture(e.pointerId);
    press(btn);
    updateScreen(btn.value);
  });

  btn.addEventListener("pointerup", (e) => {
    release(btn);
  });

  btn.addEventListener("pointercancel", (e) => {
    release(btn);
  });
};

document.querySelectorAll(".cal-btn").forEach(wirePress);

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

const normalizeKeyCode = (event) => {
  const keyCode = event.code;
  const keyLiteral = event.key;

  let result;

  if (keyCode === "Digit8" && keyLiteral === "*") {
    result = "NumpadMultiply";
  } else if (keyCode === "Equal" && keyLiteral === "+") {
    result = "NumpadAdd";
  } else result = keyCode;

  return result;
};

calculator.addEventListener("keydown", (e) => {
  const validCodes = [...keyMap.keys()];
  const keyCode = e.code;

  if (validCodes.includes(keyCode)) {
    const normalizedKeyCode = normalizeKeyCode(e);
    const calLiteral = keyMap.get(normalizedKeyCode);
    const btn = document.querySelector(`[value="${calLiteral}"]`);

    press(btn);
    updateScreen(btn.value);
  }
});

calculator.addEventListener("keyup", (e) => {
  const validCodes = [...keyMap.keys()];
  const keyCode = e.code;

  if (validCodes.includes(keyCode)) {
    const normalizedKeyCode = normalizeKeyCode(e);
    const calLiteral = keyMap.get(normalizedKeyCode);
    const btn = document.querySelector(`[value="${calLiteral}"]`);

    release(btn);
  }
});
