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

const edgy1 = 1.2345678901200001;
const edgy2 = -1680798074187.7441;

console.log(formatCalcResult(edgy1, 13));
console.log(formatCalcResult(edgy2, 13));
