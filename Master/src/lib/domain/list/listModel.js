import dynamicModel from '../dynamicModel';

const listModel=function()
{
    var data=dynamicModel();
    data.formCtx=data.formCtx ||{};
    data.formCtx.domainType='list';
    data.uiData={
        listData:[],
        listDesc:{
            // 累计页数
            pages:0,
            // 每页记录数
            pageSize:10,
            // 所有分录数
            records:0,
            // 表单张数
            bills:0
        },
    },
    
    data.query={
        // 页号
        pageIndex:1,
        // 每页记录数
        pageCount:10,
        // 过滤条件
        filterString:'',
        // 对象化的过滤条件：字段标识，比较符号，比较值
        whereString:[

        ],
        // 动态过滤条件
        dynamicParam:{

        },
        selectFields: [],
        // 排序条件
        orderByString:''
    };

    return data;
};

export default listModel;