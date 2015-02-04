( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "model": {}
      }
    }
  } );

  var classnames = [];

  iui.sheet.model.Entity = {

    hasClass: function ( classname ) {
      if ( !classname ) {
        return -1;
      }
      classnames = this.className ? this.className.split( /\s+/ ) : [];
      return $.inArray( classname, classnames, 0 );
    },

    addClass: function ( classname ) {
      if ( !!classname && this.hasClass( classname ) < 0 ) {
        classnames.push( classname );
        this.className = classnames.join( " " );
        if ( this.ui ) {
          this.ui.addClass( classname );
        }
      }
      return this;
    },

    removeClass: function ( classname ) {
      if ( classname ) {
        var index = this.hasClass( classname );
        if ( index >= 0 ) {
          classnames.splice( index, 1 );
          this.className = classnames.join( " " );
          if ( this.ui ) {
            this.ui.removeClass( classname );
          }
        }
      }
      return this;
    },

    toggleClass: function ( classname ) {
      if ( classname ) {
        if ( this.hasClass( classname ) < 0 ) {
          this.addClass( classname );
        } else {
          this.removeClass( classname );
        }
      }
      return this;
    },

    toString: function () {
      var buffer = {};
      for ( var prop in this ) {
        buffer[ prop ] = this[ prop ];
      }
      return JSON.stringify( buffer ).replace( /\r\n/g, "" );
    }
  };

}( jQuery, window ) );
