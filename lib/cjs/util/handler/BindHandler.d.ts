import BaseHandler from "./BaseHandler";
export default class BindHandler extends BaseHandler {
    _bindMethods: any[] | undefined;
    load(...args: any[]): void;
    bindData(...args: any[]): void;
    destroy(): void;
}
