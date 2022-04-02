import { Color } from '../models/Color.js';
import { ColorPicker } from './ColorPicker.js';
import { swatchSize } from './ColorHistory.js';

import LocalStorage from '../models/LocalStorage.js';

export class SavedColors {

  /**
   * @param {HTMLElement} el the element we're mounting to
   * @param {Number} maxSavedColors the number of rows to store in the history queue
   */
   constructor(el, maxSavedColors = 5) {
    this.el = el;
    this.maxSavedColors = maxSavedColors;

    this.swatches = [];

    this.render();

    LocalStorage.getSavedSwatches().forEach((swatch, index) => {
      this.loadSwatch(index, swatch);
    });
  }

  /**
   * Create the ColorPickers and render the savedColors
   */
  render() {
    // Build our saved color list
    for (let i = 0; i < this.maxSavedColors; i++) {
      const colorOutput = document.createElement('div');
      colorOutput.classList.add('color-output', 'swatch');

      // An object to contain all the info for this 'swatch'
      const swatchInfo = {
        swatchEl: colorOutput,
        colorPickers: [],
      }

      // Build the color pickers for that swatch
      for (let j = 0; j < swatchSize; j++) {
        const colorPicker = document.createElement('div');
        colorPicker.classList.add('color-picker');

        colorPicker.setAttribute('readonly', '');
        colorPicker.setAttribute('display-color', '');

        swatchInfo.colorPickers.push(new ColorPicker(colorPicker));

        colorOutput.append(colorPicker);
      }

      // Make a button to remove a saved color
      const removeButton = document.createElement('button');
      removeButton.classList.add('btn', 'icon');
      const saveIcon = document.createElement('span');
      saveIcon.innerText = 'x';
      saveIcon.style.fontWeight = 'bold';
      saveIcon.style.fontSize = '1.25rem';
      saveIcon.style.bottom = '0px';
      removeButton.append(saveIcon);

      // When we click the remove button, remove that swatch
      removeButton.addEventListener('click', () => {
        this.removeSwatch(i);
      });

      // Add stuff to the page and our list of swatch info
      swatchInfo.removeButton = removeButton;

      this.swatches.push(swatchInfo);

      colorOutput.append(removeButton);

      this.el.append(colorOutput);
    }
  }

  /**
   * Load a set of colors into a swatch at the given index
   *
   * @param {Number} index the index to load the colors into
   * @param {Array<Color>} colors the colors to load
   */
  loadSwatch(index, colors) {
    if (Array.isArray(colors) === false) {
      throw new Error(`[SavedColors][loadSwatch] Param 'colors' isn't an array.`);
    }

    if (colors.length !== swatchSize) {
      throw new Error(`[SavedColors][loadSwatch] Invalid length. Must give ${swatchSize} colors`);
    }

    // Load the colors into the given swatch
    for (let i = 0; i < swatchSize; i++) {
      this.swatches[index].colorPickers[i].loadColor(colors[i]);
    }
  }

  /**
   * Remove a swatch's colors at a given index and then re-render the colors
   *
   * @param {Number} index the swatch index to remove
   */
  removeSwatch(index) {
    // Reset all the colors for that swatch index
    for (const colorPicker of this.swatches[index].colorPickers) {
      colorPicker.resetColor();
    }

    // Remove the color in the local storage
    LocalStorage.removeSwatch(index);

    this.reRenderColors();
  }

  /**
   * Gets all the Colors for a given swatch index
   *
   * @param {Number} index the swatch index to lookup
   * @return {Array<Color>} the colors at that index
   */
  getSwatchColors(index) {
    return this.swatches[index].colorPickers.map((colorPicker) => colorPicker.color);
  }

  /**
   * Re renders the colors based upon the current swatches. Will fill in the gaps if there are any
   */
  reRenderColors() {
    // Get a clean list of all the swatches with color
    const swatches = this.getSwatchesWithColor();
    
    // Starting from the top fill out those colors
    for (let i = 0; i < swatches.length; i++) {
      this.loadSwatch(i, swatches[i]);
    }
  
    // For the remaining swatches wipe out their colors
    for (let i = swatches.length; i < this.maxSavedColors; i++) {
      this.swatches[i].colorPickers.forEach((colorPicker) => colorPicker.resetColor());
    }
  }

  /**
   * Gets all the current swatches that have color
   *
   * @returns {Array<Array<Color>>} an array of all the current swatches
   */
  getSwatchesWithColor() {
    
    // Iterate over our swatches to get their ColorPicker colors as copies and filter out
    // any colors that are empty
    return this.swatches
      // Note that while mapping this it's VERY important that we're cloning the color
      // because when we start swapping colors, we'll need these separate references
      .map((swatch) => swatch.colorPickers.map((colorPicker) => Color.clone(colorPicker.color)))
      .filter((colors) => colors.reduce((acc, color) => acc || color.a > 0, false));
  }

  /**
   * Before adding a new color we want to rotate all the rows of previous colors
   * down and remove the last set if we overflow.
   */
  cycleSaved() {
    // Note we walk this backwards because otherwise the first color row will get
    // pulled all the way down through the whole history.
    for (let i = this.maxSavedColors - 1; i > 0; i--) {
      // Get the previous rows colors
      const previousColors = this.getSwatchColors(i - 1);

      // Check to see if the previous row has visible colors
      const previousHasColor = previousColors.reduce((acc, color) => acc || color.a > 0, false);

      // If it does then pull it down!
      if (previousHasColor === true) {
        this.loadSwatch(i, previousColors);
      }
    }
  }

  /**
   * Saves a set of colors
   *
   * @param {Array<Color>} colors the array of colors to save
   */
  saveSwatch(colors) {
    if (Array.isArray(colors) === false) {
      throw new Error(`[SavedColors][addToHistory] Param 'colors' isn't an array.`);
    }

    if (colors.length !== swatchSize) {
      throw new Error(`[SavedColors][addToHistory] Invalid length. Must give ${swatchSize} colors`);
    }

    // Shift the swatches down
    this.cycleSaved();

    // Load our new swatch at the top
    this.loadSwatch(0, colors);

    // Save the swatch to the LocalStore
    LocalStorage.pushSwatch(colors);
  }

}

export default SavedColors;

