import * as React from 'react';
import * as ReactDOM from 'react-dom';

import ListSnippets from './components/ListSnippets.jsx'

function render() {
    const body = (
        <div className="container">
            <h1>Snippets</h1>
            <div><ListSnippets /></div>
        </div>
    )
    ReactDOM.render(body, document.getElementById('root'));
}

render();