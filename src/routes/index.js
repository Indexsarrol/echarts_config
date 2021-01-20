import React, {Component, Fragment} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from "../store";
import Home from 'views/Home/Home'

class Routes extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <Provider store={store}>
                    <BrowserRouter>
                        <Switch>
                            <Route exact path="/" component={Home} />
                        </Switch>
                    </BrowserRouter>
                </Provider>
            </Fragment>
        );
    }
}

export default Routes;