import { ComponentNode } from "../types/constants";
interface AppProps {
    container?: string | HTMLElement | null | undefined;
    className?: string;
    template?: string;
    components?: {
        [key: string]: ComponentNode;
    };
}
export declare const render: (opt: AppProps) => any;
export {};
