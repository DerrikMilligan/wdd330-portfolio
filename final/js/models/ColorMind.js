import { Color } from './Color.js';
import { apiRequest } from '../util.js';

export class ColorMind {

  constructor() {
    this.baseURL = 'http://colormind.io';
  }

  /**
   * Get a list of todays models. These change daily
   *
   * @returns {Promise<string[]>} the models available
   */
  async getModels() {
    const data = await apiRequest('get', `${this.baseURL}/list/`);

    // Return the result
    return data.result;
  }

  /**
   *
   * @param {Color[] | Array<Array<number>>} inputColors
   * @param {string} model
   *
   * @returns {Promise<Color[]>} array of the color options
   */
  async getPalette(inputColors = [], model = 'default') {
    if (Array.isArray(inputColors) === false) {
      throw new Error('Must use an array for input colors!');
    }

    if (inputColors.length > 5) {
      throw new Error("Can't use more than 5 input colors!");
    }

    const params = { model, input: [] };

    if (inputColors.length > 0) {
      params.input = inputColors.map((color) => {
        if (color instanceof Color) {
          return color.toRgbArray();
        }

        if (Array.isArray(color)) {
          if (color.length !== 3) {
            throw new Error(`Invalid color given: '${color}' Must be 3 numbers or an instance of Color.`);
          }

          return color;
        }

        throw new Error(`Invalid color given: '${color}' Must be 3 numbers or an instance of Color.`);
      });
    }

    // Push the extra 'N' params in so we get color suggestions
    while (params.input.length < 5) {
      params.input.push('N');
    }

    const data = await apiRequest('post', `${this.baseURL}/api/`, params);

    return Color.fromArray(data.result);
  }

}
