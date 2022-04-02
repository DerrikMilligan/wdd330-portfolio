import { ColorPicker } from './ColorPicker.js';

export const swatchSize = 5;

export class ColorHistory {

  /**
   * @param {HTMLElement}            el            the element we're mounting to
   * @param {fn(Array<Color>): void} saveSwatch    a callback function for saving a swatch
   * @param {Number}                 historyLength the number of rows to store in the history queue
   */
  constructor(el, saveSwatch = null, historyLength = 5) {
    this.el = el;
    this.historyLength = historyLength;
    this.saveSwatch = saveSwatch;

    this.histories = [];

    this.render();
  }

  /**
   * Create the ColorPickers and render the histories
   */
  render() {
    // Build our history list
    for (let i = 0; i < this.historyLength; i++) {
      const colorOutput = document.createElement('div');
      colorOutput.classList.add('color-output', 'swatch');

      // An object to contain all the info for this 'history'
      const history = {
        historyEl: colorOutput,
        saveButton: null,
        colorPickers: [],
      }

      // Build the color pickers for that history
      for (let j = 0; j < swatchSize; j++) {
        const colorPicker = document.createElement('div');
        colorPicker.classList.add('color-picker');

        colorPicker.setAttribute('readonly', '');
        colorPicker.setAttribute('display-color', '');

        history.colorPickers.push(new ColorPicker(colorPicker));

        colorOutput.append(colorPicker);
      }

      const saveButton = document.createElement('button');
      saveButton.classList.add('btn', 'icon');
      const saveIcon = document.createElement('span');
      saveIcon.innerText = '+';
      saveButton.append(saveIcon);

      saveButton.addEventListener('click', () => {
        // Check to see if we even have a color before attempting to save it
        const hasColor = history.colorPickers.reduce((acc, picker) => acc || picker.color.a > 0, false);

        // If we have a color and a saveSwatch function then send off the colors
        if (hasColor && this.saveSwatch) {
          this.saveSwatch(history.colorPickers.map((picker) => picker.color));
        }
      });

      history.saveButton = saveButton;

      this.histories.push(history);

      colorOutput.append(saveButton);
      this.el.append(colorOutput);
    }
  }

  /**
   *
   * @param {Number} index the index to load the colors into
   * @param {Array<Color>} colors the colors to load
   */
  loadColorsIntoHistory(index, colors) {
    if (Array.isArray(colors) === false) {
      throw new Error(`[ColorHistory][loadColorsIntoHistory] Param 'colors' isn't an array.`);
    }

    if (colors.length !== swatchSize) {
      throw new Error(`[ColorHistory][loadColorsIntoHistory] Invalid length. Must give ${swatchSize} colors`);
    }

    // Load the colors into the given history
    for (let i = 0; i < swatchSize; i++) {
      this.histories[index].colorPickers[i].loadColor(colors[i]);
    }
  }

  /**
   * Gets all the Colors for a given history index
   *
   * @param {Number} index the history index to lookup
   * @return {Array<Color>} the colors at that index
   */
  getHistoryColors(index) {
    return this.histories[index].colorPickers.map((colorPicker) => colorPicker.color);
  }

  /**
   * Before adding a new color we want to rotate all the rows of previous colors
   * down and remove the last set if we overflow.
   */
  cycleHistories() {
    // Note we walk this backwards because otherwise the first color row will get
    // pulled all the way down through the whole history.
    for (let i = this.historyLength - 1; i > 0; i--) {
      const previousColors = this.getHistoryColors(i - 1);
      this.loadColorsIntoHistory(i, previousColors);
    }
  }

  /**
   * Adds a set of colors to the history
   *
   * @param {Array<Color>} colors the array of colors to add to the history
   */
  addToHistory(colors) {
    if (Array.isArray(colors) === false) {
      throw new Error(`[ColorHistory][addToHistory] Param 'colors' isn't an array.`);
    }

    if (colors.length !== swatchSize) {
      throw new Error(`[ColorHistory][addToHistory] Invalid length. Must give ${swatchSize} colors`);
    }

    this.cycleHistories();

    this.loadColorsIntoHistory(0, colors);
  }

}

export default ColorHistory;
