import React, {Component,} from 'react';
import Router from 'routes/index';
import './styles.less'
class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router/>
        );
    }
}

export default App;