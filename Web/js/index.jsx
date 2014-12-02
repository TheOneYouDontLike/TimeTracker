'use strict';

var React = require('react');

module.exports = React.createClass({	
    render: function() {
        return (
            <div className='activities-box'>
                <h1>Sth here</h1>
                helo { this.props.name }, did you know that sjs autocompletion sucks?
            </div>
        );
    }
});