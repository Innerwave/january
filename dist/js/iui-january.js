/*! Innerwave Spreadsheet - v0.2.522-SNAPSHOT - 2015-02-11
* Copyright (c) 2015 innerwave.co.kr; Licensed  */
( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "util": {}
    }
  } );

  var simbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  function utf8_encode( i ) {
    i = i.replace( /\r\n/g, "\n" );
    var o = [],
      c, l = 0;
    // BOM
    //    o[l++] = String.fromCharCode(239);
    //    o[l++] = String.fromCharCode(191);
    //    o[l++] = String.fromCharCode(187);
    for ( var idx = 0, len = i.length; idx < len; idx++ ) {
      c = i.charCodeAt( idx );
      if ( c < 128 ) {
        o[ l++ ] = String.fromCharCode( c );
      } else if ( ( c > 127 ) && ( c < 2048 ) ) {
        o[ l++ ] = String.fromCharCode( ( c >> 6 ) | 192 );
        o[ l++ ] = String.fromCharCode( ( c & 63 ) | 128 );
      } else {
        o[ l++ ] = String.fromCharCode( ( c >> 12 ) | 224 );
        o[ l++ ] = String.fromCharCode( ( ( c >> 6 ) & 63 ) | 128 );
        o[ l++ ] = String.fromCharCode( ( c & 63 ) | 128 );
      }
    }
    return o.join( "" );
  }

  function utf8_decode( i ) {
    var o = [],
      l = 0,
      idx = 0,
      c = 0,
      c1 = 0,
      c2 = 0,
      len = i.length;
    while ( idx < len ) {
      c = i.charCodeAt( idx++ );
      if ( c < 128 ) {
        o[ l++ ] = String.fromCharCode( c );
      } else if ( ( c > 191 ) && ( c < 224 ) ) {
        c2 = i.charCodeAt( idx++ );
        o[ l++ ] = String.fromCharCode( ( ( c & 31 ) << 6 ) | ( c2 & 63 ) );
      } else {
        c2 = i.charCodeAt( idx++ );
        c3 = i.charCodeAt( idx++ );
        o[ l++ ] = String.fromCharCode( ( ( c & 15 ) << 12 ) | ( ( c2 & 63 ) << 6 ) | ( c3 & 63 ) );
      }
    }
    return o.join( "" );
  }


  /**
   * Public Static Classes
   *
   */
  iui.util.Base64 = {
    encode: function ( i ) {
      i = utf8_encode( i );
      var o = [],
        l = 0,
        c1, c2, c3,
        e1, e2, e3, e4,
        idx = 0,
        len = i.length;
      while ( idx < len ) {
        c1 = i.charCodeAt( idx++ );
        c2 = i.charCodeAt( idx++ );
        c3 = i.charCodeAt( idx++ );
        e1 = c1 >> 2;
        e2 = ( ( c1 & 3 ) << 4 ) | ( c2 >> 4 );
        e3 = ( ( c2 & 15 ) << 2 ) | ( c3 >> 6 );
        e4 = c3 & 63;
        if ( isNaN( c2 ) ) {
          e3 = e4 = 64;
        } else if ( isNaN( c3 ) ) {
          e4 = 64;
        }
        o[ l++ ] = simbols.charAt( e1 );
        o[ l++ ] = simbols.charAt( e2 );
        o[ l++ ] = simbols.charAt( e3 );
        o[ l++ ] = simbols.charAt( e4 );
      }
      return o.join( "" );
    },

    decode: function ( i ) {
      i = i.replace( /[^A-Za-z0-9\+\/\=]/g, "" );
      var o = [],
        c1, c2, c3,
        e1, e2, e3, e4,
        idx = 0,
        l = 0,
        len = i.length;
      while ( idx < len ) {
        e1 = simbols.indexOf( i.charAt( idx++ ) );
        e2 = simbols.indexOf( i.charAt( idx++ ) );
        e3 = simbols.indexOf( i.charAt( idx++ ) );
        e4 = simbols.indexOf( i.charAt( idx++ ) );
        c1 = ( e1 << 2 ) | ( e2 >> 4 );
        c2 = ( ( e2 & 15 ) << 4 ) | ( e3 >> 2 );
        c3 = ( ( e3 & 3 ) << 6 ) | e4;
        o[ l++ ] = String.fromCharCode( c1 );
        if ( e3 !== 64 ) {
          o[ l++ ] = String.fromCharCode( c2 );
        }
        if ( e4 !== 64 ) {
          o[ l++ ] = String.fromCharCode( c3 );
        }
      }
      return utf8_decode( o.join( "" ) );
    },

  };

}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "util": {}
    }
  } );

  iui.util.Circuit = function ( elements ) {
    elements = elements ? $.isArray( elements ) ? elements : [ elements ] : [];

    if ( !( this instanceof iui.util.Circuit ) ) {
      return new iui.util.Circuit( elements );
    }

    this.index = NaN;
    this.elements = elements;
    this.length = this.elements.length;
  };

  $.extend( iui.util.Circuit.prototype, {
    getIndex: function () {
      return this.index = ( this.elements.length + this.index ) % this.elements.length;
    },

    prev: function () {
      if ( isNaN( parseInt( this.index ) ) ) {
        this.index = 0;
      } else {
        this.index--;
        this.index = this.getIndex();
      }
      return this.elements[ this.index ];
    },

    now: function () {
      return this.elements[ this.index ];
    },

    next: function () {
      if ( isNaN( parseInt( this.index ) ) ) {
        this.index = 0;
      } else {
        this.index++;
        this.index = this.getIndex();
      }
      return this.elements[ this.index ];
    },

    append: function ( element ) {
      this.elements[ this.length++ ] = element;
    },

    remove: function () {
      this.index = this.getIndex();
      this.elements.splice( this.index, 1 );
      this.length--;
    }
  } );
}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "util": {}
    }
  } );

  var nextId = 0;

  iui.util.Collection = function ( name ) {

    if ( !( this instanceof iui.util.Collection ) ) {
      return new iui.util.Collection();
    }

    this.name = name || "";
    this.length = 0;
    this.items = [];
    this.itemByIds = {};
    this.eventPrefix = "collection";
  };

  $.extend( iui.util.Collection.prototype, {

    /**
     *
     */
    find: function ( id ) {
      return this.indexOf( this.itemByIds[ id ] );
    },

    has: function ( item ) {
      return !!this.itemByIds[ item.uid ];
    },

    get: function ( index ) {
      return this.items[ index ];
    },

    getById: function ( id ) {
      var item = this.itemByIds[ id ];
      if ( !item ) {
        item = $.map( this.items, function ( item ) {
          return item.id === id ? item : null;
        } )[ 0 ];
      }
      return item;
    },

    indexOf: function ( item ) {
      return $.inArray( /*value*/ item, /*array*/ this.items /*[, fromIndex default = 0 ]*/ );
    },

    addAll: function ( items ) {
      for ( var i = 0, l = items.length; i < l; i++ ) {
        this.add( items[ i ] );
      }
      return this;
    },

    add: function ( item ) {
      item.uid = item.uid || "item" + nextId++;
      if ( !this.has( item ) ) {
        this.items.push( item );
        this.itemByIds[ item.uid ] = item;
        this.length++;
      }
      return this;
    },

    insert: function ( item, index ) {
      item.uid = item.uid || "item" + nextId++;
      if ( !this.has( item ) ) {
        this.itemByIds[ item.uid ] = item;
        if ( index < 0 ) {
          this.items.unshift( item );
        } else if ( index >= this.items.length ) {
          this.items.push( item );
        } else {
          this.items.splice( index, 0, item );
        }
        this.length++;
      }
      return this;
    },

    insertBefore: function ( item, index ) {
      return this.insert( item, --index );
    },

    insertAfter: function ( item, index ) {
      return this.insert( item, ++index );
    },

    empty: function () {
      this.length = 0;
      this.items.length = 0;
      this.items = [];
      this.itemByIds = {};
    },

    remove: function ( item ) {
      var idx = this.indexOf( item );
      if ( idx >= 0 ) {
        this.items.splice( idx, 1 );
        this.length--;
      }
      delete this.itemByIds[ item.uid ];
      return this;
    },

    move: function ( item, cnt ) {
      item = typeof item === "string" ? this.itemByIds[ item ] : typeof item === "number" ? this.items[ item ] : item;
      var from = this.indexOf( item );
      var to = from + cnt;

      if ( from < 0 ) {
        throw "can not find item";
      } else {
        this.items.splice( from, 1 );
      }
      if ( to < 0 ) {
        this.items.unshift( item );
      } else if ( to >= this.length ) {
        this.items[ this.length ] = item;
      } else {
        this.items.splice( to, 0, item );
      }
      return this;
    },

    each: function ( callback, args ) {
      var i = 0,
        l = this.length;
      if ( typeof callback === "string" ) {
        for ( ; i < l; i++ ) {
          this.items[ i ][ callback ].apply( this.items[ i ], args );
        }
      } else if ( callback instanceof Function ) {
        for ( ; i < l; i++ ) {
          callback.apply( this.items[ i ], args );
        }
      }
    },

    toArray: function () {
      return this.items;
    },

    iterator: function () {
      return iui.util.Iterator( this.items );
    },

    // exports
    toJSON: function () {
      return JSON.stringify( this.items );
    },

    toXML: function () {
      var xmldoc = $.parseXML( "<collection></collection>" );
      for ( var i = 0, l = this.items.length; i < l; i++ ) {
        xmldoc.appendChild( this.items[ i ].toXML() );
      }
      return xmldoc;
    }

    // 보 류 중
    //  toXMLString = function () { 
    //    return (new XMLSerializer()).serializeToString(iui.util.Collection.prototype.toXML());
    //  };


    // 보 류 중
    //  _trigger = function (type, event, data) {
    //    var callback = this.events[type];
    //    event = $.Event(event);
    //    event.type = (type === this.eventPrefix ? type : this.eventPrefix + type).toLowerCase();
    //    event.target = this;
    //    data = data || {};
    //    return !($.isFunction(callback) &&
    //      callback.apply(this, [event].concat(data)) === false ||
    //      event.isDefaultPrevented());
    //  };
  } );


}( jQuery, window ) );

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

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "util": {}
    }
  } );

  /**
   * 주어진 문자열의 32비트 해시를 계산한다.
   * Found hear: https://gist.github.com/vaiorabbit/5657561
   *
   * 32 bit FNV-1a hash
   * Ref.: http://isthe.com/chongo/tech/comp/fnv/
   *
   * @param {string} str 해시 값을 구할 문자열
   * @return {integer}
   */
  iui.util.fnv32a = function ( str ) {
    var FNV1_32A_INIT = 0x811c9dc5,
      hval = FNV1_32A_INIT,
      i = 0,
      l = str.length;
    for ( ; i < l; i++ ) {
      hval ^= str.charCodeAt( i );
      hval += ( hval << 1 ) + ( hval << 4 ) + ( hval << 7 ) + ( hval << 8 ) + ( hval << 24 );
    }
    return hval >>> 0;
  };

  iui.util.hash = function ( obj ) {
    return iui.util.fnv32a( iui.util.Base64.encode( obj ) );
  };

}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "util": {}
    }
  } );

  iui.util.Iterator = function ( elements ) {
    this.nextIndex = 0;
    this.elements = elements || [];
  };

  $.extend( iui.util.Iterator.prototype, {
    hasNext: function () {
      return this.nextIndex < this.elements.length;
    },

    next: function () {
      if ( this.hasNext() ) {
        return this.elements[ this.nextIndex++ ];
      }
    },

    remove: function () {
      if ( this.hasNext() ) {
        this.elements.splice( this.nextIndex, 1 );
      }
    }
  } );
}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "util": {}
    }
  } );

  var startTime = ( new Date() ).getTime();

  iui.util.laptime = function ( message ) {
    var time = ( new Date() ).getTime() - startTime;
    console.log( ( message || "Lap Time" ) + " : " + time );
    return time;
  };

}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "util": {}
    }
  } );

  iui.util.List = function ( elements ) {};

  $.extend( iui.util.List.prototype, {
    append: function () {},
    insert: function () {},
    before: function () {},
    after: function () {},
    remove: function () {}
  } );
}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "util": {}
    }
  } );

  iui.util.List = function ( array ) {
    if ( !this instanceof iui.util.List ) {
      return new iui.util.List( array );
    }

    this.items = array ? $.isArray( array ) ? array : [ array ] : [];
  };

  $.extend( iui.util.List.prototype, {
    add: function () {},
    remove: function () {},
    has: function () {},
    first: function () {},
    last: function () {},
  } );

}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "util": {}
    }
  } );

  iui.util.uniqueId = ( function () {
    var guid = 0;
    return function ( prefix ) {
      return prefix + guid++;
    };
  }() );

}( jQuery, window ) );

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

    parent: function ( parent ) {
      if ( !parent ) {
        return this._parent;
      }
      this._parent = parent;
    },

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

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "model": {}
      }
    }
  } );

  // private 
  var nextId = 0;

  iui.sheet.model.Cell = function ( info ) {

    info = info || {};

    if ( !( this instanceof iui.sheet.model.Cell ) ) {
      return new iui.sheet.model.Cell( info );
    }
    this.uid = info.id || "cell" + nextId++;
    this.id = info.id || this.uid;
    this.value = info.value;
    this.formula = info.formula;
    this.className = "spreadsheet-cell " + ( info.classname || "" );
    this.renderer = info.renderer; // iui.sheet.renderer.String;
    this.editor = info.editor;

    //  this.rows = /*info.rows || */ []; 
    //  this.columns = /*info.columns || */ [];
    this.rows = ( new iui.util.Collection() ).addAll( info.rows || [] );
    this.columns = ( new iui.util.Collection() ).addAll( info.columns || [] );

    // privileged method
    this.ui = null;

  };

  // public methods
  $.extend( iui.sheet.model.Cell.prototype, iui.sheet.model.Entity, {
    getRenderer: function () {
      return this.renderer ? this.renderer :
        this.columns.length > 0 ? this.columns.get( 0 ).renderer :
        iui.sheet.renderer.String;
    }
  } );

}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "model": {}
      }
    }
  } );

  var nextId = 0;

  iui.sheet.model.Column = function ( info ) {
    info = info || {};

    if ( !( this instanceof iui.sheet.model.Column ) ) {
      return new iui.sheet.model.Column( info );
    }
    this.uid = info.id || "column" + nextId++;
    this.id = info.id || this.uid;
    this.visualId = info.visualId;
    this.label = info.label;
    this.width = info.width || 80;
    this.height = info.height || 26;
    this.className = "spreadsheet-column ui-state-default " + ( info.className || "" );
    this.group = info.group;
    this.ui = null;
    this._offset = {
      left: 0,
      width: this.width,
      outerWidth: 0,
      innerWidth: 0
    };
    this.cells = new iui.util.Collection();

    // this.type = info.type || "Text"; // Text, Number, Date, Currency, Title, ...
    this.renderer = info.renderer || iui.sheet.renderer.String;
    this.editor = info.editor;
    this.buttons = null;

  };

  $.extend( iui.sheet.model.Column.prototype, iui.sheet.model.Entity, {

    setWidth: function ( width ) {
      this.width = width;
      if ( this.ui ) {
        this.ui.width( width );
      }
      this._parent._trigger( "columnChanged" );
    },

    render: function () {},

    refresh: function () {},

    offset: function () {
      if ( this.ui ) {
        this._offset = {
          left: this.ui[ 0 ].offsetLeft,
          width: this.ui.width(),
          outerWidth: this.ui.outerWidth(),
          innerWidth: this.ui.innerWidth()
        };
      }
      return this._offset;
    }
  } );

  //-------------------------------------------------------------------------
  // static public methods 
  /**
   * 엑셀 스타일의 컬럼 이름 생성
   * TODO 676이상의 컬럼이 지정되면 타이틀을 잘못 계산하는 것을 수정해야 한다.
   * A ~ YZ 까지의 676(26^2)개만 정상적으로 생성되며,
   * ZA ~ ZZ 는 생성되지 못하고 AAA로 넘어간다.
   */
  iui.sheet.model.Column.getColumnLabel = function ( index ) {
    return $.map( ( index )
        .toString( 26 )
        .split( "" ),
        function ( e, i ) {
          e = parseInt( e, 26 );
          if ( index > 25 && i === 0 ) {
            e--;
          }
          return String.fromCharCode( e + 65 );
        } )
      .join( "" );
  };

}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "model": {}
      }
    }
  } );

  var nextId = 0;

  iui.sheet.model.ColumnGroup = function ( info ) {

    info = info || {};

    if ( !( this instanceof iui.sheet.model.ColumnGroup ) ) {
      return new iui.sheet.model.ColumnGroup( info );
    }
    this.uid = info.id || "columngroup" + nextId++;
    this.id = info.id || this.uid;
    this.label = info.label;
    this.columns = iui.util.Collection();
    this._ui = info.ui || iui.sheet.renderer.ColumnGroupHeader( this );

    this.renderer = null;
    this.editor = null;
  };


  $.extend( iui.sheet.model.ColumnGroup.prototype, iui.sheet.model.Entity, {

    width: function () {
      var w = 0,
        brw = 0,
        numberOfVisibleColumn = 0,
        $uiColumns = this._parent ? $.map( this._parent._columns.toArray(), function ( column, index ) {
          if ( !column.ui ) {
            return null;
          }
          var parent = column.ui.parent();
          if ( !parent ) {
            return null;
          }
          return parent.children().index( column.ui ) >= 0 ? column : null;
        } ) : [];

      $.each( this.columns.toArray(), function ( i ) {
        if ( $.inArray( this, $uiColumns ) >= 0 ) {
          w += this.offset().width;
          brw = parseInt( this.ui.css( "border-right-width" ) );
          numberOfVisibleColumn++;
        }
      } );
      return w + brw * ( numberOfVisibleColumn - 1 );
    },

    ui: function ( ui ) {
      if ( ui ) {
        this._ui = ui.text( this.label );
      }
      this._ui.data( "group", this );
      return this._ui.width( this.width() );
    }
  } );

}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "model": {}
      }
    }
  } );
  var nextId = 0;

  var Row = iui.sheet.model.Row = function ( info ) {
    info = info || {};

    if ( !( this instanceof Row ) ) {
      return new Row( info );
    }
    this.uid = info.id || "row" + nextId++;
    this.id = info.id || this.uid;
    this.height = info.height || 26;
    this.label = info.label;
    this.width = info.width || 80;
    this.className = "ui-state-default spreadsheet-row " + ( info.className || "" );
    this.ui = null;
    this._offset = {
      top: 0,
      height: this.height,
      outerHeight: 0,
      innerHeight: 0
    };
    this.cells = new iui.util.Collection().addAll( info.cells || [] );
    this.renderer = null;
    this.editor = null;
    this.buttons = null;
  };

  $.extend( Row.prototype, iui.sheet.model.Entity, {
    setHeight: function ( height ) {
      this.height = height;
      if ( this.ui ) {
        this.ui.height( height );
      }
      this._parent._trigger( "rowChanged" );
    },
    offset: function () {
      if ( this.ui ) {
        this._offset = {
          top: this.ui[ 0 ].offsetTop,
          height: this.ui.height(),
          outerHeight: this.ui.outerHeight(),
          innerHeight: this.ui.innerHeight()
        };
      }
      return this._offset;
    }
  } );
}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "editor": {}
      }
    }
  } );

  iui.sheet.editor.Currency = function ( elements ) {};

  $.extend( iui.sheet.editor.Currency.prototype, {} );
}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "editor": {}
      }
    }
  } );

  iui.sheet.editor.Date = function ( elements ) {};

  $.extend( iui.sheet.editor.Date.prototype, {} );
}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "editor": {}
      }
    }
  } );

  iui.sheet.editor.Email = function ( elements ) {};

  $.extend( iui.sheet.editor.Email.prototype, {} );
}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "editor": {}
      }
    }
  } );

  iui.sheet.editor.Number = function ( elements ) {};

  $.extend( iui.sheet.editor.Number.prototype, {} );
}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "editor": {}
      }
    }
  } );

  iui.sheet.editor.String = function ( elements ) {

  };

  $.extend( iui.sheet.editor.String.prototype, {

  } );

}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );


  var ColumnGroupHeader = iui.sheet.renderer.ColumnGroupHeader = function ( group ) {
    var renderer = $( "<li class='spreadsheet-column spreadsheet-column-group ui-state-default'><span>" + group.label + "<span></li>" )
      .button()
      .removeClass( "ui-corner-all" )
      .resizable( {
        handles: "e",
        minWidth: 2,
        stop: function ( e, ui ) {
          // var group = $(this).data("group");
          // 그룹의 너비를 컬럼의 수로 나눈다.
          var groupWidth = ui.size.width - ui.originalSize.width;
          var columnWidth = Math.floor( groupWidth / group.columns.length );
          var totalWidth = 0;
          group.columns.each( function ( i ) {
            var width = group.columns.length === i + 1 ? groupWidth - totalWidth : columnWidth;
            this.width = this.ui.width() + width;
            this.ui.width( this.width );
            totalWidth += width;
          } );
          group.parent._renderColumns( group.parent.boundary.firstColumn );
        }
      } );
    return renderer;
  };

  $.extend( ColumnGroupHeader.prototype, {} );

}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  iui.sheet.renderer.ColumnHeader = function ( column ) {

  };

  $.extend( iui.sheet.renderer.ColumnHeader.prototype, {

  } );
}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  iui.sheet.renderer.Currency = function ( elements ) {

  };

  $.extend( iui.sheet.renderer.Currency.prototype, {

  } );
}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  iui.sheet.renderer.Date = function ( elements ) {

  };

  $.extend( iui.sheet.renderer.Date.prototype, {

  } );
}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  iui.sheet.renderer.Email = function ( elements ) {

  };

  $.extend( iui.sheet.renderer.Email.prototype, {

  } );
}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  var Renderer = iui.sheet.renderer.Image = function ( cell ) {
    cell = cell || {};

    if ( !( this instanceof Renderer ) ) {
      return new Renderer( cell );
    }

    //console.log( "++++++++++++++++++++++++++++++++++++++++" );
    //console.log( this );

    var div = $( '<div class="spreadsheet-cell">' )
      .attr( 'title', cell.value )
      .addClass( cell.className );
    if ( cell.valie != null ) {
      var img = $( '<img src="/src/img/' + cell.value + '.jpg" />' )
        .attr( 'alt', cell.value )
        .appendTo( div )
        .on( 'load', function ( event ) {
          // console.log( 'image loaded....' );
          // console.log( this );
          // console.log( cell );
          cell.rows.get( 0 ).setHeight( this.height );
          cell.columns.get( 0 ).setWidth( this.width );
        } );
    }
    return div;
  };

}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  iui.sheet.renderer.Number = function ( elements ) {

  };

  $.extend( iui.sheet.renderer.Number.prototype, {

  } );
}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  iui.sheet.renderer.RowHeader = function ( row ) {

  };

  $.extend( iui.sheet.renderer.RowHeader.prototype, {

  } );
}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  var Renderer = iui.sheet.renderer.String = function ( cell ) {
    cell = cell || {};

    if ( !( this instanceof Renderer ) ) {
      return new Renderer( cell );
    }

    return $( '<span>' )
      .text( cell.value )
      .wrap( '<div class="spreadsheet-cell">' ).parent()
      .attr( 'title', cell.value + '111111' )
      .addClass( cell.className );
  };

}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  var Renderer = iui.sheet.renderer.Title = function ( cell ) {
    cell = cell || {};

    if ( !( this instanceof Renderer ) ) {
      return new Renderer( cell );
    }

    return $( '<div style="text-align:center;color:red;font-weight:bolder">' )
      .text( cell.value )
      .wrap( '<div class="spreadsheet-cell">' ).parent()
      .attr( 'title', cell.value )
      .addClass( cell.className );
  };

  $.extend( Renderer.prototype, {

  } );

}( jQuery, window ) );

( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "plugin": {}
      }
    }
  } );

  iui.sheet.plugin.Pagenation = function () {

  };

  $.extend( iui.sheet.plugin.Pagenation.prototype, {

  } );

}( jQuery, window ) );

( function ( factory ) {
  if ( typeof define === "function" && define.amd ) {
    // AMD. Register as an anonymous module.
    define( [
      "jquery"
    ], factory );
  } else {
    // Browser globals
    factory( jQuery );
  }
}( function ( $ ) {
  "use strict";
  // PRIVATE ----------------------------------------------------------------
  var nextId = 0;

  // SHORT CUT
  // 네임스페이스를 일일이 코딩하기는 귀찮으니까, 묶어 놓았던 것을 풀어 놓는다.

  // 관례에 따라 클래스는 대문자, 함수는 소문자로 시작한다.
  var Collection = iui.util.Collection;
  var Iterator = iui.util.Iterator;
  var Base64 = iui.util.Base64;
  var Circuit = iui.util.Circuit;

  var Cell = iui.sheet.model.Cell;
  var Column = iui.sheet.model.Column;
  var ColumnGroup = iui.sheet.model.ColumnGroup;
  var Row = iui.sheet.model.Row;
  var ColumnGroupHeader = iui.sheet.renderer.ColumnGroupHeader;

  var fnv32a = iui.util.fnv32a;
  var laptime = iui.util.laptime;


  // FF IE 등에서 '' 으로 측정되어 NaN이 된다. 
  // 기본 값으로 1을 주는 것은 현재 CSS가 그렇게 설정되어 있기 때문이다.
  // parseInt(NaN || 1) 의 결과 값은 1
  function offsetRight( element ) {
    return Math.round( element.offsetLeft + element.offsetWidth ) - parseInt( $( element ).css( "border-right-width" ) || 1 );
  }

  function offsetBottom( element ) {
    return Math.round( element.offsetTop + element.offsetHeight ) - parseInt( $( element ).css( "border-bottom-width" ) || 1 );
  }



  laptime( "위젯 시작" );

  return $.widget( "iui.january", {
    version: "0.2.522-SNAPSHOT",
    options: {
      height: "auto",
      width: "auto",
      maxHeight: null,
      maxWidth: null,
      minHeight: 150,
      minWidth: 150,

      /* 
       * 그리드 제목
       */
      title: "Innerwave January is jQuery plugin for datagrid.",

      /*
       * 그리드 제목 보임 여부
       */
      showTitle: true,

      /*
       * 컬럼 그룹의 보임 여부
       */
      showColumnGroups: false,

      /*
       * 컬럼
       */
      columns: [],

      /*
       * 기본 컬럼(열) 너비
       */
      defaultColumnWidth: 50,

      /*
       * 컬럼 라벨 보임여부
       */
      showColumnHeaders: false,

      /*
       * 로우(행) 라벨 보임 여부
       */
      showRowHeaders: false,

      /* 
       * 기본 로우(행) 높이
       */
      defaultRowHeight: 24,

      /*
       * 데이터
       */
      data: [],

      /*
       * 데이터 파싱 단위
       */
      dataParseUnit: 10,


      /*
       * 그리드 선 보임 여부
       */
      showDefaultGrid: true,

      /*
       * 그리드 선 색
       */
      defaultGridLineColor: "#CCC",

      /* 
       * 셀 데이터 수정 창 보임 여부
       */
      showValueWindow: false,

      /*
       * 고정 행 수
       */
      numberOfFixedRows: 0,

      /*
       * 고정 열 수
       */
      numberOfFixedColumns: 0,

      // CALLBACKS ----------------------------------------------------------
      ready: $.noop,
      // focus: null,
      // resize: null,
      // resizeStart: null,
      // resizeEnd: null,
      update: $.noop,

      // plugins
      valueWindow: null,

      progressBar: null
    },

    // OVERRIDED ------------------------------------------------------------
    _create: function () {
      this.uid = this.options.id || "sheet" + nextId++;
      this.id = this.options.id || this.uid;
      this.className = "sheet";
      this.parent = null;

      // XXX destroy시에 기존의 엘리먼트를 복구해 놓기 위해 백업해 둔다. ?
      this.original = {
        css: {
          display: this.element[ 0 ].style.display,
          width: this.element[ 0 ].style.width,
          minWidth: this.element[ 0 ].style.minWidth,
          maxWidth: this.element[ 0 ].style.maxWidth,
          minHeight: this.element[ 0 ].style.minHeight,
          maxHeight: this.element[ 0 ].style.maxHeight,
          height: this.element[ 0 ].style.height
        },
        contents: this.element[ 0 ].innerHTML
      };

      this.originalTitle = this.element.attr( "title" );
      this.options.title = this.options.title || this.originalTitle;
      this.element.attr( "title", "" );

      this.boundary = {
        firstRow: 0, //
        numberOfRows: 50, // TODO 디스플레이되는 뷰포트에 볼 수 있는 row의 수에 따라 동적으로 설정 해야 한다..
        firstColumn: 0,
        numberOfColumns: 50, // TODO 디스플레이되는 뷰포트에 볼 수 있는 column의 수에 따라 동적으로 설정해야 한다.
      };

      this._scrolling = false;
      this.cancleParseData = false;

      // 객체 생성에 new를 사용하지 않는 패턴을 사용한다.
      // 그렇게 특별한 이유는 소스 압축시 조금이라도 더 줄이고자... 
      // 그러니 대문자로 함수를 시작하는 것은 객체 생성이라는 생각을 가지자.
      this._columns = Collection();
      this._columnGroups = Collection();
      this.dataProvider = Collection();
      this._rows = Collection();
      this._cells = Collection();

      // 기본 UI 생성을 위한 초기 데이터 파싱
      this.addColumns( this.options.columns );
      // FIXME 현재 옵션으로 제공되는 데이터는 모든 데이터를 파싱하고 렌더링을 한다.
      // 기본 렌더링 후 데이터를 파싱할 수 있도록 수정이 필요할까?
      // this.data(this.options.data);

      this._render();

      laptime( " _create end" );
    },
    //    _delay: function () {},
    //    _destroy: function () {},
    //    _focusable: function () {},
    //    _getCreateEventData: function () {},
    //    _getCreateOptions:function () {},
    //    _hide:function () {},
    //    _hoverable:function () {}, 
    //    _init:function () {},
    //    _off:function () {},
    //    _on:function () {},
    _setOption: function ( key, value ) {
      if ( key === "columns" ) {
        this.columns( value );
      } else if ( key === "data" ) {
        this.data( value );
      }
      this._super( key, value );
      return this;
    },
    //    _setOptions: function (options) {},
    //    _show:function () {},
    //    _super:function () {},
    //    _superApply:function () {},
    //    _trigger:function () {},
    destroy: function () {
      this._super();
    },
    disable: function () {
      this._super();
    },
    enable: function () {
      this._super();
    },
    instance: function () {
      this._super();
    },
    //    option: function () {},
    //    widget: function () {},

    // OWN METHODS ----------------------------------------------------------
    columns: function ( columns ) {
      if ( columns === undefined ) {
        return this._columns.toArray();
      }
      this._columns.empty();
      this.addColumns( columns );
    },

    rows: function ( rows ) {
      if ( rows === undefined ) {
        return this._rows.toArray();
      }
      this._rows.empty();
      this.addRows( rows );
    },

    data: function ( data ) {
      if ( data === undefined ) {
        return this.dataProvider.toArray();
      }
      //      laptime(this.uid + ".< set data into dataprovider");
      this.dataProvider.empty();
      this.dataProvider.addAll( data );

      this.cancleParseData = false;

      // 기본 렌더링이 되었으면 데이터 렌더링을 위한 트리거를 발생한다.
      if ( this.initialized ) {
        this._trigger( "dataChanged" );
      }
      laptime( " .set data into dataprovider >" );
    },


    addColumn: function ( info ) {
      laptime( "addColumn start" );
      var column = Column( info );
      column.parent( this );
      this._columns.add( column );
      var group = this._columnGroups.getById( fnv32a( info.group || column.id ) );
      if ( !group ) {
        group = ColumnGroup( {
          id: fnv32a( info.group || column.id ),
          label: info.group || ''
        } );
        group.parent( this );
        this._columnGroups.add( group );
      }
      group.columns.add( column );
      return column;
    },

    addColumns: function ( infos ) {
      laptime( "addColumns start" );
      var columns = [];
      for ( var i = 0, l = infos.length; i < l; i++ ) {
        infos[ i ].visualId = Column.getColumnLabel( i );
        columns[ columns.length ] = this.addColumn( infos[ i ] );
      }
      return columns;
    },

    addRow: function ( info ) {
      laptime( "addRow start" );
      var row = Row( info );
      row.parent( this );
      this._rows.add( row );
      return row;
    },

    addRows: function ( infos ) {
      laptime( "addRows start" );
      var rows = [];
      for ( var i = 0, l = infos.length; i < l; i++ ) {
        rows.push( this.addRow( infos[ i ] ) );
      }
      return rows;
    },

    addCell: function ( info ) {
      var cell = Cell( info );
      cell.parent( this );
      this._cells.add( cell );
      return cell;
    },

    addCells: function ( infos ) {
      var cells = [];
      for ( var i = 0, l = infos.length; i < l; i++ ) {
        cells.push( this.addCell( infos[ i ] ) );
      }
      return cells;
    },


    _render: function () {
      var that = this;

      this.element.show();
      if ( this.options.width === "auto" || this.options.width === "100%" ) {
        this.element.width( Math.max( this.original.css.minWidth, this.original.css.width || this.element.attr( "width" ) ) );
      } else {
        this.element.width( this.options.width );
      }
      if ( this.options.height === "auto" || this.options.height === "100%" ) {
        this.element.height( Math.max( this.original.css.minHeight, this.original.css.height || this.element.attr( "height" ) ) );
      } else {
        this.element.height( this.options.height );
      }

      this.element.addClass( "spreadsheet ui-widget ui-state-default" );
      // 로더는 가장 먼저 생성하고 z-index로 최상위에 보인다.
      // 데이터 파싱 전에 약간의 시간을 두지만(setTimeout), 렌더링이 안되는 것이 있다.
      // 따라서 가능한 항상 보이기 위해서는 가장 먼저 생성한다.
      this._showProgressBar();

      this.$uiContainer = $( "<div class='spreadsheet-container'>" )
        .width( this.element.width() )
        .height( this.element.height() )
        .appendTo( this.element );
      this.$uiHeader = $( "<div class='spreadsheet-header ui-state-default'>" ).appendTo( this.$uiContainer );
      this.$uiViewport = $( "<div class='spreadsheet-viewport ui-widget-content'>" ).appendTo( this.$uiContainer );
      this.$defaultGrid = $( "<canvas class='spreadsheet-gridlines'>" ).appendTo( this.$uiViewport );
      this.$uiColumnViewport = $( "<div class='spreadsheet-viewport-column ui-state-default'>" ).appendTo( this.$uiContainer );
      this.$uiColumns = $( "<ul class='spreadsheet-column-list'>" )
        .sortable( {
          zIndex: 9999,
          placeholder: 'ui-state-highlight spreadsheet-placeholder-column',
          start: function ( event, ui ) {
            var $uiColumns = that.$uiColumns.children();
            var uiIndex = $uiColumns.index( ui.item[ 0 ] );
            $( ui.item[ 0 ] ).data( "originalIndex", uiIndex );
          },
          stop: function ( event, ui ) {
            var originalIndex = $( ui.item[ 0 ] ).data( "originalIndex" );
            var $uiColumns = that.$uiColumns.children();
            var uiIndex = $uiColumns.index( ui.item[ 0 ] );
            that._columns.move( ui.item[ 0 ].id, uiIndex - originalIndex );
            that._trigger( "columnChanged" );
          }
        } )
        .disableSelection()
        .appendTo( this.$uiColumnViewport );
      this.$uiRowViewport = $( "<div class='spreadsheet-viewport-row ui-state-default'>" )
        .appendTo( this.$uiContainer );
      this.$uiRows = $( "<ul class='spreadsheet-row-list'>" )
        .sortable( {
          placeholder: 'ui-state-highlight spreadsheet-placeholder-row',
          start: function ( event, ui ) {
            var $uiRows = that.$uiRows.children();
            var uiIndex = $uiRows.index( ui.item[ 0 ] );
            $( ui.item[ 0 ] ).data( "originalIndex", uiIndex );
          },
          stop: function ( event, ui ) {
            var originalIndex = $( ui.item[ 0 ] ).data( "originalIndex" );
            var $uiRows = that.$uiRows.children();
            var uiIndex = $uiRows.index( ui.item[ 0 ] );
            that._rows.move( ui.item[ 0 ].id, uiIndex - originalIndex );
            that._trigger( "rowChanged" );
          }
        } )
        .disableSelection()
        .appendTo( this.$uiRowViewport );

      this.$uiColumnViewport.css( "margin-left", this.$uiRowViewport.outerWidth() + "px" );

      this._renderTitleBar();
      this._renderColumns();
      this._renderRows();
      this._createValueWindow();
      this.$uiViewport
        .width( this.$uiContainer.width() - this.$uiRowViewport.outerWidth() )
        .height( this.$uiContainer.height() - this.$uiHeader.outerHeight() - this.$uiColumnViewport.outerHeight() );

      this.$uiFooter = $( "<div class='spreadsheet-footer ui-state-default'>" )
        .appendTo( this.$uiContainer );
      this.$uiVerticalScrollArea = $( "<div class='spreadsheet-scrollbar scroll-area-vertical'>" )
        .appendTo( this.$uiContainer );
      this.$uiHorizontalScrollArea = $( "<div class='spreadsheet-scrollbar scroll-area-horizontal'>" )
        .appendTo( this.$uiFooter );

      // Regist some Event handlers..
      this._setupEvents();

      //      laptime(this.uid + ". _render >");
      this._trigger( "initialized" );
    },


    _parseEachData: function ( data, row ) {
      // TODO 조회한 셀정보 데이터를 되살린다.
      // 그래야 컬럼 및 로우 머지를 할 수 있다. cellspan, rowspan...
      var
        column,
        cell,
        cellInfo = {},
        that = this,
        i, l, item;
      $.each( data, function ( key ) {
        if ( key === "id" || key === "uid" || key === "uid" || key === "height" || key === "width" ) {
          row.key = this;
          return;
        }
        if ( typeof this === "string" ) {
          cellInfo = {
            value: this
          };
        } else {
          cellInfo = this;
        }
        cell = that.addCell( cellInfo );
        row.cells.add( cell );
        cell.rows.add( row );
        if ( cellInfo.rows ) {
          for ( i = 0, l = cellInfo.rows.length; i < l; i++ ) {
            item = that._rows.getById( cellInfo.rows[ i ] );
            if ( item && $.inArray( cell.rows.toArray(), item ) < 0 ) {
              cell.rows.add( item );
            }
          }
        }

        column = that._columns.getById( key );
        column.cells.add( cell );
        if ( cellInfo.columns ) {
          for ( i = 0, l = cellInfo.columns.length; i < l; i++ ) {
            item = that._columns.getById( cellInfo.columns[ i ] );
            if ( item && $.inArray( cell.columns.toArray(), item ) < 0 ) {
              cell.columns.add( item );
            }
          }
        }

        cell.columns.add( column );
      } );
    },

    //TODO HTML5 WebWorker를 사용하도록 기능을 추가하자
    // webworker를 지원하는 브라우저인지는 Modernizr 를 사용하자.
    // 테스트는 !!window.Worker; 로 간단하지만 다른 기능을 검사하는 것 canvas, svg, video, ...
    //    tests['webworkers'] = function() {
    //        return !!window.Worker;
    //    };
    // 암튼 현재 사용하고 있는 것은 반복 프로세스를 끊어서 프로그레스를 표시하는 방식이다.
    // IE 10 부터 webworker를 지원한다고 하니 작성하여 봄직하다.
    _parseData: function () {
      if ( !this.initialized ) {
        return;
      }
      if ( this.cancleParseData ) {
        return;
      }

      var that = this,
        i = 0,
        l = this.dataProvider.length,
        row, data, key, value;

      this._rows.empty();
      this._cells.empty();
      var dp = this.dataProvider.toArray(),
        chunks = [],
        size = this.options.dataParseUnit,
        progress = 0,
        noc = 0;

      for ( i = 0, l = dp.length; i < l; i += size ) {
        chunks.push( dp.slice( i, Math.min( i + size, l ) ) );
      }

      var parse = function ( chunk ) {
        for ( i = 0, l = chunk.length; i < l; i++ ) {
          data = chunk[ i ];
          row = this.addRow( data );
          // TODO 기존의 셀 정보를 복구하기 위해서는 데이터(VALUE)뿐 아니라
          // 셀 포맷 정보까지도 복구 되어야 한다.
          this._parseEachData( data, row );
        }
        progress += i;
        if ( this.$uiProgressBar.progressbar( "instance" ) !== undefined ) {
          this.$uiProgressBar.progressbar( "value", parseInt( progress / dp.length * 100 ) );
        }
        // XXX 파싱 데이터 실시간 렌더링 파싱 자체에 결려 있는 타임아웃과 조율이 필요하다.
        this._delay( function () {
          this._trigger( "rowChanged" );
        }, 10 );

        if ( noc >= chunks.length - 1 ) {
          //          laptime(this.uid + "._parseData >");
        } else {
          if ( this.cancleParseData ) {
            //            laptime(this.uid + "._parseData CANCELED >");
            return;
          }
          //          laptime(this.uid + '._parseData ...');
          this._delay( function () {
            parse.call( this, chunks[ ++noc ] );
          }, 30 );
        }
      };

      if ( chunks.length > 0 ) {
        parse.call( this, chunks[ noc ] );
      }
    },

    /**
     * @public stopParseData
     * 진행 중인 데이터 변환 작업을 중단하고 프로그레스바를 숨긴다.
     * 현재까지 파싱한 데이터는 유지되고, 파싱된 데이터에 대한 모든 기능은 정상 작동한다.
     */
    stopParseData: function () {
      this.cancleParseData = true;
      this._hideProgressBar( "slow" );
    },




    _hideProgressBar: function ( speed ) {
      if ( this.$uiProgressBar ) {
        this.$uiProgressBar.hide( speed );
      }
    },

    _showProgressBar: function () {
      var that = this;
      if ( this.$uiProgressBar ) {
        this.$uiProgressBar.show();
      } else if ( this.options.progressBar ) { // plugin
        this.$uiProgressBar = this.options.progressBar
          .appendTo( this.element )
          .show();
      } else { //fallback
        this.$uiProgressLabel = $( '<div class="spreadsheet-progress-label">' )
          .text( 'Loading......' );
        this.$uiProgressBar = $( '<div class="spreadsheet-progress">' )
          .progressbar( {
            value: false,
            change: function () {
              that.$uiProgressLabel.text( that.$uiProgressBar.progressbar( "value" ) + "% " )
                .css( 'left', ( that.$uiProgressBar.width() - that.$uiProgressLabel.outerWidth() ) / 2 + 'px' );
            },
            complete: function () {
              that.$uiProgressLabel.text( "100%" );
              that.$uiProgressLabel.css( 'left', ( that.$uiProgressBar.width() - that.$uiProgressLabel.outerWidth() ) / 2 + 'px' );
              that.$uiProgressBar.hide( 'slow' );
            }
          } )
          .append( this.$uiProgressLabel )
          .appendTo( this.element );
      }
      this.$uiProgressBar.attr( 'title', 'STOP! Click to stop the data is parsed.' )
        .off( 'click' )
        .click( function ( e ) {
          console.log( that.uid + ' . $uiProgressBar.onClick()' );
          that.stopParseData();
        } )
        .css( {
          top: ( this.element.height() - this.$uiProgressBar.outerHeight() ) / 2 + 'px',
          left: ( this.element.width() - this.$uiProgressBar.outerWidth() ) / 2 + 'px'
        } );
    },

    _renderTitleBar: function () {
      if ( this.options.showTitle === true ) {
        this.$uiTitle = $( '<span class="spreadsheet-title">' )
          .text( this.options.title )
          .appendTo( this.$uiHeader );
      } else {
        this.$uiHeader.remove();
      }
    },

    _createValueWindow: function () {
      if ( this.options.showValueWindow === true ) {
        // FIXME 위겟을 선언해야 할지 생각해 보자.
        this.$uiValueWindow = $( '<div class="spreadsheet-value-window ui-widget">' )
          .append( '<span class="value-editor-label">Value: </span>' )
          .append( '<input type="text" class="ui-widget ui-widget-content"/>' )
          .prependTo( this.$uiColumnViewport );
      }
    },


    _createUiColumn: function ( i, column ) {
      var that = this;
      return column.ui = $( '<li>' )
        .attr( 'id', column.uid )
        .addClass( column.className )
        .width( column.offset().width )
        .append(
          $( '<span>' ).text(
            column.label !== undefined ? column.label : column.visualId /* getColumnHeaderText(i) */
          )
        )
        .append( '<div class="indicator">' )
        .data( 'column', column )
        .button()
        .removeClass( 'ui-corner-all' )
        .resizable( {
          handles: 'e',
          minWidth: 2,
          stop: function ( e, ui ) {
            column.width = ui.size.width;
            column.ui.width( column.width );
            that._renderColumns( that.boundary.firstColumn );
          }
        } )
        .on( 'click', function ( event ) {
          // XXX 별 효력이 없어ㅜㅜ;
          // 데이터 처리와 렌더링에는 차이가 있는 것 같다.ㅜㅜ;
          //          if (that.startColumnHighlighting === true) {return false;}
          //          laptime(this.uid + '.<column header click...' + this.outerText);
          //          that.startColumnHighlighting = true;
          if ( event.ctrlKey === false ) {
            that._cells.each( 'removeClass', [ 'ui-state-highlight' ] );
            that._columns.each( 'removeClass', [ 'ui-state-highlight' ] );
            that._rows.each( 'removeClass', [ 'ui-state-highlight' ] );
          }
          column.addClass( 'ui-state-highlight' );
          column.cells.each( 'addClass', [ 'ui-state-highlight' ] );
          //          laptime(this.uid + '.column header click...>');
          //          that.startColumnHighlighting = false;
        } )
        .mousedown( function ( event ) {
          var uis = [];
          var column = that._columns.getById( this.id );
          if ( column.group ) {
            var group = that._columnGroups.getById( fnv32a( column.group ) );
            uis = $.map( group.columns.toArray(), function ( column, index ) {
              return column.ui;
            } );
          } else {
            uis = that.$uiColumns.children().map( function () {
              column = that._columns.getById( this.id );
              return column.group ? null : this;
            } );
          }
          that.$uiColumns.sortable( 'option', 'items', uis );
        } );
    },

    __renderColumns: function ( newFirstColumn ) {
      //      laptime(this.uid + '.<__renderColumns');

      var
        that = this,
        i = 0,
        l = 0,
        column, $uiColumn,
        group, groups = [],
        columnsWidth = 0;

      function render() {
        var groupid;
        /*jshint validthis:true */
        for ( ; i < l && columnsWidth < this.$uiViewport.width(); i++ ) {
          column = this._columns.get( i );
          column.removeClass( 'ui-state-hover' );
          $uiColumn = ( column.ui || this._createUiColumn( i, column ) ).appendTo( this.$uiColumns );
          $uiColumn.removeClass().addClass( column.className );
          columnsWidth += column.offset().outerWidth;

          if ( this.options.showColumnGroups ) {
            groupid = fnv32a( column.group || column.id );
            group = this._columnGroups.getById( groupid );
            if ( !group ) {
              group = new ColumnGroup( {
                id: groupid,
                label: column.group
              } );
              group.parent( this );
              group.columns.add( column );
              this._columnGroups.add( group );
            }
            groups.push( group );
          }
        }
      }

      this.$uiColumns.children().detach();

      // Fixed Columns
      if ( this.options.numberOfFixedColumns > 0 ) {
        i = 0;
        l = this.options.numberOfFixedColumns;
        render.call( this );
      }

      // Floated Columns
      newFirstColumn = Math.max( Math.min( Math.max( this.options.numberOfFixedColumns, newFirstColumn || 0 ), this._columns.length - 1 /* this.boundary.numberOfColumns*/ ), 0 );
      this.boundary.firstColumn = newFirstColumn;
      i = newFirstColumn;
      l = Math.min( newFirstColumn + this.boundary.numberOfColumns, this._columns.length );
      render.call( this );

      //column group
      if ( this.options.showColumnGroups === false ) {
        if ( this.$uiColumnGroups ) {
          this.$uiColumnGroups.hide();
        }
      } else {
        this.$uiColumnGroups = this.$uiColumnGroups ||
          $( '<ul class="spreadsheet-column-group-list">' )
          .disableSelection()
          .insertBefore( this.$uiColumns );
        this.$uiColumnGroups.children().each( function ( i ) {
          $( this ).detach();
        } );
        for ( i = 0, l = groups.length; i < l; i++ ) {
          group = groups[ i ];
          group.ui().appendTo( this.$uiColumnGroups );
        }
      }

      if ( this.options.showColumnHeaders === false ) {
        if ( this.$uiColumnGroups ) {
          this.$uiColumnGroups.hide();
        }
        this.$uiColumns.addClass( 'hidden' );
      } else {
        if ( this.$uiColumnGroups ) {
          this.$uiColumnGroups.show();
        }
        this.$uiColumns.removeClass( 'hidden' );
      }

      this.$uiViewport
        .width( this.$uiContainer.width() - this.$uiRowViewport.outerWidth() )
        .height( this.$uiContainer.height() - this.$uiHeader.outerHeight() - this.$uiColumnViewport.outerHeight() );

      //      laptime(this.uid + '.__renderColumns>');
      this._renderData();
    },

    _renderColumns: ( function () {
      var timeoutIds = {};
      return function ( newFirstColumn ) {
        //        laptime(this.uid + '.' + timeoutIds[this.uid] + '.<_renderColumns');
        clearTimeout( timeoutIds[ this.uid ] );
        timeoutIds[ this.uid ] = this._delay( function () {
          this.__renderColumns( newFirstColumn );
        }, 30 );
        //        laptime(this.uid + '.' + timeoutIds[this.uid] + '._renderColumns>');
      };
    } )(),

    _onRowResize: function ( ui, row ) {
      row.height = ui.size.height;
      row.ui.height( ui.size.height );
      this._renderRows(
        this.boundary.firstRow
      );
    },

    _createUiRow: function ( i, row ) {
      var that = this;
      return row.ui = $( '<li>' )
        .attr( 'id', row.uid )
        .addClass( row.className )
        .height( row.height )
        .append( $( '<span>' ).text( row.label || i + 1 ) )
        .append( '<div class="indicator">' )
        .button().removeClass( 'ui-corner-all' )
        .resizable( {
          handles: 's',
          minHeight: 2,
          stop: function ( e, ui ) {
            that._onRowResize( ui, row );
          }
        } )
        .on( 'click', function ( event ) {
          if ( event.ctrlKey === false ) {
            that._cells.each( 'removeClass', [ 'ui-state-highlight' ] );
            that._columns.each( 'removeClass', [ 'ui-state-highlight' ] );
            that._rows.each( 'removeClass', [ 'ui-state-highlight' ] );
          }
          row.addClass( 'ui-state-highlight' );
          row.cells.each( 'addClass', [ 'ui-state-highlight' ] );
        } );
    },

    __renderRows: function ( newFirstRow ) {
      var
        that = this,
        i = 0,
        l = 0,
        rowsHeight = 0,
        viewportHeight = this.$uiViewport.height();

      function render( fixed ) {
        var row, $uiRow;
        /*jshint validthis:true */
        for ( ; i < l && rowsHeight < viewportHeight; i++ ) {
          row = this._rows.get( i );
          row.fixed = !!fixed;
          row.removeClass( 'ui-state-hover' );
          $uiRow = ( row.ui || this._createUiRow( i, row ) ).appendTo( this.$uiRows );
          $uiRow.removeClass().addClass( row.className );
          rowsHeight += row.offset().outerHeight;
        }
      }

      this.$uiRows.children().detach();

      // Fixed Rows
      if ( this.options.numberOfFixedRows > 0 ) {
        i = 0;
        l = this.options.numberOfFixedRows;
        render.call( this, true );
      }

      // Floated Rows
      newFirstRow = Math.max( Math.min( Math.max( this.options.numberOfFixedRows, newFirstRow || 0 ), this._rows.length - 1 /* this.boundary.numberOfRows*/ ), 0 );
      this.boundary.firstRow = newFirstRow;
      i = newFirstRow;
      l = Math.min( newFirstRow + this.boundary.numberOfRows, this._rows.length );
      render.call( this, false );

      if ( this.options.showRowHeaders === false ) {
        this.$uiRowViewport.addClass( 'hidden' );
        this.$uiColumnViewport.css( 'margin-left', this.$uiRowViewport.outerWidth() + 'px' );
      } else {
        this.$uiRowViewport.removeClass( 'hidden' );
      }

      this.$uiViewport
        .width( this.$uiContainer.width() - this.$uiRowViewport.outerWidth() )
        .height( this.$uiContainer.height() - this.$uiHeader.outerHeight() - this.$uiColumnViewport.outerHeight() );

      this._renderData();
    },

    _renderRows: ( function () {
      var timeoutIds = {};
      return function ( newFirstRow ) {
        clearTimeout( timeoutIds[ this.uid ] );
        timeoutIds[ this.uid ] = this._delay( function () {
          this.__renderRows( newFirstRow );
        }, 10 );
      };
    }() ),

    _offsetOfCell: function ( cell ) {
      var left = Number.MAX_VALUE,
        top = Number.MAX_VALUE,
        width = 0,
        height = 0,
        i, l, item, offset;

      for ( i = 0, l = cell.columns.length; i < l; i++ ) {
        item = cell.columns.get( i );
        offset = item.offset();
        left = Math.min( left, offset.left );
        width += offset.innerWidth;
      }

      for ( i = 0, l = cell.rows.length; i < l; i++ ) {
        item = cell.rows.get( i );
        offset = item.offset();
        top = Math.min( top, offset.top );
        height += offset.innerHeight;
      }

      return {
        left: left,
        top: top,
        width: width,
        height: height
      };
    },

    _initUiOfCell: function ( cell ) {
      // TODO cell에 지정된 formular가 있을 경우 이를 처리
      var that = this;
      cell.ui = cell.getRenderer()( cell )
        .hover( function () {
          if ( that._scrolling ) {
            return;
          }
          cell.ui.addClass( 'ui-state-hover' );
          $.each( cell.columns.toArray(), function ( i ) {
            this.addClass( 'ui-state-hover' );
          } );
          $.each( cell.rows.toArray(), function ( i ) {
            this.addClass( 'ui-state-hover' );
          } );
        }, function () {
          cell.ui.removeClass( 'ui-state-hover' );
          $.each( cell.columns.toArray(), function ( i ) {
            this.removeClass( 'ui-state-hover' );
          } );
          $.each( cell.rows.toArray(), function ( i ) {
            this.removeClass( 'ui-state-hover' );
          } );
        } )
        .on( 'click', function ( event ) {
          this.currentCell = cell;
          this.currentCells = this.currentCells || [];
          if ( event.ctrlKey === false ) {
            this.currentCells = [];
            that._cells.each( 'removeClass', [ 'ui-state-highlight' ] );
            that._columns.each( 'removeClass', [ 'ui-state-highlight' ] );
            that._rows.each( 'removeClass', [ 'ui-state-highlight' ] );
          }
          this.currentCells.push( cell );

          cell.addClass( 'ui-state-highlight' );
          $.each( cell.columns.toArray(), function ( i ) {
            this.addClass( 'ui-state-highlight' );
          } );
          $.each( cell.rows.toArray(), function ( i ) {
            this.addClass( 'ui-state-highlight' );
          } );

          if ( that.options.showValueWindow === true ) {
            that.$uiValueWindow.find( 'input:text' ).val( cell.value );
          }
        } )
        .disableSelection();
      return cell.ui;
    },

    // 데이터 렌더링
    // 딜레이를 주어 빈번한 렌더링에 따른 부하를 줄인다.
    // 메소드 만의 static private 변수 timeoutId를 사용하기 위한 방법으로 클로저를 사용하여 변수의 오염을 방지한다.
    _renderData: ( function () {
      var timeoutIds = {};
      return function () {

        clearTimeout( timeoutIds[ this.uid ] );
        this._createScrollbars();
        this._drawDefaultGrid();

        timeoutIds[ this.uid ] = this._delay( function () {
          var
            ci = this.boundary.firstColumn,
            ri = this.boundary.firstRow,
            noc = this.$uiColumns.children() /*.filter('li')*/ .length,
            nor = this.$uiRows.children() /*.filter('li')*/ .length,
            nofr = this.options.numberOfFixedRows,
            nofc = this.options.numberOfFixedColumns,
            _rows = this._rows.toArray(),
            _columns = this._columns.toArray(),
            rows = _rows.slice( ri, ri + nor - nofr ).concat( _rows.slice( 0, nofr ) ),
            columns = _columns.slice( ci, ci + noc - nofc ).concat( _columns.slice( 0, nofc ) ),
            // 새롭게 보일 셀 추출
            cells = $.map( rows, function ( row ) {
              return $.map( row.cells.toArray(), function ( cell ) {
                return $.map( cell.columns.toArray(), function ( column ) {
                  return $.inArray( column, columns ) >= 0 ? true : null;
                } ).length > 0 ? cell : null;
              } );
            } ),
            i, l, cell;
          // 기존 셀 숨김
          this.$uiViewport.find( 'div.spreadsheet-cell' ).detach();
          // 새로운 셀 보임
          for ( i = 0, l = cells.length; i < l; i++ ) {
            cell = cells[ i ];
            ( cell.ui || this._initUiOfCell( cell ) )
            .removeClass()
              .addClass( cell.className )
              .css( this._offsetOfCell( cell ) )
              .appendTo( this.$uiViewport );
          }
        }, 30 );
      };
    }() ),

    _createScrollbars: function () {
      // TODO 필요할 때만 스크롤바를 노출 할 수 있도록 처리
      var that = this,
        minRows = Math.max( this.options.numberOfFixedRows, 0 ),
        maxRows = this._rows.length - 1,
        minColumns = Math.max( this.options.numberOfFixedColumns, 0 ),
        maxColumns = this._columns.length - 1;

      // 좀 간편하게 할 수 있는 방법이 없을까?
      this.$uiVerticalScrollArea.height( this.$uiContainer.height() - this.$uiHeader.outerHeight() - this.$uiColumnViewport.outerHeight() - parseInt( this.$uiVerticalScrollArea.css( 'border-top' ) || 1 ) - parseInt( this.$uiVerticalScrollArea.css( 'bottom' ) || 0 ) );
      this.$uiHorizontalScrollArea.width( this.$uiContainer.width() - this.$uiRowViewport.outerWidth() - parseInt( this.$uiHorizontalScrollArea.css( 'border-left' ) || 1 ) - parseInt( this.$uiHorizontalScrollArea.css( 'border-right' ) || 1 ) - parseInt( this.$uiHorizontalScrollArea.css( 'right' ) || 0 ) );

      if ( !this.$uiVerticalScrollbar ) {
        this.$uiVerticalScrollbar = $( '<div class="spreadsheet-scrollbar spreadsheet-scrollbar-vertical">' )
          .scroller( {
            orientation: "vertical",
            value: minRows,
            min: minRows,
            max: maxRows,
            step: 1,
            start: function ( event, ui ) {
              that._scrolling = true;
            },
            stop: function ( event, ui ) {
              that._scrolling = false;
            },
            slide: function ( event, ui ) {
              that._renderRows( ui.value );
            }
          } )
          .appendTo( this.$uiVerticalScrollArea );
      } else {
        // XXX 데이터 파싱이 되는 대로 스크롤바의 최대 값을 조정한다.
        // 이렇게 할 때, 파싱되지 않고 남은 데이터의 처리 방안을 생각해 보자.
        this.$uiVerticalScrollbar
          .scroller( 'option', 'min', minRows )
          .scroller( 'option', 'max', maxRows );
      }

      if ( !this.$uiHorizontalScrollbar ) {
        this.$uiHorizontalScrollbar = $( '<div class="spreadsheet-scrollbar spreadsheet-scrollbar-horizontal">' )
          .scroller( {
            value: minColumns,
            min: minColumns,
            max: maxColumns,
            step: 1,
            start: function ( event, ui ) {
              that._scrolling = true;
            },
            stop: function ( event, ui ) {
              that._scrolling = false;
            },
            slide: function ( event, ui ) {
              that._renderColumns( ui.value );
            }
          } )
          .appendTo( this.$uiHorizontalScrollArea );
      } else {
        this.$uiHorizontalScrollbar
          .scroller( 'option', 'min', minColumns )
          .scroller( 'option', 'max', maxColumns );
      }
    },

    _drawDefaultGrid: function () {
      this.$uiViewport.css( {
        top: this.$uiRows.offset().top - this.$uiContainer.offset().top,
        left: this.$uiColumns.offset().left - this.$uiContainer.offset().left,
      } );
      if ( Modernizr.canvas && this.options.showDefaultGrid ) {
        var width = 0,
          height = 0;

        // 그리드 라인을 셀 영역에만 그린다.
        this.$uiColumns.children().each( function ( i ) {
          width += $( this ).outerWidth();
        } );

        this.$uiRows.children().each( function ( i ) {
          height += $( this ).outerHeight();
        } );

        this.$defaultGrid.attr( {
          width: width,
          height: height
        } );

        var ctx = this.$defaultGrid[ 0 ].getContext( '2d' );
        ctx.fillStyle = this.options.defaultGridLineColor;

        //vertical lines per columns in viewport
        this.$uiColumns.children().each( function ( i ) {
          ctx.fillRect( offsetRight( this ), 0, 1, height );
        } );

        // horizontal lines per rows in viewport
        this.$uiRows.children().each( function ( i ) {
          ctx.fillRect( 0, offsetBottom( this ), width, 1 );
        } );
      }
    },


    setPlugins: function () {},

    open: function () {},
    close: function () {},


    _setupEvents: function () {
      var that = this;
      this._on( {
        'januarycolumnchanged': function ( event ) {
          laptime( "januarycolumnchanged ............... " );
          if ( this.$uiHorizontalScrollbar ) {
            this.$uiHorizontalScrollbar.scroller( 'option', 'max', this._columns.length );
            this._renderColumns( this.$uiHorizontalScrollbar.scroller( 'value' ) );
          } else {
            this._renderColumns();
          }
        },
        'januaryrowchanged': function ( event ) {
          laptime( "januaryrowchanged ............... " );
          if ( this.$uiVerticalScrollbar ) {
            this.$uiVerticalScrollbar.scroller( 'option', 'max', this._rows.length );
            this._renderRows( this.$uiVerticalScrollbar.scroller( 'value' ) );
          } else {
            this._renderRows();
          }
        },
        'januarydatachanged': function ( event ) {
          laptime( "januarydatachanged ............... " );
          this._parseData();
        },
        'januaryinitialized': function ( event ) {
          laptime( 'januaryinitialized ............... ' );
          this.initialized = true;
          if ( this.dataProvider.length > 0 ) {
            // 파싱전에 화면에 시트 기본 UI를 디스플레이하기 위해 딜레이를 준다.
            this._delay( this._parseData, 500 );
          }
        }
      } );

      // this._off(this.handles);

      $.each( [
          this.$uiColumnViewport,
          this.$uiHorizontalScrollArea
        ],
        function ( i ) {
          this.mousewheel( function ( event ) {
            event.preventDefault();
            that._onHorizontalWheel.call( that, event.deltaY || event.deltaX );
          } );
        } );

      $.each( [
          this.$uiRowViewport,
          this.$uiVerticalScrollArea
        ],
        function ( i ) {
          this.mousewheel( function ( event ) {
            event.preventDefault();
            that._onVerticalWheel.call( that, event.deltaY || event.deltaX );
          } );
        } );

      this.$uiViewport.mousewheel( function ( event ) {
        event.preventDefault();
        if ( event.shiftKey === true ) {
          that._onHorizontalWheel.call( that, event.deltaX || event.deltaY );
        } else {
          that._onVerticalWheel.call( that, event.deltaY );
        }
      } );
    },

    //-------------------------------------------------------------------
    // EVENT Handler
    _onVerticalWheel: function ( value ) {
      this.verticalScrollBy( value );
    },

    _onHorizontalWheel: function ( value ) {
      this.horizontalScrollBy( value );
    },

    /**
     * @private
     *
     * 스크롤할 값만 정수로 준다.
     * 기준값은 스크롤러의 값이다.
     */
    verticalScrollBy: function ( value ) {
      var newVal = this.$uiVerticalScrollbar.scroller( 'value' ) - value;
      this._renderRows( newVal );
      this.$uiVerticalScrollbar.scroller( 'value', newVal );
    },

    /**
     * @private
     * 스크롤할 값만 정수로 준다.
     * 기준값은 스크롤러의 값이다.
     */
    horizontalScrollBy: function ( value ) {
      var newVal = this.$uiHorizontalScrollbar.scroller( 'value' ) - value;
      this._renderColumns( newVal );
      this.$uiHorizontalScrollbar.scroller( 'value', newVal );
    },

    _startKeyNavigation: function ( event, cursor ) {
      // 시작 가능여부를 반환
      // 시작시 필요한 것 처리..
      switch ( event.keyCode ) {
      case $.ui.keyCode.HOME:
        cursor.column = 0;
        cursor.row = 0;
        return false;
      case $.ui.keyCode.END:
        cursor.column = this._columns.length - 1;
        cursor.row = this._rows.length - 1;
        return false;
      case $.ui.keyCode.PAGE_UP:
      case $.ui.keyCode.PAGE_DOWN:
      case $.ui.keyCode.UP:
      case $.ui.keyCode.RIGHT:
      case $.ui.keyCode.DOWN:
      case $.ui.keyCode.LEFT:
      }
      return true;
    },

    _handleEvents: {
      keydown: function ( event ) {
        var allowed, curVal, newVal, step,
          // 이동 할 셀 포인트( {columlIndex, rowIndex}
          cursor = $( event.target ).data( "ui-sheet-cell-cursor" ) || {
            column: 0,
            row: 0
          };

        switch ( event.keyCode ) {
        case $.ui.keyCode.HOME:
        case $.ui.keyCode.END:
        case $.ui.keyCode.PAGE_UP:
        case $.ui.keyCode.PAGE_DOWN:
        case $.ui.keyCode.UP:
        case $.ui.keyCode.RIGHT:
        case $.ui.keyCode.DOWN:
        case $.ui.keyCode.LEFT:
          event.preventDefault();
          if ( !this._keyNavigating ) {
            this._keyNavigating = true;
            // 커서 셀을 엑티브 상태로
            cell.addClass( 'ui-state-active' );
            allowed = this._startKeyNavigation( event, cursor );
            if ( allowed === false ) {
              return;
            }
          }
          break;
        }

        switch ( event.keyCode ) {
        case $.ui.keyCode.HOME:
          newVal = this._valueMin();
          break;
        case $.ui.keyCode.END:
          newVal = this._valueMax();
          break;
        case $.ui.keyCode.PAGE_UP:
          newVal = this._trimAlignValue(
            curVal + ( ( this._valueMax() - this._valueMin() ) / this.numPages )
          );
          break;
        case $.ui.keyCode.PAGE_DOWN:
          newVal = this._trimAlignValue(
            curVal - ( ( this._valueMax() - this._valueMin() ) / this.numPages ) );
          break;
        case $.ui.keyCode.UP:
        case $.ui.keyCode.RIGHT:
          if ( curVal === this._valueMax() ) {
            return;
          }
          newVal = this._trimAlignValue( curVal + step );
          break;
        case $.ui.keyCode.DOWN:
        case $.ui.keyCode.LEFT:
          if ( curVal === this._valueMin() ) {
            return;
          }
          newVal = this._trimAlignValue( curVal - step );
          break;
        }
      },
      keyup: function ( event ) {
        var index = $( event.target ).data( "ui-slider-handle-index" );

        if ( this._keySliding ) {
          this._keySliding = false;
          this._stop( event, index );
          this._change( event, index );
          $( event.target ).removeClass( "ui-state-active" );
        }
      }
    }


  } );


} ) );
