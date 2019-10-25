// author: linus
// desc:动态表单组件控制器
import dynamicHandler from './dynamicHandler';
import dynamicModel from './dynamicModel';


const data = 
{
  data : dynamicModel,

  //computed: ,

  methods: dynamicHandler ,

  created() {      
    var self=this;
    this.formCtx.formId=this.$options.formId;    
    
    this.initUiModel({})
      .then(data=>{
        var modelData={
          status:'query',
          uiData:self.uiData||{},
        };

        if(self.formCtx.domainType==='bill'){
          if(self.uiData.id){
            modelData.status='view';
          }
          else{
            modelData.status='new';
          }
        }
        this.afterLoadModelData(modelData);
        return Promise.resolve(data);
      })
      .catch(error=>{
        Promise.reject(error);
      });
      
    this.$eventbus.$on('onRefresh',function(args){
      self.invokePlugIn('refresh',args);
    });
  },
  mounted () {
    var self=this;
    
      
  },   
  updated(){
    
  },

  components: {},

  dependencies :['ops'],

  plugs:[]
};

export default data;