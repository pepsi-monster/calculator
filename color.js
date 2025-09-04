const hexToRgb = (hexColor) => {
  const m = /^#([a-z0-9]{3}|[a-z0-9]{6})$/i.exec(hexColor);

  if (!m) throw new Error("Non-hex value passed");

  let hex = m[1];
  if (hex.length === 3) {
    hex = hex.replace(/./g, (ch) => ch + ch);
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return { r: r, g: g, b: b };
};

const rgbToHsl = (rgbColor) => {
  const RGB_MAX = 255;
  const r = rgbColor.r / RGB_MAX;
  const g = rgbColor.g / RGB_MAX;
  const b = rgbColor.b / RGB_MAX;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  const l = (max + min) / 2;

  let s;
  if (delta === 0) {
    s = 0;
  } else {
    s = delta / (1 - Math.abs(2 * l - 1));
  }

  let h;
  if (delta === 0) {
    h = 0;
  } else if (max === r) {
    h = 60 * ((g - b) / delta);
    h = h < 0 ? h + 360 : h;
  } else if (max === g) {
    h = 60 * ((b - r) / delta + 2);
  } else if (max === b) {
    h = 60 * ((r - g) / delta + 4);
  }

  return { h: h, s: s, l: l };
};

const defaultShadowTuning = {
  shiftHue: (h) => {
    let shift;
    if (h >= 0 && h < 60) shift = -8; // reds/oranges/yellows → toward red
    if (h >= 60 && h < 120) shift = -5; // greens → slightly toward teal/blue
    if (h >= 120 && h < 180) shift = -4; // yellow-greens (chartreuse) → small warm shift
    if (h >= 180 && h < 260) shift = +8; // cyans/blues → a bit purpler
    if (h >= 260 && h < 300) shift = -4; // indigo/violets → small warm shift
    if (h >= 300 && h < 360) shift = -6; // magentas → toward red
    if (h === 360) shift = -8; // same as 0–60 case

    const shifted = (h + shift + 360) % 360;
    return shifted;
  },

  descaleSaturation: (s, l) => {
    const DARK_BASE = 0.9;
    const LIGHTNESS_SLOPE = 0.2;
    const MIN_SAT_FACTOR = 0.75;

    const scaled = s * (DARK_BASE - LIGHTNESS_SLOPE * l); // brighter colors lose more saturation
    return Math.max(s * MIN_SAT_FACTOR, scaled); // but not below 75% of original S
  },

  // Lightness drop:
  // Go darker; drop a bit more when the color is very saturated and/or already bright.

  dropLightness: (s, l) => {
    const BASE_DROP = 0.12;
    const SATURATION_DROP_FACTOR = 0.08;
    const BRIGHTNESS_DROP_FACTOR = 0.12;
    const BRIGHTNESS_THRESHOLD = 0.6;
    const MIN_LIGHTNESS = 0.05;

    const extraIfVeryBright =
      l > BRIGHTNESS_THRESHOLD ? l - BRIGHTNESS_THRESHOLD : 0;

    const dropped =
      l -
      (BASE_DROP +
        SATURATION_DROP_FACTOR * s +
        BRIGHTNESS_DROP_FACTOR * extraIfVeryBright);

    return Math.max(MIN_LIGHTNESS, dropped);
  },
};

const shadowFromHsl = ({ h, s, l }, tuning = defaultShadowTuning) => {
  const h2 = tuning.shiftHue(h);
  const s2 = tuning.descaleSaturation(s, l);
  const l2 = tuning.dropLightness(s, l);

  return { h: h2, s: s2, l: l2 };
};

const hexToHsl = (hexColor) => {
  return rgbToHsl(hexToRgb(hexColor));
};

const rgbToShadowHsl = (hexColor) => {
  const hsl = shadowFromHsl(hexToHsl(hexColor));
  return `hsl(${hsl.h}, ${hsl.s * 100}%, ${hsl.l * 100}%)`;
};

const Color = {
  hexToRgb,
  rgbToHsl,
  defaultShadowTuning,
  shadowFromHsl,
  hexToHsl,
  rgbToShadowHsl,
};

export default Color;
