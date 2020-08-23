import { isFunction } from "../functions/func";
import EventMachine from "../EventMachine";
import { KeyBoolean, KeyValue } from "../../types/constants";

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
    "template": true,
    "eachChildren": true,
    "initializeEvent": true,
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

export default class BaseHandler {
    context: EventMachine|undefined = undefined;
    options: KeyValue = {} 

    constructor (context: EventMachine, options:KeyValue = {}) {
        this.context = context;
        this.options = options;
    }

    // 초기화 설정 
    initialize () {

    }

    // html 을 로드 할 때 
    load () {

    }

    // 새로고침 할 때 
    refresh () {

    }
    
    // 화면에 그린 이후에 실행 되는 로직들 
    render () {

    }

    getRef(id: string) {
        return this.context?.getRef(id);
    }
        
    splitMethodByKeyword (arr: string[], keyword: string) {
        var filterKeys = arr.filter(code => code.indexOf(`${keyword}(`) > -1);
        var filterMaps = filterKeys.map(code => {
          var [target, param] = code
            .split(`${keyword}(`)[1]
            .split(")")[0]
            .trim()
            .split(" ");
      
          return { target, param };
        });
      
        return [filterKeys, filterMaps];
    }    

    /**
     * property 수집하기
     * 상위 클래스의 모든 property 를 수집해서 리턴한다.
     */
    collectProps() {

        var context = this.context;
        var p = context?.getMethod('__proto__');
        var results = [];
        do {
        var isObject = p instanceof Object;

        if (isObject === false) {
            break;
        }
        const names = Object.getOwnPropertyNames(p).filter(name => {
            return context && isFunction(context.getMethod(name)) && !expectMethod[name];
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

    run () {

    }

    destroy() {

    }
}