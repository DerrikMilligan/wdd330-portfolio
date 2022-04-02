
export class Color {
  /**
   * Creates a color from an array. Can include or exclude alpha values
   *
   * @param {Array<Array<number>>} colors the colors as arrays
   *  ```json
   *  [
   *    [100, 100, 100],
   *    [200, 200, 200, 255],
   *  ]
   *  ```
   *
   * @returns {Array<Color>} All the colors now as Color objects
   */
  static fromArray(colors = []) {
    if (Array.isArray(colors) === false) {
      throw new Error('[Color][fromArray] Must be an array of arrays!');
    }

    return colors.map((color) => {
      if (Array.isArray(color) === false) {
        throw new Error(`[Color][fromArray] Must be an array! Given: ${color}`);
      }

      if (color.length < 3) {
        throw new Error(`[Color][fromArray] Must be at least three items in the array! Given: ${color}`);
      }

      return new Color(
        Number.parseInt(color[0]),
        Number.parseInt(color[1]),
        Number.parseInt(color[2]),
        Number.parseInt(color.length > 3 ? color[3] : 255),
      );
    });
  }

  /**
   * Clones a color so you get a new object
   *
   * @param {Color} color the color to clone
   */
  static clone(color) {
    return new Color(color.r, color.g, color.b, color.a);
  }

  /**
   * Creates a color instance
   *
   * @param {number} r red
   * @param {number} g green
   * @param {number} b blue
   * @param {number} a alpha
   */
  constructor(r, g, b, a = 255) {
    this._r = Number.parseInt(r);
    this._g = Number.parseInt(g);
    this._b = Number.parseInt(b);
    this._a = Number.parseInt(a);

    [ this._r, this._g, this._b, this._a ].forEach((color) => {
      if (color < 0 || color > 255) {
        throw new Error(`[Color][constructor] Invalid value! Must be between 0 and 255. Given: '${color}' Params: { r: ${r}, g: ${g}, b: ${b}, a: ${a} }`);
      }
    });
  }

  /** Color getters */
  get r() { return this._r; }
  get g() { return this._g; }
  get b() { return this._b; }
  get a() { return this._a; }

  ensureProperValue(value) {
    if (Number.isNaN(Number.parseInt(value))) {
      throw new Error('[Color][ensureProperValue] Value is not a number!');
    }

    if (value < 0 || value > 255) {
      throw new Error(`[Color][ensureProperValue] Invalid value! Must be between 0 and 255. Given: '${value}'`);
    }
  }

  /**
   * Reset a color to a transparent black.
   */
  reset() {
    this._r = 0;
    this._g = 0;
    this._b = 0;
    this._a = 0;
  }

  /** Color setters */
  set r(value) {
    this.ensureProperValue(value);
    this._r = value;
  }

  set g(value) {
    this.ensureProperValue(value);
    this._g = value;
  }

  set b(value) {
    this.ensureProperValue(value);
    this._b = value;
  }

  set a(value) {
    this.ensureProperValue(value);
    this._a = value;
  }

  /**
   * Determines the luminance of a color by converting it to a grayscale value
   *
   * @return {Number} The luminance value
   *
   * @link https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-procedure
   */
  get luminance() {
    var rgb = this.asRgbArray.map((value) => {
      value /= 255;
      return value <= 0.03928
        ? value / 12.92
        : Math.pow(((value + 0.055) / 1.055), 2.4);
    });

    return Number(rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722);
  }

  /**
   * Get the contrast value between this color and another color
   *
   * @param {Color} otherColor
   * @returns {Number} the contrast value
   *
   * @link https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-procedure
   */
  contrast(otherColor) {
    // Get the values once so we don't calculate them multiple times
    const ourLuminance = this.luminance;
    const otherLuminance = otherColor.luminance;

    return Number(
      (Math.max(ourLuminance, otherLuminance) + 0.05) /
      (Math.min(ourLuminance, otherLuminance) + 0.05)
    );
  }

  /**
   * Determines if the color is light. This is useful for knowing
   * if you want handle the color differently based upon if it's light or dark
   *
   * @returns {Boolean} whether or not the color would be considered 'light'
   *
   * @link https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-procedure
   */
  get isLightColor() {
    return this.contrast(new Color(255, 255, 255, 255)) <= 4.5;
  }

  /**
   * Determines if the color is dark. This is useful for knowing
   * if you want handle the color differently based upon if it's light or dark
   *
   * @returns {Boolean} whether or not the color would be considered 'dark'
   *
   * @link https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-procedure
   */
   get isDarkColor() {
    return !this.isLightColor;
  }

  /**
   * Returns the colors as an array
   *
   * @returns {number[]}
   */
  get asArray() {
    return [ this._r, this._g, this._b, this._a ];
  }

  /**
   * Returns the colors as an array for ColorMind
   *
   * @returns {number[]}
   */
  get asRgbArray() {
    return [ this._r, this._g, this._b ];
  }

  /**
   * Returns the color as a hex string
   *
   * @returns string the hex code including the #
   */
  get asHex() {
    // Get the colors as hex strings and pad them with 0's if needed
    const r = this._r.toString(16).padStart(2, '0');
    const g = this._g.toString(16).padStart(2, '0');
    const b = this._b.toString(16).padStart(2, '0');

    // Finally return the hex string
    return `#${r}${g}${b}`.toUpperCase();
  }

  /**
   * Returns the color as a hex string with the alpha value
   *
   * @returns {string} the hex code including the #
   */
  get asHexWithAlpha() {
    // Get the colors as hex strings and pad them with 0's if needed
    const a = this._a.toString(16).padStart(2, '0');

    // Finally return the hex string
    return `${this.asHex}${a}`.toUpperCase();
  }

  /**
   * Get the color as a CSS rgba string
   *
   * @returns {string} a CSS rgba representation of the color
   */
  get asRgba() {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  /**
   * Turns the color into a JSON array that can be loaded with Color.fromArray
   *
   * @returns {string} the JSON array
   */
  serialize() {
    return JSON.stringify(this.asArray);
  }

  /**
   * Turn the color into a string
   *
   * @returns {string}
   */
  toString() {
    return `r: ${this._r}, g: ${this._g}, b: ${this._b}, a: ${this._a}`;
  }
}
