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

const calculate = (expr) => {
  const tokens = parseExpressions(expr);
  const afterMul = reduceByOperator(tokens, "×", (a, b) => a * b);
  const afterDiv = reduceByOperator(afterMul.value, "÷", (a, b) => a / b);

  let result;
  if (afterDiv.ok) {
    const noPlus = afterDiv.value.filter((el) => el !== "+");
    const num = noPlus.reduce((a, b) => Number(a) + Number(b));
    result = String(ceilTo(String(num).slice(0, 11), 10));
  } else {
    result = afterDiv.error;
    state = states.error;
  }

  return result;
};

const isCalculable = (msg) => /\d+[÷×−+]\d+/.test(msg);

const expr = "889÷−9";

console.log(isCalculable(expr));
