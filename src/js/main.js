let $ = require('jquery');
window.$ = $;
window.jquery = $;
window.jQuery = $;

let inputControlsSetup = require('./input-controls.js');

window.onload = function() {
  console.log('--- b2b ui kit ---');
  let inputControls  = inputControlsSetup();
}
