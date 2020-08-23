import { UIElement, CLICK } from "../src"

export default class Applcation extends UIElement {
    template () {
        return /*html*/`
            <div class='application'>
                Tap Application 오신 것을 환영합니다. 
                <div> Welcome to The Tapa</div>
                이젠 타파의 시대로 
            </div>
        `
    }

    [CLICK()] () {
        alert('a');
    }
}