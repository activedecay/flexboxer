import React from 'react';
import LayoutStore from 'lib/stores/layout';
import Builder from 'lib/components/builder.jsx!';
import Visualiser from 'lib/components/visualiser.jsx!';
import CssOutput from 'lib/components/css-output.jsx!';
import TreeLayout from 'lib/components/tree-layout.jsx!';
import Inspector from 'lib/components/inspector.jsx!';

function getFBState() {
  return {
    layout: LayoutStore.getLayout(),
    selectedNode: LayoutStore.getSelected()
  };
}

let FlexBoxerApp = React.createClass({

  getInitialState: () => {
    return getFBState();
  },

  componentDidMount: function() {
    LayoutStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    LayoutStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getFBState());
  },

  render: function() {
    let rules = LayoutStore.getFlattenedRules();
    return (
      <div>
        <Inspector />
        <TreeLayout layout={this.state.layout} />
        <Visualiser layout={this.state.layout} />
        <CssOutput rules={rules} />
      </div>
    );
  }

});

export default FlexBoxerApp;
