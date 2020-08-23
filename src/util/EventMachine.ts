import {
  CHECK_SAPARATOR,
  CHECK_LOAD_PATTERN,
  LOAD_SAPARATOR,
  LOAD,
  VDOM,
} from "./Event";
import {
  isFunction,
  isArray,
  html,
  keyEach,
  keyMap,
  uuid,
} from "./functions/func";
import DomEventHandler from "./handler/DomEventHandler";
import BindHandler from "./handler/BindHandler";
import { ADD_BODY_MOUSEMOVE, ADD_BODY_MOUSEUP, KeyBoolean, KeyValue, ComponentNode } from "../types/constants";
import { Dom } from "./Dom";
import BaseHandler from "./handler/BaseHandler";
import BaseStore from "./BaseStore";

const REFERENCE_PROPERTY = "ref";
const TEMP_DIV = Dom.create("div");
const QUERY_PROPERTY = `[${REFERENCE_PROPERTY}]`;

export interface SplitTarget {
  target: string;
  param: string;
}

export const splitMethodByKeyword = (arr: string[], keyword: string): any[] => {
  const filterKeys = arr.filter(code => code.indexOf(`${keyword}(`) > -1);
  const filterMaps = filterKeys.map(code => {
    const [target, param] = code
      .split(`${keyword}(`)[1]
      .split(")")[0]
      .trim()
      .split(" ");

    return { target, param };
  });

  return [filterKeys, filterMaps];
};


// collectProps 에서 제외될 메소드 목록 
const expectMethod: KeyBoolean = {
  "constructor": true,
  "initState": true,
  "refresh": true,
  "updateData": true,
  "initializeProperty": true,
  "created": true,
  "getRealEventName": true,
  "initializeStoreEvent": true,
  "destoryStoreEvent": true,
  "destroy": true,
  "emit": true,
  "trigger": true,
  "on": true,
  "off": true,
  "setState": true,
  "_reload": true,
  "render": true,
  "initialize": true,
  "afterRender": true,
  "components": true,
  "getRef": true,
  "parseTemplate": true,
  "childrenIds": true,
  "exists": true,
  "parseProperty": true,
  "parseSourceName": true,
  "parseComponent": true,
  "clean": true,
  "loadTemplate": true,
  "load": true,
  "bindData": true,
  "template": true,
  "eachChildren": true,
  "initializeEvent": true,
  "collectProps": true,
  "filterProps": true,
  "self": true,
  "isAltKey": true,
  "isCtrlKey": true,
  "isShiftKey": true,
  "isMetaKey": true,
  "preventDefault": true,
  "stopPropagation": true,
  "bodyMouseMove": true,
  "bodyMouseUp": true,
}


export interface EventMachineProps {

}

export interface EventMachineOptions {

}

export default class EventMachine implements ComponentNode {
  opt: EventMachineOptions = {};
  props: EventMachineProps = {};
  state: KeyValue;
  prevState: KeyValue;
  refs: KeyValue;
  children: KeyValue;
  id: string;
  handlers: BaseHandler[];
  childComponents: KeyValue;
  childComponentKeys: string[];
  childComponentSet: Map<string, any>; 
  childComponentKeysString: string;
  $el: any;
  sourceName: string;
  parent: EventMachine|undefined;
  _loadMethods: any[]|undefined;
  $store: BaseStore|undefined = undefined;
  $root: EventMachine|undefined = undefined;  

  constructor(opt: EventMachineOptions, props: EventMachineProps) {
    this.state = {};
    this.prevState = {};
    this.refs = {};
    this.children = {};
    this.id = uuid();    
    this.handlers = this.initializeHandler()
    this.childComponents = {}
    this.childComponentKeys = [] 
    this.childComponentSet = new Map();
    this.childComponentKeysString = ''
    this.sourceName = this.constructor.name;

    this.initializeProperty(opt, props);

    this.initComponents();
  }

  setStore (newStore: BaseStore) {
    this.$store = newStore;
  }

  setRoot (newRoot: EventMachine) {
    this.$root = newRoot; 
  }

  initializeProperty (opt: EventMachineOptions, props: EventMachineProps) {

  }

  initComponents() {
    this.childComponents = this.components();
    this.childComponentKeys = Object.keys(this.childComponents)
    this.childComponentSet = new Map();
    this.childComponentKeys.forEach(key => {
      this.childComponentSet.set(key.toLowerCase(), key);
    })
    this.childComponentKeysString = [...this.childComponentSet.keys()].join(',');
  }

  initializeHandler () {
    return [
      new BindHandler(this),
      new DomEventHandler(this)
    ]
  }

  initState() {
    return {};
  }

  setState(state = {}, isLoad = true) {
    this.prevState = this.state;
    this.state = Object.assign({}, this.state, state );
    if (isLoad) {
      this.load();
    }
  }

  _reload(props: any) {
    this.props = props;
    this.state = {}; 
    this.setState(this.initState(), false);
    this.refresh();
  }

  render($container: Dom|undefined) {
    this.$el = this.parseTemplate(this.template());
    this.refs.$el = this.$el;

    if ($container) {
      $container.append(this.$el);
    }

    this.load();

    this.afterRender();
  }

  initialize() {
    this.state = this.initState();
  }
  afterRender() {}
  components() {
    return {};
  }

  getRef(...args: any[]) {
    const key = args.join('')
    return this.refs[key];
  }

  getMethod(methodName: string) {
    return (this as any)[methodName]
  }

  parseTemplate(htmlString: string|string[], isLoad = false) {
    let newString = ''

    if (isArray(htmlString)) {
      newString = (htmlString as string[]).join('') as string;
    } else {
      newString = htmlString as string; 
    }

    const list = (TEMP_DIV?.html(html`${newString}`) as Dom).children();

    list.forEach($el => {
      const ref = $el.attr(REFERENCE_PROPERTY) as string
      if (ref) {
        this.refs[ref] = $el;
      }

      const refs = $el.$$(QUERY_PROPERTY);
      let temp: KeyValue = {} 
      refs.forEach($dom => {

        const name = $dom.attr(REFERENCE_PROPERTY) as string;
        if (temp[name]) {
          console.warn(`${ref} is duplicated. - ${this.sourceName}`, this)
        } else {
          temp[name] = true; 
        }

        this.refs[name] = $dom;        
      });


    });

    if (!isLoad) {
      return list[0];
    }

    return TEMP_DIV.createChildrenFragment();
  }

  childrenIds(): string[] {
    return  keyMap(this.children, (key, obj) => {
      return obj.id as string;
    }) as string[]
  }

  exists () {

    if (this.parent) {
      if (isFunction(this.parent.childrenIds)) {
        return this.parent.childrenIds().indexOf(this.id) > -1 
      }
    }

    return true  
  }

  parseProperty ($dom: Dom) {
    let props: KeyValue = {};

    // parse properties 

    Object.keys($dom?.el?.attributes || {}).forEach((key: string) => {
      const t = ($dom?.el?.attributes as any)[key];

      props[t.nodeName] = t.nodeValue;      
    })

    $dom.$$('property').forEach($p => {
      const [name, value, type] = $p.attrs('name', 'value', 'type')

      let realValue = value || $p.text() as string;

      if (type === 'json') {            
        realValue = JSON.parse(realValue);
      }
    
      if (name) {
        props[name] = realValue; 
      }

    })

    return props;
  }

  parseSourceName(obj: EventMachine): any[] {

    if (obj.parent) {
      return [obj.sourceName, ...this.parseSourceName(obj.parent)]
    }

    return [obj.sourceName]
  }

  parseComponent() {
    const $el = this.$el;

    let targets = [] 
    if (this.childComponentKeysString) {
      targets = $el.$$(this.childComponentKeysString);
    }

    
    targets.forEach(($dom: Dom) => {
      var tagName = $dom?.el?.tagName.toLowerCase() as string;
      var ComponentName = this.childComponentSet.get(tagName);
      var Component = this.childComponents[ComponentName];
      let props = this.parseProperty($dom);

      // create component 
      let refName = $dom.attr(REFERENCE_PROPERTY) as string;
      var instance = null; 
      if (this.children[refName]) {
        instance = this.children[refName] 
        instance._reload(props);
      } else {
        instance = new Component(this, props);

        this.children[refName || instance.id] = instance;

        instance.render();
      }
      
      $dom.replace(instance.$el);      
  
    })

    keyEach(this.children, (key, obj) => {
      if (obj && obj.clean()) {
        delete this.children[key]
      }
    })
  }

  clean () {
    if (this.$el && !this.$el.hasParent()) {

      keyEach(this.children, (key, child) => {
        child.clean();
      })

      this.destroy();  

      this.$el = null;
      return true; 
    }
  }

  /**
   * refresh 는 load 함수들을 실행한다. 
   */
  refresh() {
    this.load()
  }

  /**
   * 특정 load 함수를 실행한다.  문자열을 그대로 return 한다. 
   * @param  {...any} args 
   */
  loadTemplate (...args: any[]) {
    return this.getMethod(LOAD(args.join(''))).call(this)
  }

  load(...args: any[]) {
    if (!this._loadMethods) {
      this._loadMethods = this.filterProps(CHECK_LOAD_PATTERN);
    }

    this._loadMethods
    .filter(callbackName => {
      const elName = callbackName.split(LOAD_SAPARATOR)[1].split(CHECK_SAPARATOR)[0];
      if (!args.length) return true; 
      return args.indexOf(elName) > -1
    })
    .forEach(callbackName => {
      let methodName = callbackName.split(LOAD_SAPARATOR)[1];
      var [elName, ...checker] = methodName.split(CHECK_SAPARATOR).map((it: string) => it.trim())

      checker = checker.map((it: string) => it.trim())
      
      const isVdom = Boolean(checker.filter((it: string) => VDOM.includes(it)).length);

      if (this.refs[elName]) {
        
        var newTemplate = this.getMethod(callbackName).call(this, ...args);

        // create fragment 
        const fragment = this.parseTemplate(newTemplate, true);
        if (isVdom) {
          this.refs[elName].htmlDiff(fragment);
        } else {
          this.refs[elName].html(fragment);
        }

      }
    });

    this.runHandlers('initialize');

    this.bindData();

    this.parseComponent();

  }

  runHandlers(func = 'run', ...args: any[]) {
    this.handlers.forEach(h => (h as any)[func](...args));
  }

  bindData (...args: any[]) {
    this.runHandlers('load', ...args);
  }

  // 기본 템플릿 지정
  template() {
    return `<div></div>`;
  }

  eachChildren(callback: (Component: any) => void) {
    if (!isFunction(callback)) return;

    keyEach(this.children, (_, Component) => {
      callback(Component);
    });
  }

  rerender () {
    var $parent = this.$el.parent();
    this.destroy();
    this.render($parent);  
  }

  /**
   * @deprecated 
   * render 이후에 부를려고 했는데  이미 Dom Event 는 render 이후에 자동으로 불리게 되어 있다. 
   * 현재는 DomEvent, Bind 기준으로만 작성하도록 한다. 
   * 나머지 라이프 사이클은 다음에 고민해보자. 
   * 이벤트를 초기화한다.
   */
  // initializeEvent() {
  //   this.runHandlers('initialize');
  // }

  /**
   * 자원을 해제한다.
   * 이것도 역시 자식 컴포넌트까지 제어하기 때문에 가장 최상위 부모에서 한번만 호출되도 된다.
   */
  destroy() {
    this.eachChildren(childComponent => {
      childComponent.destroy();
    });

    this.runHandlers('destroy');
    this.$el.remove();
    this.$el = null; 
    this.refs = {} 
    this.children = {} 
  }

  /**
   * property 수집하기
   * 상위 클래스의 모든 property 를 수집해서 리턴한다.
   */
  collectProps() {

    var p = this.getMethod('__proto__');
    var results = [];
    do {
      var isObject = p instanceof Object;

      if (isObject === false) {
        break;
      }
      const names = Object.getOwnPropertyNames(p).filter(name => {
        return this && isFunction((this as any)[name]) && !expectMethod[name];
      });

      results.push(...names);
      p = p.__proto__;
    } while (p);

    return results;
  }

  filterProps(pattern: RegExp) {
    return this.collectProps().filter(key => {
      return key.match(pattern);
    });
  }

  /* magic check method  */

  self(e: any): boolean {
    return Boolean(e && e.$dt && e.$dt.is(e.target));
  }
  isAltKey(e: any): boolean {
    return Boolean(e.altKey);
  }
  isCtrlKey(e: any): boolean {
    return Boolean(e.ctrlKey);
  }
  isShiftKey(e: any): boolean {
    return Boolean(e.shiftKey);
  }
  isMetaKey(e: any): boolean {
    return Boolean(e.metaKey || e.key == 'Meta' || e.code.indexOf('Meta') > -1);
  }

  /** before check method */

  /* after check method */

  preventDefault(e: any) {
    e.preventDefault();
    return true;
  }

  stopPropagation(e: any) {
    e.stopPropagation();
    return true;
  }


  emit(event: string, ...args: any[]) {}

  trigger(event: string, ...args: any[]) {}  

  bodyMouseMove(e: any, methodName: string) {
    if (this.getMethod(methodName)) {
      this.emit(ADD_BODY_MOUSEMOVE, this.getMethod(methodName), this, e.xy);
    }
  }

  bodyMouseUp(e: any, methodName: string) {
    if (this.getMethod(methodName)) {
      this.emit(ADD_BODY_MOUSEUP, this.getMethod(methodName), this, e.xy);
    }
  }

}
