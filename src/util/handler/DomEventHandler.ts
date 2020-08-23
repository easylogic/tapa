import BaseHandler from "./BaseHandler";
import { CHECK_SAPARATOR, DOM_EVENT_SAPARATOR, SAPARATOR, NAME_SAPARATOR, CHECK_DOM_EVENT_PATTERN, addEvent, removeEvent, posXY, Point, CaptureOption } from "../Event";
import { debounce, throttle, isNotUndefined, isFunction } from "../functions/func";
import { Dom } from "../Dom";
import { KeyBoolean } from "../../types/constants";

const scrollBlockingEvents: KeyBoolean = {
    'touchstart': true,
    'touchmove': true,
    'mousedown': true,
    'mouseup': true,
    'mousemove': true, 
    'wheel': true,
    'mousewheel': true
}

export interface DomEventParser {
  eventName: string;
  codes: any[];
  captures: any[];
  afterMethods: any[];
  beforeMethods: any[];
  debounceMethods: any[];
  throttleMethods: any[];
  checkMethodList: any[];
  dom?: HTMLElement;
  delegate?: string;
  callback?: (e: any, $dt?: Dom, xy?: Point) => void; 
}

export default class DomEventHandler extends BaseHandler {
  _domEvents: any[]|undefined = undefined;
  _bindings: DomEventParser[]|undefined = []

    initialize() {
        this.destroy();

        if (!this._domEvents) {
          this._domEvents = this.filterProps(CHECK_DOM_EVENT_PATTERN)
        }
        this._domEvents.forEach(key => this.parseEvent(key));
    }

    destroy() {
        this.removeEventAll();
    }


    removeEventAll() {
        this.getBindings()?.forEach((obj: DomEventParser) => {
          this.removeEvent(obj);
        });
        this.initBindings();
    }

    removeEvent({ eventName, dom, callback }: DomEventParser) {
        removeEvent(dom, eventName, callback as () => void);
    }    

    getBindings() {
        if (!this._bindings) {
          this.initBindings();
        }
    
        return this._bindings;
    }

    addBinding(obj: DomEventParser) {
        this.getBindings()?.push(obj);
    }

    initBindings() {
        this._bindings = [];
    }    


    matchPath (el: HTMLElement, selector: string|undefined): HTMLElement|undefined {
        if (el) {
          if (selector && el.matches(selector)) {
            return el;
          }
          return this.matchPath(el.parentElement as HTMLElement, selector);
        }
        return undefined;
    }
      
    hasDelegate (e: any, eventObject: DomEventParser) {
        return this.matchPath(e.target || e.srcElement, eventObject?.delegate);
    }
      
    makeCallback (eventObject: DomEventParser, callback: () => void) {
        if (eventObject.delegate) {
          return this.makeDelegateCallback(eventObject, callback);
        } else {
          return this.makeDefaultCallback(eventObject, callback);
        }
    }
      
    makeDefaultCallback (eventObject: DomEventParser, callback: () => void) {
        return (e: any) => {
          var returnValue = this.runEventCallback(e, eventObject, callback);
          if (isNotUndefined(returnValue)) {
            return returnValue;
          }
        };
    }
      
    makeDelegateCallback (eventObject: DomEventParser, callback: () => void) {
        return (e: any) => {
          const delegateTarget = this.hasDelegate(e, eventObject);
      
          if (delegateTarget) {
            // delegate target 이 있는 경우만 callback 실행
            e.$dt = Dom.create(delegateTarget);      
      
            var returnValue = this.runEventCallback(e, eventObject, callback);
            if (isNotUndefined(returnValue)) {
              return returnValue;
            }
          }
        };
    }
      
    runEventCallback (e: any, eventObject: DomEventParser, callback: (e: any, $dt: Dom, xy: Point) => void) {
        const context = this.context;
        e.xy = posXY(e);
      
        if (eventObject.beforeMethods.length) {
          eventObject.beforeMethods.every(before => {
            return context?.getMethod(before.target).call(context, e, before.param);
          });
        }
      
        if (this.checkEventType(e, eventObject)) {
          var returnValue = callback(e, e.$dt, e.xy) as any;
      
          if (returnValue !== false && eventObject.afterMethods.length) {
            eventObject.afterMethods.forEach(after =>
              context?.getMethod(after.target).call(context, e, after.param)
            );
          }
      
          return returnValue;
        }
    }
      
    checkEventType (e: any, eventObject: DomEventParser) {
        const context = this.context;
        // 특정 keycode 를 가지고 있는지 체크
        var hasKeyCode = true;
        if (eventObject.codes.length) {
          hasKeyCode =
            (e.code ? eventObject.codes.indexOf(e.code.toLowerCase()) > -1 : false) ||
            (e.key ? eventObject.codes.indexOf(e.key.toLowerCase()) > -1 : false);
        }
      
        // 체크 메소드들은 모든 메소드를 다 적용해야한다.
        var isAllCheck = true;
        if (eventObject.checkMethodList.length) {
          isAllCheck = eventObject.checkMethodList.every(field => {
            var fieldValue = context?.getMethod(field);
            if (isFunction(fieldValue) && fieldValue) {
              // check method
              return fieldValue.call(context, e);
            } else if (isNotUndefined(fieldValue)) {
              // check field value
              return Boolean(fieldValue);
            }
            return true;
          });
        }
      
        return hasKeyCode && isAllCheck;
    }
      
    getDefaultDomElement(dom:string) {

        const context = this.context;
        let el;
      
        if (dom) {
          el = context?.refs[dom] || context?.getMethod(dom) || (window as any)[dom];
        } else {
          el = context?.$el;
        }
      
        if (el instanceof Dom) {
          return el.getElement();
        }
      
        return el;
    };
      
    getDefaultEventObject (eventName: string, checkMethodFilters: string[]): DomEventParser {
        const context = this.context;
        let arr = checkMethodFilters;
      
        // context 에 속한 변수나 메소드 리스트 체크
        const checkMethodList = arr.filter((code: string) => !!context?.getMethod(code));
      
        // 이벤트 정의 시점에 적용 되어야 하는 것들은 모두 method() 화 해서 정의한다.
        const [afters, afterMethods] = this.splitMethodByKeyword(arr, "after");
        const [befores, beforeMethods] = this.splitMethodByKeyword(arr, "before");
        const [debounces, debounceMethods] = this.splitMethodByKeyword(arr, "debounce");
        const [throttles, throttleMethods] = this.splitMethodByKeyword(arr, "throttle");
        const [captures] = this.splitMethodByKeyword(arr, "capture");
      
        // 위의 5개 필터 이외에 있는 코드들은 keycode 로 인식한다.
        const filteredList = [
          ...checkMethodList,
          ...afters,
          ...befores,
          ...debounces,
          ...throttles,
          ...captures
        ];
      
        var codes = arr
          .filter(code => filteredList.indexOf(code) === -1)
          .map(code => code.toLowerCase());
      
        return {
          eventName,
          codes,
          captures,
          afterMethods,
          beforeMethods,
          debounceMethods,
          throttleMethods,
          checkMethodList
        };
    }
      
      
    addEvent (eventObject: DomEventParser, callback: () => void) {
        eventObject.callback = this.makeCallback(eventObject, callback);
        this.addBinding(eventObject);
      
        const hasCapture = !!eventObject.captures.length
        let options:boolean|CaptureOption = hasCapture
      
        if (scrollBlockingEvents[eventObject.eventName]) {
          options = {
            passive: true,
            capture: hasCapture
          }
        }
      
        addEvent(
          eventObject.dom,
          eventObject.eventName,
          eventObject.callback as () => void,
          options
        );
    }
      
    bindingEvent ( [eventName, dom, ...delegate]: any[], checkMethodFilters: any[], callback: () => void ) {
        let eventObject = this.getDefaultEventObject(eventName, checkMethodFilters);
      
        eventObject.dom = this.getDefaultDomElement(dom);
        eventObject.delegate = delegate.join(SAPARATOR);
      
        if (eventObject.debounceMethods.length) {
          var debounceTime = +eventObject.debounceMethods[0].target;
          callback = debounce(callback, debounceTime);
        } else if (eventObject.throttleMethods.length) {
          var throttleTime = +eventObject.throttleMethods[0].target;
          callback = throttle(callback, throttleTime);
        }
      
        this.addEvent(eventObject, callback);
      };
      
    getEventNames (eventName: string) {
        let results: string[] = [];
        
        eventName.split(NAME_SAPARATOR).forEach(e => {
            var arr = e.split(NAME_SAPARATOR);
        
            results.push(...arr);
        });
        
        return results;
    }
      
    parseEvent (key: string) {
        const context = this.context;
        let checkMethodFilters = key.split(CHECK_SAPARATOR).map(it => it.trim());
        
        var prefix = checkMethodFilters.shift() as string; 
        var eventSelectorAndBehave = prefix.split(DOM_EVENT_SAPARATOR)[1];
        
        var arr = eventSelectorAndBehave.split(SAPARATOR);
        var eventNames = this.getEventNames(arr[0]);
        var callback = context?.getMethod(key).bind(context);
        
        eventNames.forEach(eventName => {
            arr[0] = eventName
            this.bindingEvent(arr, checkMethodFilters, callback);
        });
    }  
}