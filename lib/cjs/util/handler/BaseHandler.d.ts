import EventMachine from "../EventMachine";
import { KeyValue } from "../../types/constants";
export default class BaseHandler {
    context: EventMachine | undefined;
    options: KeyValue;
    constructor(context: EventMachine, options?: KeyValue);
    initialize(): void;
    load(): void;
    refresh(): void;
    render(): void;
    getRef(id: string): any;
    splitMethodByKeyword(arr: string[], keyword: string): (string[] | {
        target: string;
        param: string;
    }[])[];
    /**
     * property 수집하기
     * 상위 클래스의 모든 property 를 수집해서 리턴한다.
     */
    collectProps(): string[];
    filterProps(pattern: RegExp): string[];
    run(): void;
    destroy(): void;
}
