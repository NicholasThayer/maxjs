/*
 * I should really try doing this 
 * as if were running in an old browser
 * using es5-shim -> babel -> rollup -> closure compiler
 * 
 * is the object order of patcher.apply variable or fixed?
 * if it's fixed I can use that to index the 
 * 
 * does a non-returning callback halt the all variable loading 
*/


var isArray = Array.isArray;


module.exports = (function () {

  var cache = require('./global-cache');
  var model;

  return mom;


  function mom(thisArg) {
    if(!model){

    }
  }
}());


function newModel(src, opts){
  var model;
  if(src){
    if(src.type && src.type == 'patchModel'){
      return src.childrenFromPatcher( src.obj.patcher || src.obj );
    }else {
      if(src.patcher){
        src = src.patcher;
      }
      return newPatcher(opts).childrenFromPatcher(src);
    }
  }

  return model;


  function childrenFromPatcher(srcPatcher) {
    var thisModel = this;
    return wrapMaxObjs(srcPatcher, thisModel.addChild)

    function wrapMaxObjs( src, cb ){
      src.apply(function caller(mObj){
        cb( wrap( parse( mObj ) ));
      });

      return thisModel;


      function parse(obj){
        var id   = parseId(obj);

        return {
          parent : thisModel,
          obj    : obj,
          id     : id,
          type   : parseType(obj),
          path   : thisModel.path + '/' + id.join('/'),

        };
      }

      function wrap(opts){

        return wrapPatcher(opts) ||
               wrapScript(opts)  ||
               wrapGeneric(opts);


        function wrapPatcher(opts){
          if(opts.type == patcher){
            return newModel(opts.obj.patcher, opts);
          }else{
            return false;
          }
        }

        function wrapScript(opts){
          if(opts.type == script){
            return newScript(opts);
          }else{
            return false;
          }
        }

        function wrapGeneric(opts){
          return newGeneric(opts);
        }
      }

      function parseId(obj){
        var name;
        if(obj.varname){
          name = obj.varname.split(/\[|\]/);
          name[1] = name[1] || 0;
        }else{
          var arr;
          name = ['anon_'+obj.maxclass];
          arr = ret.objs[name[0]] || [];
          name[1] = arr.length;
        }
        return name;
      }

      function parseType(obj){
        var mClass = obj.maxclass || 'patcher';
        if( mClass == 'patcher'   || 'bpatcher' ){
          return 'patcher';
        }
        else if( mClass == 'js' || 'jsui' ){
          return 'script'
        }
        else{
          return mClass;
        }
      }
    }
  }

  function newPatcher(opts){ 
    opts = opts || {};
    opts.type         =  'patchModel'
    opts.children     =  opts.children     ||  {};
    opts.hist         =  opts.hist         ||  [];
    opts.addObj       =  opts.addObj       ||  addObj;
    opts.fromPatcher  =  opts.fromPatcher  ||  fromPatcher;
    opts.addObj       =  opts.addObj       ||  addObj;
    opts.get          =  opts.get          ||  getModel;
    opts.set          =  opts.set          ||  setModel;

    return newGeneric(opts);

    function getModel(){
      var val = this.obj.getvalueof();
      if( val != this.value){
        this.value = val;
        this.emit('update', this);
      }
      return this;
    }

    function setModel(val){
      this.obj.setvalueof(val);
      this.emit('update', this);
      return this;
    }

    function addChild(cObj){
      return this;
    }
  }

  function newGeneric(opts){
    var ret = {
      obj    : {},
      hist   : [],
      value  : '',
      path   : '',
      type   : 'generic'
      id     : ['anon_generic', 0],
      parent : {},
      events : {},
      on     : on,
      emit   : emit,
      get    : get,
      set    : set
    }

    for(var i in opts){
      ret[i] = opts[i];
    }



    return ret;
  }

  function get(){
    var val  = this.obj.getvalueof();
    if( val != this.value){
      this.value = val;
      this.emit('update', val);
    }
    return this;
  }

  function set(val){
    this.obj.setvalueof(val);
    this.emit('update', this);
    return this;
  }


  function on(evt, cb){
    var listeners = this.events[evt];
    if(!listeners){
      this.events[evt] = [];
      listeners = this.events[evt];
    }

    listeners.push(cb);
    return this;

  }

  function emit(evt, data){
    var listeners = this.events[evt];
    if( listeners ){
      listeners.forEach(callback);
    }

    return this;

    function callback(cb){
      cb(data);
    }
  }

  function addSub(){}
  function addObj(){}
}

function getTopPatcher(thisArg){
  var thisP = thisArg.patcher || thisArg;
  if( thisP.parentpatcher ){
    return getTopPatcher( thisP.parentpatcher );
  }else{
    return thisP;
  }
}


function pathToRoot(patcher){
  var path      =  [];
  var pathRoot  =  {};

  function walkPath(patcher){
    if(patcher.parent){
      path.push()
      return walkPath(patcher.parentpatcher);

    }else{
      return patcher;
    }
  }
}

      
function forEachIn(src, cb){
  for(var i in src){
    cb(src[i], i, src);
  }
  return src;
}
