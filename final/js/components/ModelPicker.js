import ColorMind from '../models/ColorMind.js';

import { titleCase } from '../util.js';

// Get a list of all available models for us to use in the picker
const availableModels = (await ColorMind.getModels()).sort();

export class ModelPicker {

  /**
   * Initialize the ModelPicker
   *
   * @param {HTMLElement} menuEl
   */
  constructor(menuEl) {
    this.selectedModel = 'default';
    this.menuEl = menuEl;

    this.buttons = [];

    this.render();
  }

  /**
   * Render the menu items based upon the models
   */
  async render() {
    this.buttons = availableModels.map((model) => {
      // Create the button element
      const button = document.createElement('button');
      button.dataset.value = model;

      // When setting the button text lets clean it up and make it title case
      button.innerText = titleCase(model.replace(/_/ig, ' '));

      // If it's currently selected add the attribute
      if (this.selectedModel === model)
        button.setAttribute('selected', '');

      // Add the event listener to change the model
      button.addEventListener('click', () => {
        this.selectedModel = button.dataset.value;

        const currentlySelected = this.menuEl.querySelector('[selected]');
        if (currentlySelected)
          currentlySelected.removeAttribute('selected');

        button.setAttribute('selected', '');
      });

      // Append the button to the menu
      this.menuEl.append(button);

      return button;
    });
  }

}

