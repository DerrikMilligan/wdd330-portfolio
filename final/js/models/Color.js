
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
      throw new Error('Must be an array of arrays!');
    }

    return colors.map((color) => {
      if (Array.isArray(color) === false) {
        throw new Error(`Must be an array! Given: ${color}`);
      }

      if (color.length < 3) {
        throw new Error(`Must be at least three items in the array! Given: ${color}`);
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
        throw new Error(`Invalid value! Must be between 0 and 255. Given: '${color}' Params: { r: ${r}, g: ${g}, b: ${b}, a: ${a} }`);
      }
    });
  }

  /** Color getters */
  get r() { return this._r; }
  get g() { return this._g; }
  get b() { return this._b; }
  get a() { return this._a; }

  /** Color setters */
  set r(value) {
    if (value < 0 || value > 255) {
      throw new Error(`Invalid value! Must be between 0 and 255. Given: '${value}'`);
    }
    this._r = value;
  }

  set g(value) {
    if (value < 0 || value > 255) {
      throw new Error(`Invalid value! Must be between 0 and 255. Given: '${value}'`);
    }
    this._g = value;
  }

  set b(value) {
    if (value < 0 || value > 255) {
      throw new Error(`Invalid value! Must be between 0 and 255. Given: '${value}'`);
    }
    this._b = value;
  }

  set a(value) {
    if (value < 0 || value > 255) {
      throw new Error(`Invalid value! Must be between 0 and 255. Given: '${value}'`);
    }
    this._a = value;
  }


  /**
   * Returns the colors as an array
   *
   * @returns {number[]}
   */
  toArray() {
    return [ this._r, this._g, this._b, this._a ];
  }

  /**
   * Returns the colors as an array for ColorMind
   *
   * @returns {number[]}
   */
  toRgbArray() {
    return [ this._r, this._g, this._b ];
  }

  /**
   * Returns the color as a hex string
   *
   * @returns string the hex code including the #
   */
  toHex() {
    // Get the colors as hex strings and pad them with 0's if needed
    const r = this._r.toString(16).padStart(2, '0');
    const g = this._g.toString(16).padStart(2, '0');
    const b = this._b.toString(16).padStart(2, '0');
    const a = this._a.toString(16).padStart(2, '0');

    // Finally return the hex string
    return `#${r}${g}${b}${a}`;
  }

  toRgba() {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  /**
   * Turn the color into a string
   *
   * @returns {string}
   */
  toString() {
    return `r: ${this._r}, g: ${this._g}, b: ${this._b}`;
  }
}
