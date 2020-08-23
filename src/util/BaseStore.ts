import { debounce } from "./functions/func";
import { KeyValue } from "../types/constants";

export default class BaseStore {
  source: string = ''; 
  sourceContext: any = {}
  cachedCallback: KeyValue = {};
  callbacks: KeyValue = {};


  constructor(opt = {}) {
    this.cachedCallback = {};
    this.callbacks = {};
  }

  getCallbacks(event: string) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }

    return this.callbacks[event]
  }

  setCallbacks(event: string, list = []) {
    this.callbacks[event] = list; 
  }

  on(event: string, originalCallback: () => void, context: any, delay = 0) {
    var callback = delay > 0 ? debounce(originalCallback, delay) : originalCallback;

    this.getCallbacks(event).push({ event, callback, context, originalCallback });
  }

  off(event: string, originalCallback: () => void) {

    if (arguments.length == 1) {
      this.setCallbacks(event);
    } else if (arguments.length == 2) {      
      this.setCallbacks(event, this.getCallbacks(event).filter((f: any) => {
        return f.originalCallback !== originalCallback
      }));
    }
  }

  offAll (context: any) {

    Object.keys(this.callbacks).forEach(event => {
      this.setCallbacks(event, this.getCallbacks(event).filter((f: any) => {
        return f.context !== context;  
      }))
    })
  }

  getCachedCallbacks (event: string) {
    return this.getCallbacks(event);
  }

  sendMessage(source: string, event:string, ...args: any[]) {
    Promise.resolve().then(() => {
      var list = this.getCachedCallbacks(event);
      if (list) {
        list
        .filter((f: any) => f.originalCallback.source !== source)
        .forEach((f: any) => {
          f.callback(...args)
        });
      }

    });
  }

  triggerMessage(source: string, event: string, ...args: any[]) {
    Promise.resolve().then(() => {
      var list = this.getCachedCallbacks(event);
      if (list) {
        list
          .filter((f: any) => f.originalCallback.source === source)
          .forEach((f: any) => {      
            f.callback(...args)
          });
      } else {
        console.warn(event, ' is not valid event');
      }


    });
  }

  emit(event: string, ...args: any[]) {
    this.sendMessage(this.source, event, ...args);
  }

  trigger(event: string, ...args: any[]) {
    this.triggerMessage(this.source, event, ...args);
  }
}
