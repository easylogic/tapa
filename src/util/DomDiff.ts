import { KeyValue } from "../types/constants";


const setBooleanProp = (el: HTMLElement, name: string, value: any) => {
    if (value) {
        el.setAttribute(name, name);
        (el as any)[name] = value;
    } else {
        el.removeAttribute(name);
        (el as any)[name] = value; 
    }
  };
  
const setProp = (el: HTMLElement, name: string, value: any) => {
    if (typeof value === 'boolean') {
        setBooleanProp(el, name, value);
    } else {
        el.setAttribute(name, value);
    }
};


const removeBooleanProp = (node: HTMLElement, name: string) => {
    node.removeAttribute(name);
    (node as any)[name] = false;
};

const removeUndefinedProp = (node: HTMLElement, name: string) => {
    node.removeAttribute(name);
}
  
const removeProp = (node: HTMLElement, name: string, value: any) => {
    if (typeof value === 'boolean') {
        removeBooleanProp(node, name);
    } else if (name) {
        removeUndefinedProp(node, name);
    }
};
  

const updateProp = (node: HTMLElement, name: string, newValue: any, oldValue: any) => {
    if (!newValue) {
      removeProp(node, name, oldValue);
    } else if (!oldValue || newValue !== oldValue) {
      setProp(node, name, newValue);
    }
  };


const updateProps = (node: HTMLElement, newProps: KeyValue = {}, oldProps: KeyValue = {}) => {
    const props = {...newProps,...oldProps};
  
    Object.keys(props).forEach((name) => {
      updateProp(node, name, newProps[name], oldProps[name]);
    });
};

function changed(node1: HTMLElement, node2: HTMLElement) {
    return (
        (node1.nodeType === Node.TEXT_NODE && node1 !== node2) 
        || node1.nodeName !== node2.nodeName
    ) 
}

function getProps (attributes: KeyValue) {
    let results: KeyValue = {}
    Object.keys(attributes).forEach(key => {
        const t = attributes[key];
        results[t.name as string] = t.value;
    })

    return results;    
}

function updateElement (parentElement: HTMLElement, oldEl: HTMLElement, newEl: HTMLElement) {
    if (!oldEl) {
        parentElement.appendChild(newEl.cloneNode(true));
    } else if (!newEl) {
        parentElement.removeChild(oldEl);
    } else if (changed(newEl, oldEl)) {
        parentElement.replaceChild(newEl.cloneNode(true), oldEl);
    } else if (newEl.nodeType !== Node.TEXT_NODE) {
        updateProps(oldEl, getProps(newEl.attributes), getProps(oldEl.attributes)); // added        
        let oldChildren = children(oldEl);
        let newChildren = children(newEl);
        const max = Math.max(oldChildren.length, newChildren.length);

        for (let index = 0; index < max; index++) {
            updateElement(oldEl, oldChildren[index], newChildren[index]);
        }
    }

}

const children = (el: HTMLElement): HTMLElement[] => {
    let element = el.firstChild; 

    if (!element) {
        return [] 
    }

    let results = [] 

    do {
        results.push(element);
        element = element.nextSibling;
    } while (element);

    return results as HTMLElement[]; 
}


export function DomDiff (A: any, B: any) {

    A = A.el || A; 
    B = B.el || B; 

    var childrenA = children(A);
    var childrenB = children(B); 

    var len = Math.max(childrenA.length, childrenB.length);
    for (var i = 0; i < len; i++) {
        updateElement(A, childrenA[i], childrenB[i]);
    }
}
