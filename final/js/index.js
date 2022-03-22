import { ColorPicker } from './components/ColorPicker.js';
import { Color       } from './models/Color.js';
import { ColorMind   } from './models/ColorMind.js';

const colorMind = new ColorMind();

ColorPicker.init();

const colorInputs  = Array.from(document.querySelectorAll('.color-input .color-picker')).map(el => new ColorPicker(el));
const colorOutputs = Array.from(document.querySelectorAll('.color-output .color-picker')).map(el => new ColorPicker(el));

const generateBtn = document.querySelector('#generate-colors');
generateBtn.addEventListener('click', async () => {
  // Get only the active colors
  const input = colorInputs.filter(picker => picker.color.a !== 0).map(picker => picker.color);
  const output = await colorMind.getPalette(input);

  // Load the output colors
  for (let index = 0; index < output.length; index++) {
    colorOutputs[index].loadColor(output[index]);
  }
});

const clearInput = document.querySelector('#clear-input');
clearInput.addEventListener('click', () => {
  colorInputs.forEach((colorPicker) => {
    colorPicker.loadColor(new Color(0, 0, 0, 0));
  });
});

// setInterval(() => {
//   console.log(colorInputs.filter(i => i.color.a !== 0).map(i => i.color.toHex()));
// }, 1000);

// Make all the readonly color pickers too
// Array.from(document.querySelectorAll('.color-picker[readonly]')).map(el => new ColorPicker(el))

