import { KeyValue } from "../../types/constants";

export function debounce (callback: (...args: any[]) => void, delay = 0) {

    if (delay === 0) {
        return callback;
    }

    let t: any = undefined;

    return function (...args: any[]) {
        if (t) {
            clearTimeout(t);
        }

        t = setTimeout(function () {
            callback(...args);
        }, delay || 300);
    }
}
  

export function throttle (callback: (...args: any[]) => void, delay: number = 0) {

    let t: any = undefined;

    return function (...args: any[]) {
        if (!t) {
            t = setTimeout(function () {
                callback(...args);
                t = null; 
            }, delay || 300);
        }

    }
}


export function keyEach (obj: KeyValue, callback: (key: string, value: any, index: number) => void) {
    Object.keys(obj).forEach( (key, index) => {
        callback (key, obj[key], index);
    })
}

export function keyMap (obj: KeyValue, callback: (key: string, value: any, index: number) => void): any[] {
    return Object.keys(obj).map( (key, index) => {
        return callback (key, obj[key], index);
    })
}


export function isUndefined (value: any) {
    return typeof value == 'undefined' || value === null;
}

export function isNotUndefined (value: any) {
    return isUndefined(value) === false;
}

export function isArray (value: any) {
    return Array.isArray(value);
}

export function isBoolean (value: any) {
    return typeof value == 'boolean'
}

export function isString (value: any) {
    return typeof value == 'string'
}

export function isNotString (value: any) {
    return isString(value) === false;
}

export function isObject (value: any) {
    return typeof value == 'object' && !isArray(value) && !isNumber(value) && !isString(value)  && value !== null; 
}

export function isFunction (value: any) {
    return typeof value == 'function'
}

export function isNumber (value: any) {
    return typeof value == 'number';
}

export function clone (obj: any) {
    return JSON.parse(JSON.stringify(obj));
}

const HTML_TAG: KeyValue = {
    'image': true,
    'input': true,
    'br': true,
    'path': true,
    'line': true,
    'circle': true,
    'rect': true,
    'polygon': true,
    'polyline': true,
    'use': true
}


export const html = (strings: TemplateStringsArray, ...args: any[]) => {

    var results =  strings.map((it, index) => {
        
        var results = args[index] || ''

        if (isFunction(results)) {
            results = results()
        }

        if (!isArray(results)) {
            results = [results]
        }

        results = results.join('')

        return it + results;
    }).join('');

    results = results.replace(/\<(\w*)([^\>]*)\/\>/gim, function (match, p1) {
        if (HTML_TAG[p1.toLowerCase()]) {
            return match;
        } else {
            return match.replace('/>', `></${p1}>`)
        }
    })

    return results; 
}

const UUID_REG = /[xy]/g

export function uuid(){
    var dt = new Date().getTime();
    var uuid = 'xxx12-xx-34xx'.replace(UUID_REG, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

export function uuidShort(){
    var dt = new Date().getTime();
    var uuid = 'idxxxxxxx'.replace(UUID_REG, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}
