import GUI from '../ext/lilgui.js'
import { log_print_md } from './log.js'
const print = (s) => log_print_md(s)
const println = () => log_print_md('\n')
// 'gui' can be the root or a folder.
export function new_gui() { return new GUI() }
export function uifolder (gui, name) { return gui.addFolder(name) } 
export function uibool   (gui, o, name) { gui.add(o, name) }
export function uistring (gui, o, name) { gui.add(o, name) }
export function uinumber (gui, o, name) { gui.add(o, name) }
export function guiexample(gui) {
  // TODO: fix this func:
  const myObject = {
    myBoolean: true,
    myFunction: function() { println('Hello from GUI!') },
    myString: 'Hiihoo',
    myNumber: 1,
    myEditText: 'Just doeet',
    myProperty: 42,
  };
  const colorFormats = {
    string: '#ffffff',
    int: 0xffffff,
    object: { r: 1, g: 1, b: 1 },
    array: [ 1, 1, 1 ]
  };
  gui.add( myObject, 'myBoolean' );  // Checkbox
  gui.add( myObject, 'myFunction' ); // Button
  gui.add( myObject, 'myString' );   // Text Field
  gui.add( myObject, 'myNumber' );   // Number Field
  // Add sliders to number fields by passing min and max
  gui.add( myObject, 'myNumber', 0, 1 );
  gui.add( myObject, 'myNumber', 0, 100, 2 ); // snap to even numbers
  // Create dropdowns by passing an array or object of named values
  gui.add( myObject, 'myNumber', [ 0, 1, 2 ] );
  gui.add( myObject, 'myNumber', { Label1: 0, Label2: 1, Label3: 2 } );
  // Create color pickers for multiple color formats
  gui.addColor( colorFormats, 'string' );
  // Custom onchange and chainable methods
  gui.add( myObject, 'myEditText' ).name('Custom edit').onChange((v) => { println('Changed ->', v) });
  gui.add( myObject, 'myProperty' )
    .name( 'Custom Name' )
    .onChange( value => {
      print('Custom property changed: ' + value)
    } );
}
