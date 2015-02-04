( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "util": {}
    }
  } );

  iui.util.DoubleLinkedList = function () {
    if ( !this instanceof iui.util.DoubleLinkedList ) {
      return new iui.util.DoubleLinkedList();
    }
    this.items = {};
  };

  $.extend( iui.util.DoubleLinkedList.prototype, {
    add: function ( item ) {
      var key = iui.util.hash( item );
      this.items[ key ] = item;
    },
    remove: function () {},
    has: function () {},
    first: function () {},
    last: function () {},
  } );

}( jQuery, window ) );
