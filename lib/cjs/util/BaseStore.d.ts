import { KeyValue } from "../types/constants";
export default class BaseStore {
    source: string;
    sourceContext: any;
    cachedCallback: KeyValue;
    callbacks: KeyValue;
    constructor(opt?: {});
    getCallbacks(event: string): any;
    setCallbacks(event: string, list?: never[]): void;
    on(event: string, originalCallback: () => void, context: any, delay?: number): void;
    off(event: string, originalCallback: () => void): void;
    offAll(context: any): void;
    getCachedCallbacks(event: string): any;
    sendMessage(source: string, event: string, ...args: any[]): void;
    triggerMessage(source: string, event: string, ...args: any[]): void;
    emit(event: string, ...args: any[]): void;
    trigger(event: string, ...args: any[]): void;
}
