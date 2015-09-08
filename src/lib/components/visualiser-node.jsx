import React from 'react';


class VisualiserNode extends React.Component {
  mapProperties(properties) {
    let mKey, key, mapped = {};
    for ( key in properties ) {
      mKey = this.mapPropertyName(key);
      mapped[mKey] = properties[key];
    }
    return mapped;
  }
  mapPropertyName(propertyName) {
    return propertyName
      .split('-')
      .map(function(p, i) {
        if ( i === 0 ) return p;
        p = p.replace(/^./, function(s) { return s.toUpperCase(); });
      })
      .join('');
  }
  render() {
    let node = this.props.node;
    let properties = node.properties;
    let selector = node.selector;
    let contents = node.contents;
    let children = node.children || [];
    let mapped = this.mapProperties(properties);
    return <div className={`visualiser-child ${selector}`} style={mapped}>
      {contents}
      {children.map(function(child) {
          return <VisualiserNode key={child.id} node={child}/>;
      }.bind(this))}
    </div>;
  }
}


export default VisualiserNode;
