import { Color } from './Color.js';
import { apiRequest, isLive } from '../util.js';

export class ColorMind {

  constructor() {
    // Because github pages is an HTTPS page and the colormind app only functions over
    // http there are new browser rules that prevent a secure page from making a web
    // request the a page that isn't secure. So I've had to set up a proxy that we use
    // while on the github site.
    this.baseURL = isLive
      ? 'https://derriks-cors-proxy.herokuapp.com/colormind.io'
      : 'http://colormind.io';
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

    // const randomColors = [];
    // for (let i = 0; i < 5; i++) {
    //   randomColors.push([
    //     Math.random() * 255,
    //     Math.random() * 255,
    //     Math.random() * 255,
    //   ]);
    // }

    // return Color.fromArray(randomColors);

    const params = { model, input: [] };

    if (inputColors.length > 0) {
      params.input = inputColors.map((color) => {
        if (color instanceof Color) {
          return color.asRgbArray;
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

/**
 * We only ever really want one of this class instantiated,
 * so this instantiates it and exports it so we can use it as
 * a singleton.
 */
export default new ColorMind();
