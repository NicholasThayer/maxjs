
/***

moving in the right direction, the tree crawler would look a bit better
if it was recursive.  if pushObjTst returned a nice structure ie.
{anan,[named[numbered]], patchers[...]} climb could take one or more
patchers as arguments and that would provide a nice way to kick things
off as well as allow tailcall optomization. Also, I shoudl take a look at 
that tree climber I wrote a while ago.  might be usefull.

also, check to see if the methods of max methods can be over ridden, 
that would be super rad.  even if it's just the "message" method

ughhhh so apply totally can't be used on a subpatcher! so using it to
recurse through the structure is definitely out

this might have to just add local coppies of VDom, this shit is bizzare

one option would be to insert a builder jsobject into each sub,
let it build the model, attach the model to the patcher, and attach the 
patcher to the dom.  Kinda nutz but it would allow a topdown flow

that 'patchers' are wrapped by Maxobj introduces a delema as to how
they should be stored.  Storing the unwrapped patcher totally breaks
with the native structure and it isn't absolutely necissary but it
means an aditional function call to .patcher whenver you want the 
actual subpatcher!... which means you would almost always be calling
something like patcher.patcher! Super ugly.  it also makes no sense in terms of a DOM... or in
JavaScript in general really.

The compromise position is to rebuild the Patcher proto, assigning
with something like:
//bind Maxobj functions
Object.getOwnProperties(srcPatcher).forEach(dstObj.bindFunc)
//bind patcher functions
Object.getOwnProperties(srcPatcher.subpatcher()).forEach(dstObj.bindFunc)

*/

var MaxDOM = (function() {

  var VDom = newModel();
  /*
    buildLocal : function(top){

      this.buildVNode(top);
      this.pModel = top.pModel;
      return this;
    },
    buildVNode: buildVNode,
    storeDOM : store,
    loadDOM  : load
  };

  /**
  * Build and append the VNode to target(s)
  * recursively itterating through the patch structure
  * @function
  * @param {Patcher} target - The Patcher being structured.
  */

  function buildVNode( patchers ){
    //post('#buildVNode arguments', arguments.toString(), arguments.length,'\n')

    var pModels;

    if( !patchers.length ){
      //post('#wrapping', patchers.toString(),'\n')
      patchers = [patchers];
    }else{
      //post('building')
      patchers = patchers[0];
    }
    //post('#maping', patchers.toString(),patchers.length, '\n')

    for(var i in patchers){
      //post('\t#wtf', i,patchers[i].toString(), '\n')
    }

    pModels = patchers.map(patchers2Models);

    if(pModels != 0){
      return buildVNode(pModels);
    }

    function patchers2Models(srcPatcher){
      if(!srcPatcher){return false};

      //post('#GRRRRR',srcPatcher.length,'\n')

      var models;

      srcPatcher.pModel = parsePatch(srcPatcher);
      models = srcPatcher.pModel.subPatchers;
      //post('#WAAAAA', models.toString(), models.length, '\n')
      if(models){
        return models;
      }

      function parsePatch(src){
        var pModel = src.pModel || newPModel();

        pModel.path = pModel.path  || 'root';
        pModel.addMaxObj = addMaxObj.bind(pModel);
        //post('#src.maxclass',src.toString(), src.maxclass,'\n')
        //post('src.maxclass', src.maxclass)
        //post('src.toString()', src.toString())
        //post(Object.getOwnPropertyNames(src))
        src.apply(pModel.addMaxObj);
        //post(JSON.stringify(pModel))

        return pModel;

        function addMaxObj(obj){
          
          /*
           * it might be faster to do this with batching
           * also the way key get's used is a bit contorted
           * helps with brevity tho
          */
          //post('obj.varname', parseName(obj.varname).toString,'\n')
          //post('obj.maxclass', obj.maxclass,'\n')

          var name = parseName(obj.varname);
          //post('#var name', name, '\n');

          if( obj.maxclass == ('patcher' || 'bpatcher')){
            //post('#parsing');
            //post(obj.subpatcher().toString());
            obj = Object.getOwnPropertyNames(obj).reduce.subpatcher();
            if(!obj.pModel){ obj.pModel = newPModel() };
            obj.path
            pModel.subPatchers.push(obj);
            //Object.getOwnPropertyNames(obj).map(function(val){post('\n\t', val,'\n')})
            //for(var i in obj){post('\n\t',i,JSON.stringify(obj[i]), '\n')}
            //parsePatch(obj);
          }

          if( !name ){
            //post('#if( !name )\n')
            addAnon(obj, this);
            return;
          }

          var key = this[name[0]];
          var ind = parseInt( name[1] );

          if(key){
            if(!Array.isArray(key)){
              tmp = key;
              key = [tmp];
              key[( ind || 0 )] = obj;
            }else{
              key[( ind || 0 )] = obj;
            }
          }else{
            if( ind ){
              key = [];
              key[ind] = obj;
            }else{
              key = obj;
            }
          }

          this[name[0]] = key;

          function parseName(name){

            if(name){
              return name.split( /\[|\]/ );
            }
            //post('parsing anon');
            name = [];
            name[0] = 'anon_' + obj.maxclass;
            name[1] = this[name[0]] ?
              this[name[0]].length : 0;

          }

          function addAnon(obj, trg){

            var key = 'anon_' + obj.maxclass
            if( trg[key] ){
              trg[key].push( obj );
            }else{
              trg[key] = [];
              trg[key].push(obj);
            }

          }
          function patchReducer(){

          }

        }

      }

    }

  }

  return VDom;
  function load(){}
  function store(){}

  function newModel(){

    return { 
      path       : '',
      parent     : {},
      events     : [],
      listeners  : [],
      subPatchers: [],
      addMaxObj  : addMaxObj.bind(this)
    }; 

  }

  function addMaxObj(obj){
    
    /*
     * it might be faster to do this with batching
     * also the way key get's used is a bit contorted
     * helps with brevity tho
    */
    //post('obj.varname', parseName(obj.varname).toString,'\n')
    //post('obj.maxclass', obj.maxclass,'\n')

    var name = parseName(obj.varname);
    //post('#var name', name, '\n');

    if( obj.maxclass == ('patcher' || 'bpatcher')){
      //post('#parsing');
      //post(obj.subpatcher().toString());

      obj = obj.subpatcher();
      if(!obj.pModel){ obj.pModel = newPModel() };
      obj.path = this.path +'/'+name
      pModel.subPatchers.push(obj);
      //Object.getOwnPropertyNames(obj).map(function(val){post('\n\t', val,'\n')})
      //for(var i in obj){post('\n\t',i,JSON.stringify(obj[i]), '\n')}
      //parsePatch(obj);
    }

    if( !name ){
      //post('#if( !name )\n')
      addAnon(obj, this);
      return;
    }

    var key = this[name[0]];
    var ind = parseInt( name[1] );

    if(key){
      if(!Array.isArray(key)){
        //tmp = key;
        key = [tmp];
        key[( ind || 0 )] = obj;
      }else{
        key[( ind || 0 )] = obj;
      }

    }else{
      if( ind ){
        key = [];
        key[ind] = obj;
      }else{
        key = obj;
      }

    }

    this[name[0]] = key;

    function parseName(name){

      if(name){
        return name.split( /\[|\]/ );
      }
      //post('parsing anon');
      name = [];
      name[0] = 'anon_' + obj.maxclass;
      name[1] = this[name[0]] ?
        this[name[0]].length : 0;

    }

    function addAnon(obj, trg){

      var key = 'anon_' + obj.maxclass
      if( trg[key] ){
        trg[key].push( obj );
      }else{
        trg[key] = [];
        trg[key].push(obj);
      }

    }

  }

}());