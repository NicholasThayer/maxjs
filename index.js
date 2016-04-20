
/***

moving in the right direction, the tree crawler would look a bit better
if it was recursive.  if pushObjTst returned a nice structure ie.
{anan,[named[numbered]], patchers[...]} climb could take one or more
patchers as arguments and that would provide a nice way to kick things
off as well as allow tailcall optomization. Also, I shoudl take a look at 
that tree climber I wrote a while ago.  might be usefull.

also, check to see if the methods of max methods can be over ridden, 
that would be super rad.  even if it's just the "message" method



*/

var exports = (function() {

	var VDom = {
   build : build,
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

    var pModels = [];

    if( !patchers ){return;}
    if( !Array.isArray( patchers )){
      patchers = [patchers];
    }


    pModel = patchers.map(patchers2Models);
    return buildVNode(pModels);

    function patchers2Models(srcPatcher){
      srcPatcher.pModel = {};
      return _(srcPatcher.pModel)
      .assign(parsePatch(srcPatcher))
      .subPatchers;

      function parsePatch(src){
        var pModel = { 
          subPatchers: []
        }; 

        pModel.addMaxObj = addMaxObj.bind(pModel);

        src.apply(pModel.addMaxObj);

        return pModel;

        function addMaxObj(obj){
          // it might be faster to do this with batching
          // also the way key get's used is a bit contorted
          // helps with brevity 
          var name = parseName(obj.varname)
          var key = this[name[0]];
          var ind = parseInt( name[1] );

          if( obj.maxclass == ('patcher' || 'bpatcher')){
            this.subPatchers.push( obj );
          }

          if( !name ){
            return addAnon(obj)
          }

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
              name.split( /\[|\]/ );
            }
            return false;
          }

          function addAnon(obj){
            var key = 'anon_' + obj.maxclass
            var trg = this[key];
            if(trg){
              trg[key].push(obj);
            }else{
              this[key] = [];
              this[key].push(obj);
            }

          }

        }

      }

    }

  }

  return VDom;
  function build(){};
  function load(){};
  function store(){};
}());
