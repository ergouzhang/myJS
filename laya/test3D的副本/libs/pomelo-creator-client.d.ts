/**
 * Created by Bob Jiang on 2015/4/23.
 */

declare class Pomelo {
    init(params:any, cb: (response:any)=>void):void;

    request(route:string, msg:any, cb: (response:any)=>void):void;
    notify(route:string, msg:any):void;

    emit(event: string, data?: any): void;

    on(route:string, cb: (response:any)=>void):void;
    once(route:string, cb: (response:any)=>void):void;

    off(route?:string, cb?: (response:any)=>void):void;
    removeListener(route?:string, cb?: (response:any)=>void):void;
    removeEventListener(route?:string, cb?: (response:any)=>void):void;

    listeners(event: string): any[];
    hasListeners(event: string): boolean;


    disconnect();
}
declare var pomelo: Pomelo;
