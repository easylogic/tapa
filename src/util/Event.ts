import { uuid } from "./functions/func";

export const makeEventChecker = (value: string, split = CHECK_SAPARATOR) => {
  return ` ${split} ${value}`;
}

// event name regular expression
export const CHECK_DOM_EVENT_PATTERN = /^dom (.*)/gi;
export const CHECK_LOAD_PATTERN = /^load (.*)/gi;
export const CHECK_BIND_PATTERN = /^bind (.*)/gi;

export const NAME_SAPARATOR = ":";
export const CHECK_SAPARATOR = "|";
export const DOM_EVENT_SAPARATOR = "dom ";
export const LOAD_SAPARATOR = "load ";
export const BIND_SAPARATOR = "bind ";

export const SAPARATOR = ' ';

const refManager = {} as {[key: string] : any};

export const DOM_EVENT_MAKE = (...keys: any[]) => {
  var key = keys.join(NAME_SAPARATOR);
  return (...args: any[]) => {
    return DOM_EVENT_SAPARATOR + [key, ...args].join(SAPARATOR);
  };
};

const _DOM = DOM_EVENT_MAKE;
export const CUSTOM = DOM_EVENT_MAKE;
export const CLICK = _DOM("click");
export const DOUBLECLICK = _DOM("dblclick");
export const MOUSEDOWN = _DOM("mousedown");
export const MOUSEUP = _DOM("mouseup");
export const MOUSEMOVE = _DOM("mousemove");
export const MOUSEOVER = _DOM("mouseover");
export const MOUSEOUT = _DOM("mouseout");
export const MOUSEENTER = _DOM("mouseenter");
export const MOUSELEAVE = _DOM("mouseleave");
export const TOUCHSTART = _DOM("touchstart");
export const TOUCHMOVE = _DOM("touchmove");
export const TOUCHEND = _DOM("touchend");
export const KEYDOWN = _DOM("keydown");
export const KEYUP = _DOM("keyup");
export const KEYPRESS = _DOM("keypress");
export const DRAG = _DOM("drag");
export const DRAGSTART = _DOM("dragstart");
export const DROP = _DOM("drop");
export const DRAGOVER = _DOM("dragover");
export const DRAGENTER = _DOM("dragenter");
export const DRAGLEAVE = _DOM("dragleave");
export const DRAGEXIT = _DOM("dragexit");
export const DRAGOUT = _DOM("dragout");
export const DRAGEND = _DOM("dragend");
export const CONTEXTMENU = _DOM("contextmenu");
export const CHANGE = _DOM("change");
export const INPUT = _DOM("input");
export const FOCUS = _DOM("focus");
export const FOCUSIN = _DOM("focusin");
export const FOCUSOUT = _DOM("focusout");
export const BLUR = _DOM("blur");
export const PASTE = _DOM("paste");
export const RESIZE = _DOM("resize");
export const SCROLL = _DOM("scroll");
export const SUBMIT = _DOM("submit");
export const POINTERSTART = CUSTOM("pointerdown");
export const POINTERMOVE = CUSTOM("pointermove");
export const POINTEREND = CUSTOM("pointerup");
export const CHANGEINPUT = CUSTOM("change", "input");
export const WHEEL = CUSTOM("wheel", "mousewheel", "DOMMouseScroll");
export const ANIMATIONSTART = _DOM('animationstart');
export const ANIMATIONEND = _DOM('animationend');
export const ANIMATIONITERATION = _DOM('animationiteration');
export const TRANSITIONSTART = _DOM('transitionstart');
export const TRANSITIONEND = _DOM('transitionend');
export const TRANSITIONRUN = _DOM('transitionrun');
export const TRANSITIONCANCEL = _DOM('transitioncancel');

// Predefined CHECKER
export const CHECKER = (value: string, split = CHECK_SAPARATOR) => {
  return makeEventChecker(value, split);
};

export const AFTER = (value: string, split = CHECK_SAPARATOR) => {
  return makeEventChecker(`after(${value})`, split);
};

export const BEFORE = (value: string, split = CHECK_SAPARATOR) => {
  return makeEventChecker(`before(${value})`, split);  
};

export const IF = CHECKER;
export const KEY = CHECKER; 

export const ARROW_UP = IF('ArrowUp');
export const ARROW_DOWN = IF('ArrowDown');
export const ARROW_LEFT = IF('ArrowLeft');
export const ARROW_RIGHT = IF('ArrowRight');
export const ENTER = IF('Enter');
export const SPACE = IF('Space');
export const ESCAPE = IF('Escape');

export const ALT = IF("isAltKey");
export const SHIFT = IF("isShiftKey");
export const META = IF("isMetaKey");
export const CONTROL = IF("isCtrlKey");
export const SELF = IF("self");

export const FIT = IF("fit");
export const PASSIVE = IF("passive");
export const VDOM = IF('vdom');

// event config method
export const DEBOUNCE = (t = 100) => {
  return IF(`debounce(${t})`);
};

export const D1000 = DEBOUNCE(1000)

export const THROTTLE = (t = 100) => {
  return IF(`throttle(${t})`);
};

export const CAPTURE = IF("capture()");
// event config method

// before method

// after method
export const MOVE = (method = "move") => {
  return AFTER(`bodyMouseMove ${method}`);
};
export const END = (method = "end") => {
  return AFTER(`bodyMouseUp ${method}`);
};

export const PREVENT = AFTER(`preventDefault`);
export const STOP = AFTER(`stopPropagation`);

// Predefined LOADER
export const LOAD = (value = "$el") => {
  return LOAD_SAPARATOR + value;
};

export const createRef = (value: any) => {
  if (Boolean(value) === false) return '';

  var id = uuid();
  refManager[id] = value;

  return id;
};

export const getRef = (id: string) => {
  return refManager[id] || '';
};

export const BIND_CHECK_DEFAULT_FUNCTION = () => {
  return true;
};

export const BIND = (value = "$el", checkFieldOrCallback = '') => {
  return (
    BIND_SAPARATOR + value + ( 
      checkFieldOrCallback ?  CHECK_SAPARATOR + createRef(checkFieldOrCallback) : '' 
    ) 
  );
};


export interface CaptureOption {
  passive: boolean;
  capture: boolean;
}

export function addEvent(dom: HTMLElement|undefined, eventName: string, callback: () => void, useCapture: boolean|CaptureOption = false) {
    if (dom) {
      dom.addEventListener(eventName, callback, useCapture);
    }
}

export function removeEvent(dom: HTMLElement|undefined, eventName: string, callback: (() => void)|undefined) {
    if (dom && callback) {
      dom.removeEventListener(eventName, callback);
    }
}

interface PageXY {
  pageX: number;
  pageY: number;
}

export function pos(e: TouchEvent|MouseEvent): PageXY {
    if ( e instanceof TouchEvent && e.touches && e.touches[0]) {
      const { pageX, pageY } = e.touches[0]
      return {pageX, pageY};
    }

    const {pageX, pageY} = e as MouseEvent; 
    return {pageX, pageY};
}

export interface Point {
  x: number; 
  y: number; 
}

export function posXY(e: TouchEvent|MouseEvent): Point {
    var {pageX: x, pageY: y} = pos(e);
    return {x, y};
}
