
import { POINTERMOVE, POINTEREND } from "./Event";
import BaseStore from "./BaseStore";
import { UIElement, EVENT, UIElementOptions } from "./UIElement";
import { debounce } from "./functions/func";
import { ADD_BODY_MOUSEMOVE, ADD_BODY_MOUSEUP, ComponentNode } from "../types/constants";
import { Dom } from "./Dom";
import EventMachine from "./EventMachine";

const EMPTY_POS = { x: 0, y: 0 };
const DEFAULT_POS = { x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER };
const MOVE_CHECK_MS = 0;

interface AppProps {
  container?: string|HTMLElement|null|undefined;
  className?: string;
  template?: string;
  components?: {
    [key: string]: ComponentNode
  }
}

interface Point {
  x: number;
  y: number; 
}

interface MoveItem {
  func: (dx: number, dy:number, moveType: string, pressure: boolean) => void; 
  context: EventMachine;
  xy: Point
}

interface AppState {
  bodyEvent?: any;
  pos?: Point;
  lastPos?: Point;
}

export const render = (opt: AppProps): any => {
  class App extends UIElement {
    $container: Dom|undefined = undefined;
    moves: Set<MoveItem>|undefined = undefined;
    ends: Set<MoveItem>|undefined = undefined;
    funcBodyMoves: Function|undefined = undefined;
    state: AppState = {};
    requestId: number = -1; 

    initialize() {

      this.setStore(new BaseStore());
      this.setRoot(this); 

      const container = this.getContainer();

      this.$container = Dom.create(container);
      this.$container.addClass(this.getClassName());

      this.render(this.$container);

      this.initBodyMoves();
    }

    initState () {
      return {
        pos: {},
        oldPos: {}
      }
    }

    initBodyMoves() {
      this.moves = new Set();
      this.ends = new Set();

      this.modifyBodyMoveSecond(MOVE_CHECK_MS);
    }

    modifyBodyMoveSecond(ms = MOVE_CHECK_MS) {
      this.funcBodyMoves = debounce(this.loopBodyMoves.bind(this), ms);
    }

    loopBodyMoves(): void {
      const {bodyEvent, pos, lastPos} = this.state;

      const localLastPos = lastPos || DEFAULT_POS;
      const isNotEqualLastPos = !(localLastPos.x === pos?.x && localLastPos.y === pos?.y);

      if (isNotEqualLastPos && this.moves?.size) {
        this.moves.forEach(v => {
          const dx = (pos?.x || 0) - v.xy.x;
          const dy = (pos?.y || 0) - v.xy.y;
          if (dx != 0 || dy != 0) {
            v.func.call(v.context, dx, dy, 'move', bodyEvent.pressure);
          }
        });

        this.state.lastPos = pos
      }

      if (this.funcBodyMoves) {
        window.requestAnimationFrame(this.funcBodyMoves as FrameRequestCallback);
      }

    }

    removeBodyMoves() {
      const {pos, bodyEvent} = this.state;       
      if (pos) {
        this.ends?.forEach(v => {
          v.func.call(v.context, (pos?.x || 0) - v.xy.x, (pos?.y || 0) - v.xy.y, 'end', bodyEvent.pressure);
        });
      }

      this.moves?.clear();
      this.ends?.clear();
    }

    [EVENT(ADD_BODY_MOUSEMOVE)](func: any, context: any, xy: Point) {
      this.moves?.add({ func, context, xy });
    }

    [EVENT(ADD_BODY_MOUSEUP)](func: any, context: any, xy: Point) {
      this.ends?.add({ func, context, xy });
    }

    getClassName(): string {
      return opt.className || "sapa";
    }

    getContainer(): string|HTMLElement {
      return opt.container || document.body;
    }

    template(): string {
      return `${opt.template}`
    }

    components() {
      return opt.components || {};
    }

    [POINTERMOVE("document")](e: any) {
      var oldPos = this.state.pos || EMPTY_POS;      
      var newPos = e.xy || EMPTY_POS;

      this.setState({bodyEvent : e, pos: newPos, oldPos}, false);

      if (this.requestId === -1 && this.funcBodyMoves) {
        this.requestId = window.requestAnimationFrame(this.funcBodyMoves as FrameRequestCallback);
      }
    }

    [POINTEREND("document")](e: any) {
      var newPos = e.xy || EMPTY_POS;      
      if (e.target.nodeName === 'INPUT' || e.target.nodeName === 'SELECT' || e.target.nodeName === 'TEXTAREA') return;       
      this.setState({bodyEvent : e, pos: newPos}, false);
      this.removeBodyMoves();
      this.requestId = -1;
    }
  }

  return new App(opt as any);
};
