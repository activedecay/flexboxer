import AppDispatcher from 'lib/dispatchers/app-dispatcher';
import {EventEmitter} from 'events';

import FlexboxerConstants from 'lib/constants/flexboxer-constants';
import assign from 'object-assign';

var CHANGE_EVENT = 'change';


let _rows = {
  '0': {contents: 'one', selector: '.one', properties: {}},
  '1': {contents: 'two', selector: '.two', properties: {'flex-grow': '2'}},
  '2': {contents: 'thr', selector: '.three', properties: {}}
};

/**
 * Create a ROW item.
 */
function create(contents) {
  // Using the current timestamp in place of a real id.
  var id = Date.now();
  _rows[id] = {
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
  delete _rows[id];
}

var LayoutStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of ROWs.
   * @return {object}
   */
  getAll: function() {
    return _rows;
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
  removeChangeListener: (callback) => {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register((payload) => {
    var action = payload.action;

    switch(action.actionType) {
      case FlexboxerConstants.FB_CREATE_ROW:
        create(action.contents);
        LayoutStore.emitChange();
        break;

      case FlexboxerConstants.FB_DESTROY_ROW:
        destroy(action.id);
        LayoutStore.emitChange();
        break;

      // add more cases for other actionTypes, like TODO_UPDATE, etc.
    }

    return true; // No errors. Needed by promise in Dispatcher.
  })

});

export default LayoutStore;