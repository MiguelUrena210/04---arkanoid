const MENU_START = ['Empezar', 'Seleccionar nivel'];                      // state.mode === 'menu'
const MENU_GAME = ['Continuar', 'Reiniciar nivel', 'Seleccionar nivel']; // state.mode === 'options'

// screen: 'main' | 'levels'; from: modo al que se vuelve al cerrar el menú.
function createMenu() {
  return { screen: 'main', index: 0, from: 'ready' };
}

// Textos de la pantalla actual: opciones del menú principal o un nombre por nivel.
function menuItems(menu, mode) {
  if (menu.screen === 'levels') return LEVELS.map((level) => level.name);
  return mode === 'menu' ? MENU_START : MENU_GAME;
}

// Procesa las teclas pulsadas: ↑↓ mueven la selección con vuelta circular.
// Devuelve 'confirm' (Enter), 'back' (Esc) o null.
function updateMenuNav(menu, count) {
  if (pressed.has('ArrowUp')) menu.index = (menu.index - 1 + count) % count;
  if (pressed.has('ArrowDown')) menu.index = (menu.index + 1) % count;
  if (pressed.has('Enter')) return 'confirm';
  if (pressed.has('Escape')) return 'back';
  return null;
}
