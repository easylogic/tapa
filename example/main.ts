import { render } from '../src/index'
import Applcation from './Application'


render({ 
    components: {
        Applcation 
    },
    template: /*html*/`
        <div>
            <Applcation /> 
        </div>
    `,
    container: document.getElementById('app')
})  