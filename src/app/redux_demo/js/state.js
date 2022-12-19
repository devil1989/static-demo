//这里放所有组件的初始化数
//如果要做一个历史回访功能，那么就需要给state设置对应的具有回放功能的state，说白了，就是把上一步，上上步的state都保存下来，点击回放的收，直接用上一步的state来替换当前的state，例如{past:{},current:{},future:{}}
// state 的结构和组织方式通常会称为 "shape"。在你组织 reducer 的逻辑时，state 的 shape 通常扮演一个重要的角色。
const InitialState=window.INITIAL_STATE||{
    //每一个字段代表一个组件或一个react展示模块
    studyPlanInfo:{
        age:0,
        solutions:{},
        items:[{name:"jeffrey",className:"root"},{name:"jeffrey1",className:"root"}]
    },
    user:{}
};

export {InitialState};