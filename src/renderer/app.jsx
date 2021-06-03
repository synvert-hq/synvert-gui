import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom';

import AppProvider from './provider'
import Dashboard from './components/Dashboard'

const App = () => (
    <AppProvider>
        <Dashboard />
    </AppProvider>
)

function render() {
    ReactDOM.render(<App />, document.getElementById('root'));
}

render();
