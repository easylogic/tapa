import DomEventHandler from "./handler/DomEventHandler";
import BindHandler from "./handler/BindHandler";
import { KeyValue, ComponentNode } from "../types/constants";
import { Dom } from "./Dom";
import BaseHandler from "./handler/BaseHandler";
import BaseStore from "./BaseStore";
export interface SplitTarget {
    target: string;
    param: string;
}
export declare const splitMethodByKeyword: (arr: string[], keyword: string) => any[];
export interface EventMachineProps {
}
export interface EventMachineOptions {
}
export default class EventMachine implements ComponentNode {
    opt: EventMachineOptions;
    props: EventMachineProps;
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
    parent: EventMachine | undefined;
    _loadMethods: any[] | undefined;
    $store: BaseStore | undefined;
    $root: EventMachine | undefined;
    constructor(opt: EventMachineOptions, props: EventMachineProps);
    setStore(newStore: BaseStore): void;
    setRoot(newRoot: EventMachine): void;
    initializeProperty(opt: EventMachineOptions, props: EventMachineProps): void;
    initComponents(): void;
    initializeHandler(): (BindHandler | DomEventHandler)[];
    initState(): {};
    setState(state?: {}, isLoad?: boolean): void;
    _reload(props: any): void;
    render($container: Dom | undefined): void;
    initialize(): void;
    afterRender(): void;
    components(): {};
    getRef(...args: any[]): any;
    getMethod(methodName: string): any;
    parseTemplate(htmlString: string | string[], isLoad?: boolean): Dom | DocumentFragment;
    childrenIds(): string[];
    exists(): boolean;
    parseProperty($dom: Dom): KeyValue;
    parseSourceName(obj: EventMachine): any[];
    parseComponent(): void;
    clean(): true | undefined;
    /**
     * refresh 는 load 함수들을 실행한다.
     */
    refresh(): void;
    /**
     * 특정 load 함수를 실행한다.  문자열을 그대로 return 한다.
     * @param  {...any} args
     */
    loadTemplate(...args: any[]): any;
    load(...args: any[]): void;
    runHandlers(func?: string, ...args: any[]): void;
    bindData(...args: any[]): void;
    template(): string;
    eachChildren(callback: (Component: any) => void): void;
    rerender(): void;
    /**
     * @deprecated
     * render 이후에 부를려고 했는데  이미 Dom Event 는 render 이후에 자동으로 불리게 되어 있다.
     * 현재는 DomEvent, Bind 기준으로만 작성하도록 한다.
     * 나머지 라이프 사이클은 다음에 고민해보자.
     * 이벤트를 초기화한다.
     */
    /**
     * 자원을 해제한다.
     * 이것도 역시 자식 컴포넌트까지 제어하기 때문에 가장 최상위 부모에서 한번만 호출되도 된다.
     */
    destroy(): void;
    /**
     * property 수집하기
     * 상위 클래스의 모든 property 를 수집해서 리턴한다.
     */
    collectProps(): string[];
    filterProps(pattern: RegExp): string[];
    self(e: any): boolean;
    isAltKey(e: any): boolean;
    isCtrlKey(e: any): boolean;
    isShiftKey(e: any): boolean;
    isMetaKey(e: any): boolean;
    /** before check method */
    preventDefault(e: any): boolean;
    stopPropagation(e: any): boolean;
    emit(event: string, ...args: any[]): void;
    trigger(event: string, ...args: any[]): void;
    bodyMouseMove(e: any, methodName: string): void;
    bodyMouseUp(e: any, methodName: string): void;
}
