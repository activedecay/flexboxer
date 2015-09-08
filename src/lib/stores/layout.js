import AppDispatcher from 'lib/dispatchers/app-dispatcher';
import {EventEmitter} from 'events';
import assign from 'object-assign';

import * as FlexboxerConstants from 'lib/constants/flexboxer-constants';

var CHANGE_EVENT = 'change';

let _root = {
  id: 1,
  contents: '',
  properties: {display: 'flex'},
  selector: '.root',
  children: [
    {id: 2, contents: 'one', selector: '.one', properties: {height: '200px'}, selected: true},
    {id: 3, contents: 'two', selector: '.two', properties: {'flex-grow': '2'}},
    {id: 4, contents: 'thr', selector: '.three', properties: {}}
  ]
};

/**
 * Create a ROW item.
 */
function create(contents) {
  // Using the current timestamp in place of a real id.
  var id = Date.now();
  _root[id] = {
    id: id,
    selector: '.foo',
    properties: {},
    contents: contents
  };
}

/**
 * Delete a ROW item.
 * @param {string} id
 */
function destroy(id) {
  delete _root[id];
}


function select(id, node) {
  if ( !node ) node = _root;
  if ( !node.children ) node.children = [];
  node.selected = (node.id === id);
  node.children.forEach(function(child) {
    select(id, child);
  });
}

function getSelected(node) {
  var _actual;
  if ( !node ) node = _root;
  if ( !node.children ) node.children = [];
  if ( node.selected ) {
    _actual = node;
  } else {
    node.children.forEach(function(child) {
      var temp = getSelected(child);
      if ( temp ) _actual = temp;
    });
  }
  return _actual;
}

var LayoutStore = assign({}, EventEmitter.prototype, {

  getSelected: function() {
    return getSelected();
  },
  /**
   * Get the entire collection of ROWs.
   * @return {object}
   */
  getLayout: function() {
    return _root;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register((payload) => {
    let action = payload.action;

    switch(action.actionType) {
      case FlexboxerConstants.FB_CREATE_NODE:
        create(action.contents);
        LayoutStore.emitChange();
        break;

      case FlexboxerConstants.FB_DESTROY_NODE:
        destroy(action.id);
        LayoutStore.emitChange();
        break;

      case FlexboxerConstants.FB_SELECT_NODE:
        console.log(action);
        select(action.id);
        LayoutStore.emitChange();

      // add more cases for other actionTypes, like TODO_UPDATE, etc.
    }

    return true; // No errors. Needed by promise in Dispatcher.
  })

});

export default LayoutStore;
