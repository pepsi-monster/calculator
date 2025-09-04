const expr = "14−2.8";

const parseExpressions = (expr) => {
  expr = expr.replace(/−/g, "-");
  const tokens = expr.match(/-?\d+(?:\.\d+)?|[÷×+-]/g);

  if (/[÷×+-]$/.test(tokens.slice(-1))) tokens.pop();

  return tokens;
};

console.log(parseExpressions(expr));
