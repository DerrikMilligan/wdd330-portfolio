import { Color } from './Color.js';
import { swatchSize } from '../components/ColorHistory.js';

const storageKey = 'ColorMind';

export class LocalStorage {

  /**
   * When we initialize our object load the previous state
   */
  constructor() {
    this.store = [];
    this.loadPreviousState();
  }

  /**
   * Load the saved store (if any) from the local storage
   */
  loadPreviousState() {
    let previousState = localStorage.getItem(storageKey);

    if (previousState !== null) {
      this.store = JSON.parse(previousState);
    }
  }

  /**
   * Save the current store to the local storage
   */
  saveCurrentState() {
    localStorage.setItem(storageKey, JSON.stringify(this.store));
  }

  /**
   * Add a set of colors to the top of the store
   *
   * @param {Array<Color>} colors the colors to add to the storage
   */
  pushSwatch(colors) {
    // Insert the new color at the beginning of the array so we match
    // the layout in the SavedColors object
    this.store.splice(0, 0, colors.map(color => color.asArray));

    // If there's more colors than we can handle remove the one on the end
    if (this.store.length > swatchSize) {
      this.store.pop();
    }

    this.saveCurrentState();
  }

  /**
   * Removes a swatch from the history
   *
   * @param {Number} index
   */
  removeSwatch(index) {
    // Remove the desired index from the store
    this.store.splice(index, 1);

    this.saveCurrentState();
  }

  /**
   * @returns {Array<Array<Color>>} the current set of colors
   */
  getSavedSwatches() {
    return this.store.map(swatch => Color.fromArray(swatch));
  }

};

export default new LocalStorage();
