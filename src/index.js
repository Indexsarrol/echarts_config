import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.less';
import {AppContainer} from 'react-hot-loader';
import App from 'containers/App/index';

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component/>
        </AppContainer>,
        document.getElementById('app')
    );
};

render(App);

if (module.hot) {
    module.hot.accept(App, () => {
        const App = require(App).default;
        render(App)
    });
}