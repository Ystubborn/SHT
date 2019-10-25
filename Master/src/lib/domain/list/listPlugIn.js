import dynamicPlugIn from '../dynamicPlugIn';

export default class listPlugIn extends dynamicPlugIn{
    constructor(options){
        super(options);
    }

    onListInitialized(args){
        return Promise.resolve(args);
    }
}