import React, {Component} from 'react';
import './styles.less'

class Main extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='main'>
                {this.props.children}
            </div>
        );
    }
}

export default Main;