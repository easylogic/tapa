import EventMachine, { splitMethodByKeyword } from "./EventMachine";
import { uuid } from "./functions/func";
import BaseStore from "./BaseStore";

const REG_STORE_MULTI_PATTERN = /^ME@/;

const MULTI_PREFIX = "ME@";
const SPLITTER = "|";

export const PIPE = (...args: string[]) => {
  return args.join(SPLITTER);
};

export const EVENT = (...args: string[]) => {
  return MULTI_PREFIX + PIPE(...args);
};

export interface UIElementProps {

}

export interface UIElementOptions {
  $store?: BaseStore;
  $root?: UIElement;
}


export interface SplitTarget {
  target: string;
  param: string;
}

export class UIElement extends EventMachine {
  opt: UIElementOptions = {};
  parent: UIElement|undefined = undefined;
  props: UIElementProps = {};
  source: string = ''; 
  sourceName: string = ''; 

  constructor(opt: UIElementOptions, props: UIElementProps = {}) {
    super(opt, props);

    this.created();

    this.initialize();

    this.initializeStoreEvent();

  }

  /**
   * UIElement instance 에 필요한 기본 속성 설정 
   */
  initializeProperty (opt: UIElementOptions|UIElement, props: UIElementProps = {}) {

    this.opt = (opt || {}) as UIElementOptions;
    this.parent = this.opt as UIElement;
    this.props = props;
    this.source = uuid();
    this.sourceName = this.constructor.name;

    if (opt && (opt as UIElementOptions).$store) this.$store = opt.$store;
    if (opt && (opt as UIElementOptions).$root) this.$root = opt.$root;
  }

  created() {}

  getRealEventName(e: any, s = MULTI_PREFIX) {
    var startIndex = e.indexOf(s);
    return e.substr(startIndex < 0 ? 0 : startIndex + s.length);
  }

  /**
   * initialize store event
   *
   * you can define '@xxx' method(event) in UIElement
   *
   *
   */
  initializeStoreEvent() {

    this.filterProps(REG_STORE_MULTI_PATTERN).forEach(key => {
      const events = this.getRealEventName(key, MULTI_PREFIX);

      // support deboounce for store event 
      var [methods, params] = splitMethodByKeyword(events.split(SPLITTER), 'debounce');

      var debounceSecond = 0 
      if (methods.length) {
        debounceSecond = +(params[0] as SplitTarget).target || 0 
      }

      events
        .split(SPLITTER)
        .filter((it: string) => {
          return methods.indexOf(it as string) === -1
        })
        .map((it:string) => it.trim())
        .forEach((e: string) => {
          var callback = (this as any)[key].bind(this);
          callback.displayName = `${this.sourceName}.${e}`;
          callback.source = this.source;
          this.$store?.on(e, callback, this, debounceSecond);
      });
    });
  }

  destoryStoreEvent() {
    this.$store?.offAll(this);
  }

  destroy () {
    super.destroy()

    this.destoryStoreEvent();
  }

  rerender() {
    super.rerender();

    this.initialize();

    this.initializeStoreEvent();
  }


  emit(event: string, ...args: any[]) {
    if (this.$store) {
      this.$store.source = this.source;
      this.$store.sourceContext = this; 
      this.$store?.emit(event, ...args);
    }

  }

  trigger(event: string, ...args: any[]) {
    if (this.$store) {
      this.$store.source = this.source;
      this.$store?.trigger(event, ...args);
    }

  }

  on (message:string, callback: () => void) {
    this.$store?.on(message, callback, this);
  }

  off (message: string, callback: () => void) {
    this.$store?.off(message, callback);
  }
}
