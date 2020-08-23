import EventMachine from "./EventMachine";
import BaseStore from "./BaseStore";
export declare const PIPE: (...args: string[]) => string;
export declare const EVENT: (...args: string[]) => string;
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
export declare class UIElement extends EventMachine {
    opt: UIElementOptions;
    parent: UIElement | undefined;
    props: UIElementProps;
    source: string;
    sourceName: string;
    constructor(opt: UIElementOptions, props?: UIElementProps);
    /**
     * UIElement instance 에 필요한 기본 속성 설정
     */
    initializeProperty(opt: UIElementOptions | UIElement, props?: UIElementProps): void;
    created(): void;
    getRealEventName(e: any, s?: string): any;
    /**
     * initialize store event
     *
     * you can define '@xxx' method(event) in UIElement
     *
     *
     */
    initializeStoreEvent(): void;
    destoryStoreEvent(): void;
    destroy(): void;
    rerender(): void;
    emit(event: string, ...args: any[]): void;
    trigger(event: string, ...args: any[]): void;
    on(message: string, callback: () => void): void;
    off(message: string, callback: () => void): void;
}
