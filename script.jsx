const operatorStyle ={
    'background-color': 'rgb(241, 162, 57)'
}
const lightGrayButton = {
    'background-color': 'rgb(200,200,200)',
    'color': 'black'

}
function strip(number) {
    let newNum = (parseFloat(number).toFixed(12));
    return String(newNum *1000000000000 / 1000000000000);
}

const buttonLayout = [
    {
        id: 'clear',
        class: 'horizontal',
        style: lightGrayButton,
        text: 'AC',
        value: 'Escape'
    },
    {
        id: 'negative',
        class: 'operator',
        text: '±',
        value: 'negative',
        style: lightGrayButton,
    },
    {
        id: 'divide',
        class: 'operator',
        text: '/',
        value: '/',
        style: operatorStyle
    },
    {
        id: 'seven',
        text: '7',
        value: '7',
        class: 'number',
    },
    {
        id: 'eight',
        text: '8',
        value: '8',
        class: 'number',
    },
    {
        id: 'nine',
        text: '9',
        value: '9',
        class: 'number',
    },
    {
        id: 'multiply',
        class: 'operator',
        text: 'X',
        value: '*',
        style: operatorStyle
    },
    {
        id: 'four',
        text: '4',
        value: '4',
        class: 'number',
    },
    {
        id: 'five',
        text: '5',
        value: '5',
        class: 'number',
    },
    {
        id: 'six',
        text: '6',
        value: '6',
        class: 'number',
    },
    {
        id: 'subtract',
        text: '-',
        class: 'operator',
        value: '-',
        style: operatorStyle
    },
    {
        id: 'one',
        text: '1',
        value: '1',
        class: 'number',
    },
    {
        id: 'two',
        text: '2',
        value: '2',
        class: 'number',
    },
    {
        id: 'three',
        text: '3',
        value: '3',
        class: 'number',
    },
    {
        id: 'add',
        text: '+',
        class: 'operator',
        value: '+',
        style: operatorStyle
    },
    {
        id: 'zero',
        text: '0',
        value: '0',
        class: 'horizontal number'
    },
    {
        id: 'decimal',
        text: '.',
        value: '.',
        class: 'number',
    },
    {
        id: 'equals',
        text: '=',
        value: 'Enter',
        class: 'operator',
        style: operatorStyle
    }

]

class App extends React.Component {
    constructor(props){
        super(props);
        this.state={
            history: '',
            input:'0',
        }
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleClick = this.handleClick.bind(this)

    }
    componentDidMount() {
            document.addEventListener("keydown", this.handleKeyDown);
            document.addEventListener("keyup", this.handleKeyUp);
        }
    componentWillUnmount() {
            document.removeEventListener("keydown", this.handleKeyDown);
            document.addEventListener("keyup", this.handleKeyUp);

        }
    handleClick(e){
        let key = e.target.value;
        if(Number(key) || key==='0'){
            if(!/=/.test(this.state.history) && this.state.input.length < 12){
                console.log('here')
                this.setState(state =>({
                    history: key==='0'&& state.history==='' ? '': (/[^\d][0]$/).test(state.history) ? state.history.slice(0, state.history.length-1) + key: state.history + key,
                input: (state.input ==='0' || !(/\d$/).test(state.input))? ((/[\d|)][-\+\*\/]$/).test(state.history)|| state.input ==='0') ? key: state.input+key: state.input+key 
                }))
            }else if(/=/.test(this.state.history)){
                this.setState({
                    history: key,
                    input: key
                })
            }
        }else if(key==='/' || key==='+'||key==='-'|| key==='*'){
            if(!/=/.test(this.state.history)){
                if(this.state.history !== '' && !/\.$/.test(this.state.history)){
                    if((/\(\-[\d|.]+$/).test(this.state.history)){
                        this.setState(state=>({
                            history: state.history+")"+key,
                            input: key
                        }))
                    }else{
                    this.setState(state=>({
                        history: (/\d$/).test(state.history) ? state.history+key : state.history.slice(0, state.history.length-1) + key,
                        input: key==='*'? 'x':key
                    }))
                }
                }
            }else{
                this.setState(state=>({
                    history: state.input + key,
                    input: key
                }))
            }
            
        }else{
            switch(key){
                case 'Escape': 
                    this.setState({
                        history: '',
                        input: '0'
                    });
                    break;

                case 'Enter':
                    if(this.state.history !== '' && !/\.$/.test(this.state.history) && !/=/.test(this.state.history) && !/\(\-$/.test(this.state.history)){
                       if((/(^|\))[^(]*[\d]$/).test(this.state.history)){
                           this.setState(state =>({
                               history: state.history + "=" + strip(eval(state.history)),
                               input: strip(eval(state.history))
                           }))
                       }else if((/\(\-[\d|.]+$/).test(this.state.history)){
                        this.setState(state =>({
                               history: state.history + ")=" + strip(eval(state.history+')')),
                               input: strip(eval(state.history+')'))
                           }))
                       }else{
                           let equation = this.state.history.slice(0,this.state.history.length-1) 
                           this.setState(state=>({
                               history: equation + "=" + strip(eval(equation)),
                               input: strip(eval(equation))
                           }))
                       }

                    };
                    break;

                case '.':
                    if(!/\./.test(this.state.input)){
                        if(/=/.test(this.state.history)){
                            this.setState({
                                history: '0.',
                                input: '0.'
                            })
                        }else if(Number(this.state.input) || this.state.input === '-0'||(this.state.input === '0' && this.state.history !=='')){
                            this.setState(state=>({
                                history: state.history+'.',
                                input: state.input+'.'
                            }))
                        }else{
                            this.setState(state=>({
                                history: state.history+'0.',
                                input: '0.'
                            }))
                        }
                    }else if(/=/.test(this.state.history)){
                        this.setState(state=>({
                                history: '0.',
                                input: '0.'
                            }))
                    }
                    ;
                    break;
                case 'negative':
                    if(!/=/.test(this.state.history)){
                        if(Number(this.state.input) || this.state.input === '0' ||this.state.input == '0.' || this.state.input == '-0.'){
                            if(this.state.input>0  || this.state.input == '0.'){
                                let re = new RegExp(this.state.input+ "$")
                                    this.setState(state=>({
                                    input: state.input.replace(re, "-"+ state.input),
                                    history: state.history.replace(re, '(-' + state.input)
                                }))
                            }else if(this.state.input < 0 || this.state.input == '-0.'){
                                let re = new RegExp(this.state.input+ "$")
                                this.setState(state=>({
                                    
                                    input: state.input.slice(1),
                                    history: state.history.slice(0, state.history.length-state.input.length -1)+ state.input.slice(1)
                                }))
                            }else{
                                let str = this.state.history.replace(/0$/, '(-')
                                    this.setState(state=>({
                                        input: '-',
                                        history: state.history === ""? "(-" : str 
                                    }))
                            }
                            }else if(this.state.history === '(-'){
                                this.setState(state=>({
                                        input: '0',
                                        history: ""
                                    }))
                            }else{
                                this.setState(state =>({
                                    history: state.history+"(-",
                                    input:'-'
                                }))

                            }
                    }else{
                        this.setState(state=>({
                            history: state.input >=0 ? "(-" + state.input: state.input.slice(1),
                            input: state.input >=0 ? "-" + state.input: state.input.slice(1)
                        }))
                    }
                    break;


            }
        } 
    }
    
    handleKeyDown(e){
            let pressed = buttonLayout.filter(d=>d.value === e.key)[0];
            if(pressed){
                $("#"+pressed.id).addClass('active')
            }
    }
    handleKeyUp(e){
            let pressed = buttonLayout.filter(d=>d.value === e.key)[0];
            if(pressed){
                $("#"+pressed.id).removeClass('active')
            }
        }

    render(){
    
        return (
            <div>

            <div id='calculator'>

                <div id='history'>
                {this.state.history}
                </div>
                <div id='display'>
                {this.state.input}
                </div>
                <Buttons click={this.handleClick}/>
            </div>
            <div id='author'>
                by bszmclh
            </div>

            </div>
        )
    
    }

}

class Buttons extends React.Component{
    render(){
        let output = buttonLayout.map(d=>{
            return (
                <button id={d.id} className={d.class} style={d.style} onClick={this.props.click} value={d.value}>
                {d.text}
                </button>
            )
        })
        return(
            <div id='pad'>
            {output}
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('container'))

