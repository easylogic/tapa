import BaseHandler from "./BaseHandler";
import { Point } from "../Event";
import { Dom } from "../Dom";
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
    _domEvents: any[] | undefined;
    _bindings: DomEventParser[] | undefined;
    initialize(): void;
    destroy(): void;
    removeEventAll(): void;
    removeEvent({ eventName, dom, callback }: DomEventParser): void;
    getBindings(): DomEventParser[] | undefined;
    addBinding(obj: DomEventParser): void;
    initBindings(): void;
    matchPath(el: HTMLElement, selector: string | undefined): HTMLElement | undefined;
    hasDelegate(e: any, eventObject: DomEventParser): HTMLElement | undefined;
    makeCallback(eventObject: DomEventParser, callback: () => void): (e: any) => any;
    makeDefaultCallback(eventObject: DomEventParser, callback: () => void): (e: any) => any;
    makeDelegateCallback(eventObject: DomEventParser, callback: () => void): (e: any) => any;
    runEventCallback(e: any, eventObject: DomEventParser, callback: (e: any, $dt: Dom, xy: Point) => void): any;
    checkEventType(e: any, eventObject: DomEventParser): boolean;
    getDefaultDomElement(dom: string): any;
    getDefaultEventObject(eventName: string, checkMethodFilters: string[]): DomEventParser;
    addEvent(eventObject: DomEventParser, callback: () => void): void;
    bindingEvent([eventName, dom, ...delegate]: any[], checkMethodFilters: any[], callback: () => void): void;
    getEventNames(eventName: string): string[];
    parseEvent(key: string): void;
}
