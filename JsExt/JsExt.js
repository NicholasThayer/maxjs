/*
 * import and export functions should go here
 * weird shit with the startup flow... 
 * SEF's are executed from top to bottom, 
 * loadbangs from bottom to top! this leaves
 * the question as to where to put the global
 * build dom statement if exports can be visible on
 * the pModel.  
 * 


*/

function JsExt(thisArg){
  var id = 'JsExt'
  thisArg.import = importJS;
  var ext = {

  };

  function getTopLevel(patcher){
    if(patcher.parentpatcher){
      return getTopLevel(patcher.parentpatcher);
    }
    else{
      return patcher;
    }
  }

  function importJS( patcherPath ){
    /*
    this is a good idea works well for
    going down, the tree but not up
    switching it out for an import using the
    Global DOM

    */
    post('import!', this.id, '\n');
    var path = patcherPath.split(/\//);
    var patch = this.patcher;
    post('path', JSON.stringify(path), '\n');

    post('path[0]', JSON.stringify(
      patch.getnamed(path[0]), '\n'
    ));
    var data = path.reduce(reducer, this.patcher);
    this.module.children.push(data);
    return data;


    function reducer(prv, cur, ind, arr){
      post(prv, cur, ind, arr.length, '\n');
      post(
          'patch.getnamed',
          JSON.stringify(patch.getnamed(cur)), 
          '\n'
        );

      var curObj = prv.getnamed(cur);

      post(
          'patch.getnamed',
          JSON.stringify(patch.getnamed(cur)), 
          '\n'
        );

      if(arr[ind+1]){
        post('returning subP')
        return curObj.subpatcher();
      }else{
        return curObj.getvalueof();
      }
    }
  }

  return ext;
}

function inspect(obj){
  var toStr = JSON.stringify;
  var keys  = allKeys(obj);
  for (var i in keys){

    post(
      keys[i], 
      toStr(obj[keys[i]]) || 'x',
      '\n'
    );
  }
  for(var i in obj){
    post(i, toStr(obj[i]), '\n');
  }
  function allKeys(obj){
    var keys  = Object.keys;
    var proto = Object.getPrototypeOf;
    return keys(proto(obj));
  }

}
  


var console = (function() {
  /*
  this should def have it's own
  namespace
  */
  'use strict';
  var indent = '';
  var console = {

    log : function(){
      post(JSON.stringify(arguments, replacer))
    },
  }

  function replacer(val){
    for(var i in arguments){
      post(arguments[i].toString());
    }
    post(val.toString(), typeof val);
    if(typeof(val) == 'object'){
      post('grrrr obj')
      var vals = [];
      for(i in val){
        indent += '\t';
        vals.push( indent + i + ' : ' + JSON.stringify(val[i]), replacer );
        indent -= '\t';
      }
      return vals.join('\n');
    }else{
      return val;
    }
  }
  return console;
}());



function mergeDeep( a, b ){ 
  // this might go faster if clones were
  // 2d arrays 
  // also maybe put this in it's own namespace

  var getKeys  = Object.keys;
  var getProto = Object.getPrototypeOf;
  var getOwn   = Object.getOwnPropertyNames;

  var aC  = cloneFlat(a);
  var bC  = cloneFlat(b);

  var res = getOwn(aC).reduce( reducerAC, {} );

  return getOwn(bC).reduce( reducerBC, res );


  function cloneFlat( obj ){

    var proto = getProto(obj || {});

    var res   = getOwn(obj || {}).reduce(reducer,{});

    return getOwn(proto).reduce(reducerProto, res);


    function reducer(trg, key){
      //post('reducing', key, '\n');

      if(typeof obj[key] == 'function'){
        trg[key] = obj[key].bind(obj);
      }else{
        trg[key] = obj[key];
      }
      delete proto[key];
      return trg;
    }

    function reducerProto(trg, key){
      //post('reducing Proto', key, '\n');

      if(typeof obj[key] == 'function'){
        trg[key] = obj[key].bind(obj);
      }else{
        trg[key] = obj[key];
      }

      return trg;
    }

  }

  function reducerAC(trg, key){
    //post('reducingAC', key, '\n');

    trg[key] = aC[key];
    delete bC[key];
    
    return trg;

  }

  function reducerBC(trg, key){
    //post('reducingBC', key, '\n');
    trg[key] = bC[key];

    return trg;

  }

}
