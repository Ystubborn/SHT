export default class dynamicPlugIn {

    constructor(options){

    }


    onInitUiModel(args){
        return Promise.resolve(args);
    }

    onAfterLoadModelData(args){
        return Promise.resolve(args);
    }

    onMenuItemClick(args){
        return Promise.resolve(args);
    }

    onBeforeDoOperation(args){
        return Promise.resolve(args);
    }

    onAfterDoOperation(args){
        return Promise.resolve(args);
    }

    onCustomEvent(args){
        return Promise.resolve(args);
    }

    onRefresh(args){
        return Promise.resolve(args);
    }
}