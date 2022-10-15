import sys
from PyQt6.QtCore import QTimer
from PyQt6.QtGui import QResizeEvent
from PyQt6.QtWidgets import QApplication, QWidget
from PyQt6.QtSvgWidgets import QSvgWidget
import keyboard
from svgs import keyboard as keyboard_svg
from keys import keymap
import logging
logging.basicConfig(level=logging.DEBUG, format=' %(asctime)s - %(name)s - %(levelname)s - %(message)s')

pressed_keys = set()

def get_keyboard_style() -> str:
    style = "#g2221 {fill: white;} "
    style += "#g2206 {fill: white;} "
    style += "#g2193 {fill: white;} "
    style += "#g2235 {fill: white;} "
    style += "#rect950 {fill:inherit;} "
    if "space" in pressed_keys:
        style += "#normalLetterGroup {opacity: 0.3;} "
    else:
        style += "#mirrorLetterGroup {opacity: 0.3;} "
    aliases = {
        ";": "semicolon",
        ".": "period",
        ",": "comma",
        "[": "openbracket"
    }
    for key in pressed_keys:
        if (type(key) is str and
            len(key) == 1 and
            (key in aliases or "a"<=key<="z" or "A"<=key<="Z")
        ):
            key_name = aliases.get(key, key)
            style += "#"+key_name+" {fill: darkgray;} "
    return style

def get_keyboard_svg() -> bytes:
    updated = keyboard_svg.replace("/* style */", get_keyboard_style())
    return updated.encode("utf-8")

class SVGFrame(QWidget):
    def __init__(self):
        super().__init__()
        self.svg = QSvgWidget(self)
        self.updateSVG()
        timer = QTimer(self, interval=100, timeout=self.updateSVG)
        timer.start()
    
    def updateSVG(self):
        self.svg.renderer().load(get_keyboard_svg())
        self.update()

    def resizeEvent(self, e: QResizeEvent) -> None:
        super().resizeEvent(e)
        ar = 2369/796
        size = e.size()
        w_ar = size.width()/size.height()
        if w_ar < ar:
            width = size.width()
            height = int(1/ar*width)
            self.svg.setGeometry(0, int((size.height()-height)/2), width, height)
        else:
            height = size.height()
            width = int(ar*height)
            self.svg.setGeometry(int((size.width()-width)/2), 0, width, height)

app = QApplication(sys.argv)
svgWidget = SVGFrame()
just_backspaced = False

def on_key_event(key: keyboard.KeyboardEvent):
    global just_backspaced
    print(key)
    print(pressed_keys)
    if key.event_type == "down":
        if key.name=="space" and "space" not in pressed_keys:
            just_backspaced = False
        pressed_keys.add(key.name)
        if key.name != "space" and "space" in pressed_keys:
            if key.name in keymap:
                if not just_backspaced:
                    keyboard.press_and_release("backspace")
                    just_backspaced = True
                keyboard.press(keymap[key.name])
            else:
                keyboard.press(key.name)
        else:
            keyboard.press(key.name)
    else:
        if key.name in pressed_keys:
            pressed_keys.remove(key.name)
        if key.name == "space":
            keyboard.restore_state([])
            pressed_keys.clear()
        if "space" in pressed_keys:
            keyboard.release(keymap.get(key.name, key.name))
        else:
            keyboard.release(key.name)

    return False
def main():    
    keyboard.hook(on_key_event, suppress=True)
    # keyboard.remap_key("a", "b")
    # keyboard.wait()

    svgWidget.resize(500, 200)
    svgWidget.move(300, 300)
    svgWidget.setWindowTitle('Keyboard')
    svgWidget.show()
    code = app.exec()
    print(code)
    sys.exit(code)


if __name__ == '__main__':
    main()
