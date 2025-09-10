const parseExpressions = (expr) => {
  expr = expr
    .replace(/−/g, "-")
    .replace(/,/g, "")
    .replace(/÷/g, "/")
    .replace(/×/g, "*");

  const tokens =
    expr.match(/-?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[/*+\-]/g) || [];

  if (/^[/*+\-]$/.test(tokens.at(-1))) tokens.pop();

  return tokens;
};

function calculate(expr) {
  const tokens = parseExpressions(expr);
  console.log(tokens);
  let arr = [];
  let i = 0;
  while (i < tokens.length) {
    let t = tokens[i];
    if (t === "/" || t === "*") {
      const left = Number(arr.pop());
      const right = Number(tokens[i + 1]);
      arr.push(t === "/" ? left / right : left * right);
      i += 2;
    } else {
      arr.push(t);
      i++;
    }
  }

  const noPlus = arr.filter((el) => el !== "+");
  let result = noPlus.reduce((a, b) => Number(a) + Number(b));

  result = Number.isFinite(result) ? formatCalcResult(result) : "Error! (×_×)";

  return result;
}

const test = "0";

const secondToLastChar = test.slice(-2, -1);
const lastChar = test.slice(-1);

console.log(secondToLastChar === "");
