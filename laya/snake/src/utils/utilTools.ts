//class utilTools {
    function handler(obj,method){
        return function (data) {
        return method.call(obj, data);
    };
    }
    
    let syncData:any[] =[]
// }