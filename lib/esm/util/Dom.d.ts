import { KeyValue } from "../types/constants";
export declare class Dom {
    el: HTMLElement | undefined;
    constructor(tag: string | HTMLElement, className?: string, attr?: KeyValue);
    static create(tag: string | HTMLElement, className?: string, attr?: KeyValue): Dom;
    static createByHTML(htmlString: string): Dom | null;
    static createFragment(htmlString: string): DocumentFragment;
    static getScrollTop(): number;
    static getScrollLeft(): number;
    static parse(html: string): Document;
    static body(): Dom;
    isFragment(): boolean;
    setAttr(obj: KeyValue): this | undefined;
    attr(key: string, value?: any): string | this | null | undefined;
    attrKeyValue(keyField: string): KeyValue;
    attrs(...args: string[]): (string | null | undefined)[];
    styles(...args: string[]): any[];
    removeAttr(key: string): this;
    removeStyle(key: string): this;
    is(checkElement: Dom | HTMLElement): boolean;
    isTag(tag: string): boolean;
    closest(cls: string): Dom | null;
    parent(): Dom;
    hasParent(): boolean;
    removeClass(...args: any[]): this;
    hasClass(cls: string): boolean;
    addClass(...args: string[]): this;
    onlyOneClass(cls: string): void;
    toggleClass(cls: string, isForce?: boolean): void;
    html(html: string | HTMLElement | undefined): string | this | undefined;
    htmlDiff(fragment: any): void;
    updateDiff(html: string, rootElement?: string): void;
    updateSVGDiff(html: string, rootElement?: string): void;
    find(selector: string): HTMLElement;
    $(selector: string): Dom | undefined;
    findAll(selector: string): NodeListOf<Element> | undefined;
    $$(selector: string): Dom[];
    empty(): this;
    append(el?: string | Dom | HTMLElement | DocumentFragment): this;
    prepend(el?: string | Dom | HTMLElement | DocumentFragment): this;
    prependHTML(html: string | HTMLElement): Dom;
    appendHTML(html: string | HTMLElement): Dom;
    /**
     * create document fragment with children dom
     */
    createChildrenFragment(): DocumentFragment;
    appendTo(target: Dom | HTMLElement): this;
    remove(): this;
    removeChild(el: Dom | HTMLElement): this;
    text(value?: string | Dom): string | Dom;
    /**
     *
     * $el.css`
     *  border-color: yellow;
     * `
     *
     * @param {*} key
     * @param {*} value
     */
    css(key: string | KeyValue, value?: any): any;
    getComputedStyle(...list: any[]): KeyValue;
    getStyleList(...list: any[]): KeyValue;
    cssText(value: string | undefined): string | Dom;
    cssFloat(key: string): number;
    cssInt(key: string): number;
    px(key: string, value: number): Dom;
    rect(): DOMRect | undefined;
    isSVG(): boolean;
    offsetRect(): {
        x: number | undefined;
        y: number | undefined;
        top: number | undefined;
        left: number | undefined;
        width: number | undefined;
        height: number | undefined;
    };
    offset(): {
        top: number;
        left: number;
    };
    offsetLeft(): number;
    offsetTop(): number;
    position(): DOMRect | {
        top: number;
        left: number;
    } | undefined;
    size(): number[];
    width(): number;
    contentWidth(): number;
    height(): number;
    contentHeight(): number;
    val(value?: string | Dom): string | Dom;
    matches(selector: string): Dom | null;
    get value(): string;
    get files(): File[];
    show(displayType?: string): any;
    hide(): any;
    isHide(): boolean;
    isShow(): boolean;
    toggle(isForce?: boolean): any;
    scrollIntoView(): void;
    setScrollTop(scrollTop: number): this;
    setScrollLeft(scrollLeft: number): this;
    scrollTop(): number | undefined;
    scrollLeft(): number | undefined;
    scrollHeight(): number | undefined;
    scrollWidth(): number | undefined;
    on(eventName: string, callback: () => void, opt1: any): this;
    off(eventName: string, callback: () => void): this;
    getElement(): HTMLElement | undefined;
    createChild(tag: string, className?: string, attrs?: KeyValue, css?: KeyValue): Dom;
    get firstChild(): Dom;
    children(): Dom[];
    childLength(): number | undefined;
    replace(newElement: Dom | HTMLElement): this;
    replaceChild(oldElement: Dom | HTMLElement, newElement: Dom | HTMLElement): this;
    checked(isChecked?: boolean): boolean | Dom;
    click(): this;
    focus(): this;
    blur(): this;
    select(): this;
    fullscreen(): void;
}
