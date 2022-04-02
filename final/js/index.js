import { ColorPicker  } from './components/ColorPicker.js';
import { ColorHistory } from './components/ColorHistory.js';
import { SavedColors  } from './components/SavedColors.js';
import { Dropdown     } from './components/Dropdown.js';
import { ModelPicker  } from './components/ModelPicker.js';
import { Color        } from './models/Color.js';
import { isLive       } from './util.js';

import ColorMind from './models/ColorMind.js';

// Display the message to the user regarding the proxy when we're on the
// live site. The timeout is so the page can render before you get the
// message so it doesn't seem like an error.
if (isLive) {
  setTimeout(() => {
    alert(
      'The site on github uses a Heroku proxy for the API request. ' +
      'The first time you generate a color it may have some delay while the Heroku ' +
      'image warms up. Sorry for the inconvenience.'
    );
  }, 500);
}

const savedColors = new SavedColors(document.querySelector('#saved-colors'));
const colorHistory = new ColorHistory(document.querySelector('#color-history'), savedColors.saveSwatch.bind(savedColors));
const modelPicker = new ModelPicker(document.querySelector('#generation-models'));

ColorPicker.init();
Dropdown.init();

// Map all the dropdowns on the page to the nearest sibling dropdown-menu
Array.from(document.querySelectorAll('.dropdown'))
  .map(el => new Dropdown(el, el.parentElement.querySelector('.dropdown-menu')));


const colorInputs = Array.from(document.querySelectorAll('.color-input .color-picker')).map(el => new ColorPicker(el));


document.querySelector('#generate-colors').addEventListener('click', async () => {
  // Get only the active colors
  const input = colorInputs.filter(picker => picker.color.a !== 0).map(picker => picker.color);
  const output = await ColorMind.getPalette(input, modelPicker.selectedModel);

  // Load the output colors
  colorHistory.addToHistory(output);
});

const clearInput = document.querySelector('#clear-input');
clearInput.addEventListener('click', () => {
  colorInputs.forEach((colorPicker) => {
    colorPicker.loadColor(new Color(0, 0, 0, 0));
  });
});

