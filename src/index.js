const NOPROMISE_HOC='nopromise-hoc';
//if you use hoc, whenver oneCall is finished, it will call callback(ret, obj)
const hoc = (func, obj=null, callback=()=>{})=>{
    if(typeof func !== 'function') throw new Error('1st argument of hoc must be function');
    if(typeof callback !== 'function') throw new Error('3st argument of hoc must be function');
    return {
        type: NOPROMISE_HOC,
        func,
        obj,
        callback
    }
}

//without using promise, make chaincall like promise
const chainCallNp = (initArg, ...chainCall)=>{
    //args will be a chaincall of functions
    let ret;
    const total = chainCall.map(call=>{
        if(typeof call === 'function'){
            ret = call(initArg);
        }else if(typeof call === 'object' && call.type === NOPROMISE_HOC){
            ret = call.func(initArg);
            call.callback(ret, call.obj);
        }else{
            throw new Error('please use right hoc() function to create hoc object.');
        }
        if(typeof ret==='object' && typeof ret.then === 'function'){
            throw new Error('Please do not use async function for one of the chainCall: the call is '+call);
        }
        initArg = ret;
        return ret;
    });
    return total[total.length-1];//return the last result
}

const chainCall = (initArg, ...chainCall)=>{
    return new Promise((resolve, reject)=>{
        try{
            resolve(chainCallNp(initArg, ...chainCall));//return the last result
        }catch(e){
            reject(e);
        }
    });
};


module.exports = {chainCall, chainCallNp, hoc};