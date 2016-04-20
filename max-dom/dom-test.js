
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
means an aditional function call to .subpatcher() whenver you want the 
actual subpatcher!... which means you would almost always be calling
.subpatcher().  it also makes no sense in terms of a DOM... or in
JavaScript in general really.

The compromise position is to rebuild the Patcher proto, assigning
with something like:
//bind Maxobj functions
Object.getOwnProperties(srcPatcher).forEach(dstObj.bindFunc)
//bind patcher functions
Object.getOwnProperties(srcPatcher.subpatcher()).forEach(dstObj.bindFunc)


*/

var exports = (function() {

  var VDom = {
    pModel:{},
    build : function(top){
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
    var pModels;
    post('#buildVNode arguments', arguments.toString(), arguments.length,'\n')
    if( !patchers.length ){
      post('#wrapping', patchers.toString(),'\n')
      patchers = [patchers];
    }else{
      post('building')
      patchers = patchers[0];
    }
    post('#maping', patchers.toString(),patchers.length, '\n')
    for(var i in patchers){
      post('\t#wtf', i,patchers[i].toString(), '\n')
    }
    pModels = patchers.map(patchers2Models);
    if(pModels != 0){
      return buildVNode(pModels);
    }

    function patchers2Models(srcPatcher){
      if(!srcPatcher){return false};

      post('#GRRRRR',srcPatcher.length,'\n')

      var models;

      srcPatcher.pModel = parsePatch(srcPatcher);
      models = srcPatcher.pModel.subPatchers;
      post('#WAAAAA', models.toString(), models.length, '\n')
      if(models){
        return models;
      }

      function parsePatch(src){
        var pModel = { 
          subPatchers: [],
        }; 

        pModel.addMaxObj = addMaxObj.bind(pModel);
        //post('#src.maxclass',src.toString(), src.maxclass,'\n')
        post('src.maxclass', src.maxclass)
        post('src.toString()', src.toString())
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
          post('obj.maxclass', obj.maxclass,'\n')
          var name = parseName(obj.varname)

          post('#var name', name, '\n');
          if( obj.maxclass == ('patcher' || 'bpatcher')){
            post('#parsing');
            post(obj.subpatcher().toString());
            if(!obj.pModel){ obj.pModel = {} };
            obj = obj.subpatcher();
            pModel.subPatchers.push(obj);
            //Object.getOwnPropertyNames(obj).map(function(val){post('\n\t', val,'\n')})
            //for(var i in obj){post('\n\t',i,JSON.stringify(obj[i]), '\n')}
            //parsePatch(obj);
          }

          if( !name ){
            post('#if( !name )\n')
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
            post('parsing anon');
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

      }

    }

  }

  return VDom;
  function load(){};
  function store(){};
}());
var t2 = 0;
var t1 = Date.now();
var dom = exports.build(this.patcher).pModel;
var t2 = Date.now();


var strer = _.toString;

post('build time', t2 - t1, '\n');

for(i in dom){
  post('dom', i, dom[i].toString(), '\n')
}
var wut1 = dom.wut1
for(i in wut1){
  post('wut1', i, _.toString(wut1[i]), '\n')
}
post('mObjProps:\n');
var mObjProps = Object.getOwnPropertyNames(this.patcher.getnamed('wut1'));
post('mObjProps' , mObjProps.length);

var pObjProps = Object.getOwnPropertyNames(
    this.patcher.getnamed('wut1').subpatcher());
post('pObjProps' , mObjProps.length);

var U = _.union(mObjProps, pObjProps)
post('U')
for(var i in U){post('\n\tU:', i, U[i])}


post('mObjProps' , mObjProps.length);  
post('pObjProps' , mObjProps.length);
post('U', U.length);

/*
var t = 0;
var v = 0;
var arr1 = {};
var arr2 = [];

var dump1 = {};
var dump2 = [];

t = Date.now();
for (var i = 99999; i >= 0; i--){
  arr1[i]=i;
}
v = Date.now();

//post('objin T', v - t,'\n');
//console.log('objin T', v - t,'\n');

t = 0;
v = 0;

t = Date.now();
for (var i = 99999; i >= 0; i--){
  arr2[i] = i;
}
v = Date.now();
//post('arrin T', v - t,'\n');
//console.log('arrin T', v - t,'\n');

t = 0;
v = 0;

t = Date.now();
for (var i = 99999; i >= 0; i--){
  dump1[i]=arr1[i];
  dump2[i]=arr1[i];
}
v = Date.now();
//post('objout T', v - t,'\n');
//console.log('objout T', v - t,'\n');

dump1 = {};
dump2 = [];

t = Date.now();
for (var i = 99999; i >= 0; i--){
  dump1[i]=arr2[i];
  dump2[i]=arr2[i];
}
v = Date.now();
//post('arrout T', v - t,'\n');
//console.log('arrout T', v - t,'\n');

dump1 = {};
dump2 = [];
t = Date.now();
for (var i = 99999; i >= 0; i--){
  dump1[i]=arr2[arr1[i]];
  dump2[i]=arr2[arr1[i]];
}
v = Date.now();

//post('indexing combo T', v - t,'\n');
//console.log('indexing combo T', v - t,'\n');

function push1(i){ dump1[i] = i; return i; }
function push2(i){ dump2.push(i); return i; }

dump1 = {};
dump2 = [];

t = Date.now();

_(arr2).map(push1).map(push2).value();

v = Date.now();
//post('lodash arr2 Out T', v - t,'\n');
//console.log('indexOf T', v - t,'\n');

dump1 = {};
dump2 = [];

t = Date.now();

_(arr1).map(push1).map(push2).value();

v = Date.now();
//post('lodash arr1 Out T', v - t,'\n');
//console.log('indexOf T', v - t,'\n');

dump1 = {};
dump2 = [];

t = Date.now();

arr2.map(push1).map(push2);

v = Date.now();
//post('lodash arr2 Out T', v - t,'\n');
//console.log('indexOf T', v - t,'\n');


//
//'use strict';

/*
var id = 'wut';
var huh = 'duh';
function things(eh){
  //post(JSON.stringify(this));
}

var moduleName = (function() {
  //post(JSON.stringify(this));
  var moduleName = {
    init: {
      
    }
  };
  return moduleName;
}());

/*
var patch = this.patcher;
var window = patch.wind;

function replacer(key, value) {
  if (typeof value == "object") {
    return JSON.stringify(value);
  }
  if (value == "function") {return "function";}
  return value;
}

//post('this.patcher');
//post(Object.getOwnPropertyNames(patch).map(function(p){
  //post('\n\t','this.patcher','own:', JSON.stringify(p,replacer), JSON.stringify(patch[p]))//,replacer));
  return p;
}).length);

for(var i in patch){
  //post('\n\t','this.patcher','keys:', i, JSON.stringify(patch[i],replacer));
}

//post(' ');
//post('\n', 'this.winodw:', '\n');
//post(Object.getOwnPropertyNames(window).map(function(p){
  //post('\n\t','this.window','own:', JSON.stringify(p,replacer), JSON.stringify(window[p],replacer));
  return p;
}).length);

for(var i in window){
  //post('\n\t','this.window','keys:', i, JSON.stringify(window[i],replacer));
}


//post(' ');
//post('\n', 'objs:', '\n');
patch.apply(function(obj){
  var type = obj.maxclass;
  //post('\n',type);
  //post('\n\t',type,'own:')
  //post(obj.maxclass,'\n', Object.getOwnPropertyNames(obj).map(function(p){
    //post('\n\t',type,'own:', JSON.stringify(p,replacer), JSON.stringify(obj[p],replacer));
    return p;
    }).length
  );
  //post('\n\t',type,'keys:');
  for(var i in obj){
    //post('\n\t',type,'keys:', i, JSON.stringify(obj[i],replacer));
  }

})
function stuff(){//post('yay')}

//post(stuff.toString())
var arr = [{x:'x'},{x:'x'},{x:'x'}];
arr.forEach(function(n){//post(n.x[0])});

/*
var a, b, rest;//

({a, b} = {a:1, b:2})
//post(a) // 1
//post(b) // 2

function test(){
  if(Array.prototype.copyWithin){
    //post('YAY!!!!');
  }else{
    //post('boo!!!');
  }
}

/*
var andReps = 0,
  ifReps = 0,
  ternReps = 0;
    
(function(){
  var arr = test();
  andReps += arr[0];
  ifReps += arr[1];
  ternReps += arr[2];

  arr = test();
  andReps += arr[0];
  andReps = andReps/2
  ifReps += arr[1];
  ifReps = ifReps/2
  ternReps += arr[2];
  ternReps = ternReps/2


  arr = test();
  andReps += arr[0];
  andReps = andReps/2
  ifReps += arr[1];
  ifReps = ifReps/2
  ternReps += arr[2];
  ternReps = ternReps/2


  arr = test();
  andReps += arr[0];
  andReps = andReps/2
  ifReps += arr[1];
  ifReps = ifReps/2
  ternReps += arr[2];
  ternReps = ternReps/2

  console.log('\nfinal:\n', 
    'andReps:', andReps, '\n', 
    'ifReps:', ifReps, '\n',
    'ternReps:', ternReps, '\n')

}())

function test(){
  var arr = new Array(128);
  var cache = onTrue();
  var andReps = 0;
  var ifReps = 0;
  var ternReps = 0;
  var t = 0;
  var v = 0;
  var n = 0;
  var x = 0;
  random = Math.random;
  round = Math.round;

  for (var i = 63; i < 127; i++){
    arr[i] = i;
  }

  
  t = Date.now();

  while (n < 900000){
    x+= testAnd(round(random()*127));
    n++;
  }

  v = Date.now();

  console.log('andReps:', v - t, '\n')

  andReps = v - t;

  n = 0;
  x = 0;
  t = Date.now();

  while (n < 900000){
    x+= testIf(round(random()*127));
    n++;
  }

  v = Date.now();

  console.log('ifReps:', v - t, '\n');


  ifReps = v - t;

  n = 0;
  x = 0;
  t = Date.now();

  while (n < 900000){
    x+= testIf(round(random()*127));
    n++;
  }

  v = Date.now();

  console.log('ternReps:', v - t, '\n');


  ternReps = v - t;

  return [andReps, ifReps, ternReps];

  function testAnd(ind){
    return arr[ind] && onTrue() || false;
  }

  function testIf(ind){
    if(arr[ind]){
      return onTrue();
    }else{
      return false;
    }
  }

  function testTern(ind){
    return arr[ind] ? onTrue() : false;
  }

  function onTrue(){
    return true;
  }
}



/*post(
    _([1,2,3]).map(function(a, b, c){
      return ['a'+a,'b'+b,'c'+c];
    }).toString());
//test();

function test(){
  //post('testing:')
  test_map();
}
function test_map(){
  //var map = _.map;
  //post(
    _([1,2,3]).map(function(a, b, c){
      return ['a'+a,'b'+b,'c'+c];
    }).toString());
}*/