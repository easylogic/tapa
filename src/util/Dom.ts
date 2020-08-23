
import {
  isString,
  isUndefined,
  isNotString,
  isNotUndefined,
  keyEach
} from "./functions/func";
import { DomDiff } from "./DomDiff";
import { KeyValue } from "../types/constants";

export class Dom {
  el: HTMLElement|undefined = undefined;

  constructor(tag: string|HTMLElement, className: string = '', attr: KeyValue = {}) {
    if (tag instanceof HTMLElement) {
      this.el = tag;
    } else {
      var el = document.createElement(tag as string);

      if (className) {
        el.className = className;
      }

      attr = attr || {};

      keyEach(attr, (key, value) => {
        el.setAttribute(key, value);
      })

      this.el = el;
    }
  }

  static create (tag: string|HTMLElement, className?: string, attr?: KeyValue): Dom {
    return new Dom(tag, className, attr);
  }
 
  static createByHTML (htmlString: string) {
    var div = Dom.create('div')
    var list = (div.html(htmlString) as Dom).children();

    if (list.length) {
      return Dom.create(list[0].el as HTMLElement);
    }

    return null; 
  }

  static createFragment (htmlString: string): DocumentFragment {
    var div = Dom.create('div')
    div.html(htmlString);

    return Dom.create(div.el || 'div').createChildrenFragment();
  }

  static getScrollTop() {
    return Math.max(
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
  }

  static getScrollLeft() {
    return Math.max(
      window.pageXOffset,
      document.documentElement.scrollLeft,
      document.body.scrollLeft
    );
  }

  static parse(html: string) {
    var parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
  }

  static body () {
    return Dom.create(document.body)
  }

  isFragment () {
    return this.el?.nodeType === 11;
  }

  setAttr (obj: KeyValue) {
    if (this.isFragment()) return; 
    Object.keys(obj).forEach(key => {
      this.attr(key, obj[key])
    })
    return this;  
  }

  attr(key: string, value?: any) {
    if (this.isFragment()) return; 
    if (arguments.length == 1) {
      if (this.el?.getAttribute) {
        return this.el?.getAttribute(key);
      } else {
        return undefined;
      }

    }

    this.el?.setAttribute(key, value);

    return this;
  }

  attrKeyValue(keyField: string) {
    if (this.isFragment()) return {};     
    return {
      [this.el?.getAttribute(keyField) || '']: this.val()
    } as KeyValue
  }

  attrs(...args: string[]) {
    if (this.isFragment()) return [];
    return args.map(key => {
      return this.el?.getAttribute(key);
    });
  }

  styles(...args: string[]) {
    return args.map((key: string) => {
      return (this.el?.style as any)[key];
    });
  }  

  removeAttr(key: string) {
    this.el?.removeAttribute(key);

    return this;
  }

  removeStyle(key: string) {
    this.el?.style.removeProperty(key);
    return this;
  }

  is(checkElement: Dom|HTMLElement) {
    return this.el === ((checkElement as Dom).el || checkElement);
  }

  isTag(tag: string) {
    return this.el?.tagName.toLowerCase() === tag.toLowerCase()
  }

  closest(cls: string) {
    let temp: Dom = this;
    let checkCls = false;

    while (!(checkCls = temp.hasClass(cls))) {
      if (temp.el?.parentNode) {
        temp = Dom.create(temp.el.parentNode as HTMLElement);
      } else {
        return null;
      }
    }

    if (checkCls) {
      return temp;
    }

    return null;
  }

  parent() {
    return Dom.create(this.el?.parentNode as HTMLElement);
  }

  hasParent () {
    return !!this.el?.parentNode
  }

  removeClass(...args: any[]) {
    this.el?.classList.remove(...args);
    return this;
  }

  hasClass(cls: string) {
    if (!this.el?.classList) return false;
    return this.el?.classList.contains(cls);
  }

  addClass(...args: string[]) {
    this.el?.classList.add(...args);

    return this;
  }

  onlyOneClass(cls: string) {
    var parent = this.parent();

    parent.children().forEach(it => {
      it.removeClass(cls);
    })

    this.addClass(cls);
  }

  toggleClass(cls: string, isForce?: boolean) {
    this.el?.classList.toggle(cls, isForce);
  }

  html(html: string|HTMLElement|undefined) {
    if (isUndefined(html)) {
      return this.el?.innerHTML;
    }

    if (isString(html) && this.el) {
      this.el.innerHTML = html as string;
    } else {
      this.empty().append(html);
    }

    return this;
  }

  htmlDiff(fragment: any) {
    DomDiff(this, fragment);
  }
  updateDiff (html: string, rootElement = 'div') {
    DomDiff(this, Dom.create(rootElement).html(html))
  }

  updateSVGDiff (html: string, rootElement = 'div') {
    const target = Dom.create(rootElement).html(`<svg>${html}</svg>`) as Dom;
    DomDiff(this,target.firstChild)
  }  

  find(selector: string): HTMLElement {
    return this.el?.querySelector(selector) as HTMLElement;
  }

  $(selector: string): Dom|undefined  {
    var node = this.find(selector);
    return node ? Dom.create(node) : undefined;
  }

  findAll(selector: string) {
    return this.el?.querySelectorAll(selector);
  }

  $$(selector: string) {
    var arr = [...(this.findAll(selector) || [])] as HTMLElement[];
    return arr.map((it: HTMLElement) => {
      return Dom.create(it);
    });
  }

  empty() {
    while (this.el?.firstChild) this.el?.removeChild(this.el?.firstChild);
    return this;
  }

  append(el?: string|Dom|HTMLElement|DocumentFragment) {
    if (isString(el)) {
      this.el?.appendChild(document.createTextNode(el as string));
    } else if (el instanceof Dom && el.el) {
      this.el?.appendChild(el.el);
    } else if (el instanceof DocumentFragment) {      
      this.el?.appendChild(el);      
    } else if (el instanceof HTMLElement) {      
      this.el?.appendChild(el);
    }

    return this;
  }

  prepend(el?: string|Dom|HTMLElement|DocumentFragment) {
    if (isString(el)) {
      this.el?.prepend(document.createTextNode(el as string));
    } else if (el instanceof Dom && el.el) {
      this.el?.prepend(el.el);
    } else {
      this.el?.prepend(el as HTMLElement);
    }

    return this;    
  }

  prependHTML(html: string|HTMLElement) {
    var $dom = Dom.create("div").html(html) as Dom;

    this.prepend($dom.createChildrenFragment());

    return $dom;
  }

  appendHTML(html: string|HTMLElement) {
    var $dom = Dom.create("div").html(html) as Dom

    this.append($dom.createChildrenFragment());

    return $dom;
  }

  /**
   * create document fragment with children dom
   */
  createChildrenFragment(): DocumentFragment {
    const list = this.children();

    var fragment = document.createDocumentFragment();
    list.forEach($el => fragment.appendChild($el.el as HTMLElement));

    return fragment;
  }

  appendTo(target: Dom|HTMLElement) {
    const t = (target instanceof Dom) ? target.el : target;

    t?.appendChild(this.el as HTMLElement);

    return this;
  }

  remove() {
    if (this.el?.parentNode) {
      this.el?.parentNode.removeChild(this.el);
    }

    return this;
  }

  removeChild(el: Dom|HTMLElement) {
    const t = el instanceof Dom ? el.el : el; 

    this.el?.removeChild(t as HTMLElement);
    return this; 
  }

  text(value?: string|Dom): string|Dom {
    if (isUndefined(value)) {
      return this.el?.textContent as string;
    } else {
      var tempText = value;

      if (value instanceof Dom) {
        tempText = value.text() as string;
      }

      if (this.el) {
        this.el.textContent = tempText as string;
      }
      
      return this;
    }
  }

  /**
   *
   * $el.css`
   *  border-color: yellow;
   * `
   *
   * @param {*} key
   * @param {*} value
   */

  css(key: string|KeyValue, value?: any) {
    if (arguments.length === 2) {
      Object.assign(this.el?.style, {[key as string]: value});
    } else if (isNotUndefined(key)) {
      if (isString(key)) {
        const computedStyle = getComputedStyle(this.el as HTMLElement) as KeyValue;
        return computedStyle[key as string];  
      } else {
        Object.assign(this.el?.style, key);
      }
    }

    return this;
  }

  getComputedStyle (...list: any[]) {
    const css = getComputedStyle(this.el as HTMLElement);

    let obj = {} as KeyValue
    list.forEach(it => {
      obj[it] = css[it]
    })

    return obj; 
  }

  getStyleList(...list: any[]) {
    let style = {} as KeyValue;

    const len:number = this.el?.style.length || 0;
    for (var i = 0; i < len; i++) {
      var key = this.el?.style[i] as string;

      style[key] = (this.el?.style as KeyValue)[key];
    }

    list.forEach(key => {
      style[key] = this.css(key);
    });

    return style;
  }

  cssText(value: string|undefined):string|Dom {
    if (isUndefined(value)) {
      return this.el?.style.cssText as string;
    }

    if (this.el) {
      this.el.style.cssText = value as string;
    }

    return this;
  }

  cssFloat(key: string): number {
    return parseFloat(this.css(key));
  }

  cssInt(key: string): number {
    return parseInt(this.css(key));
  }

  px(key: string, value: number): Dom {
    return this.css(key, value + 'px');
  }

  rect() {
    return this.el?.getBoundingClientRect();
  }

  isSVG () {
    return this.el?.tagName.toUpperCase() === 'SVG';
  }

  offsetRect() {

    if (this.isSVG()) {
      const parentBox = this.parent().rect() as DOMRect;
      const box = this.rect() as DOMRect;

      return {
        x: box.x - parentBox.x,
        y: box.y - parentBox.y,
        top: box.x - parentBox.x,
        left: box.y - parentBox.y,
        width: box.width,
        height: box.height
      }
    }

    return {
      x: this.el?.offsetLeft,
      y: this.el?.offsetTop,
      top: this.el?.offsetTop,
      left: this.el?.offsetLeft,
      width: this.el?.offsetWidth,
      height: this.el?.offsetHeight
    };
  }

  offset() {
    var rect = this.rect() as DOMRect;

    var scrollTop = Dom.getScrollTop();
    var scrollLeft = Dom.getScrollLeft();

    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft
    };
  }

  offsetLeft() {
    return this.offset().left;
  }

  offsetTop() {
    return this.offset().top;
  }

  position() {
    if (this.el?.style.top) {
      return {
        top: parseFloat(this.css("top")),
        left: parseFloat(this.css("left"))
      };
    } else {
      return this.rect();
    }
  }

  size() {
    return [this.width(), this.height()];
  }

  width() {
    return this.el?.offsetWidth || (this.rect() as DOMRect).width;
  }

  contentWidth() {
    return (
      this.width() -
      this.cssFloat("padding-left") -
      this.cssFloat("padding-right")
    );
  }

  height() {
    return this.el?.offsetHeight || (this.rect() as DOMRect).height;
  }

  contentHeight() {
    return (
      this.height() -
      this.cssFloat("padding-top") -
      this.cssFloat("padding-bottom")
    );
  }

  val(value?: string|Dom): string|Dom {
    if (isUndefined(value)) {
      return (this.el as HTMLInputElement).value;
    } else if (isNotUndefined(value)) {
      var tempValue = value;
      if (value instanceof Dom) {
        tempValue = value.val();
      }

      let el = this.el as HTMLInputElement

      el.value = tempValue as string;
    }

    return this;
  }

  matches (selector: string): Dom|null {
    if (this.el) {

      if (!this.el?.matches) return null;

      if (this.el?.matches(selector)) {
        return this;
      }
      return this.parent().matches(selector);
    }

    return null;
}  


  get value(): string {
    if (this.el) {
      return (this.el as HTMLInputElement).value as string;
    }

    return ''; 
  }

  get files() {
    const el = this.el as HTMLInputElement;
    return el?.files ? [...el?.files] : [];
  }

  show(displayType = "block") {
    return this.css("display", displayType != "none" ? displayType : "block");
  }

  hide() {
    return this.css("display", "none");
  }

  isHide () {
    return this.css("display") == "none"
  }

  isShow () {
    return !this.isHide();
  }

  toggle(isForce: boolean = false) {
    var currentHide = this.isHide();

    if (arguments.length == 1) {
      if (isForce) {
        return this.show();
      } else {
        return this.hide();
      }
    } else {
      if (currentHide) {
        return this.show();
      } else {
        return this.hide();
      }
    }
  }

  scrollIntoView () {
    this.el?.scrollIntoView()
  }

  setScrollTop(scrollTop: number) {
    if (this.el) {
      this.el.scrollTop = scrollTop;
    }

    return this;
  }

  setScrollLeft(scrollLeft: number) {
    if (this.el) {
      this.el.scrollLeft = scrollLeft;
    }

    return this;
  }

  scrollTop() {
    if (this.el === document.body) {
      return Dom.getScrollTop();
    }

    return this.el?.scrollTop;
  }

  scrollLeft() {
    if (this.el === document.body) {
      return Dom.getScrollLeft();
    }

    return this.el?.scrollLeft;
  }

  scrollHeight() {
    return this.el?.scrollHeight;
  }

  scrollWidth() {
    return this.el?.scrollWidth;
  }  

  on(eventName: string, callback: () => void, opt1:any) {
    this.el?.addEventListener(eventName, callback, opt1);

    return this;
  }

  off(eventName:string, callback: () => void) {
    this.el?.removeEventListener(eventName, callback);

    return this;
  }

  getElement() {
    return this.el;
  }

  createChild(tag: string, className = '', attrs: KeyValue = {}, css: KeyValue = {}) {
    let $element = Dom.create(tag, className, attrs);
    $element.css(css);

    this.append($element);

    return $element;
  }

  get firstChild(): Dom {
    return Dom.create(this.el?.firstElementChild as HTMLElement);
  }

  children() {
    var element = this.el?.firstElementChild;

    if (!element) {
      return [];
    }

    var results = [];

    do {
      results.push(Dom.create(element as HTMLElement));
      element = element.nextElementSibling;
    } while (element);

    return results;
  }

  childLength() {
    return this.el?.children.length;
  }

  replace(newElement: Dom|HTMLElement) {

    if (this.el?.parentNode) {
      if (newElement instanceof Dom) {
        this.el?.parentNode.replaceChild(newElement.el as Node, this.el);
      } else {
        this.el?.parentNode.replaceChild(newElement, this.el);
      }

    }

    return this;
  }

  replaceChild(oldElement:Dom|HTMLElement, newElement:Dom|HTMLElement) {

    const oldNode = (oldElement instanceof Dom) ? oldElement.el : oldElement;
    const newNode = (newElement instanceof Dom) ? newElement.el : newElement;


    this.el?.replaceChild(newNode as Node, oldNode as Node);

    return this;
  }  

  checked(isChecked: boolean = false): boolean|Dom {
    if (arguments.length == 0) {
      return Boolean((this.el as HTMLInputElement).checked);
    }

    if (this.el) {
      (this.el as HTMLInputElement).checked = Boolean(isChecked);
    }


    return this;
  }


  click () {
    this.el?.click();

    return this; 
  }  

  focus() {
    this.el?.focus();

    return this;
  }

  blur() {
    this.el?.blur();

    return this;
  }

  select() {
    (this.el as HTMLInputElement).select();

    return this;
  }

  /* utility */ 
  fullscreen () {
    const element = this.el; 
    
    if (element?.requestFullscreen) {
      element.requestFullscreen();
    }
  }
}
