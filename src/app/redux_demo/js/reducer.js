//页面中所有的reducer集合在一起，同时在这里，根据node后端的数据，生成各个组件的初始化state默认值
import { getActionTypes } from './action';
import * as Redux  from 'redux';
let actionTypes=getActionTypes();//所有actionType


//一旦dispatch，下面所有的function都会执行一遍，函数里面根据不同的actionTypes来执行不同的组件的操作
//rootReducer内的对象机构，和store的初始化的传入的state结构保持一致，否则会出现警告；同时rootReducer传入的函数的第一个参数必须有默认值，因为reduce初始化的时候需要有默认值
// reducer是纯函数【写纯函数，可以实现时间旅行、记录/回放或热加载等功能，如果不是纯函数，这些功能可能会出问题】！！！！！！！！！！！！！！！纯函数的概念：一个函数的返回结果只依赖其参数，并且执行过程中没有副作用。【幂等+不改变输入参数】
//reducer里面不要修改传入参数，不要调用ajax，不要调用非纯函数【这些都是副作用】【没有特殊情况、没有副作用，没有 API 请求、没有变量修改，单纯执行计算。】
const rootReducer = Redux.combineReducers({

	//studyPlanInfo的reduce，一个reduce单元,可以拆封到一个reduce文件夹中
	//一个reducer的function对应一个组件，一个组件可以有多个action，所以一个reducer中是个switch函数，按照action不同执行不同的state更新操作
	studyPlanInfo:function (state=null, action) {//每个action type都有各自的state数据，这个action对应的state，就是studyPlanInfo对应的state下的key;
	    switch (action.type) {
	        case actionTypes.ADD_ITEM:
	        	//纯函数，不能修改state，因为一旦修改state就会自动触发render；所以这里不用push，而用concat来返回最新的数组，这个数组来替换原来的state
	        	var rstItem=state.items.concat(action.data);//用空对象开头，就是为了不改变state
	        	return Object.assign({}, state, {items:rstItem});
	        case actionTypes.SET_AGE:
	        	return Object.assign({}, state, action.data);//用空对象开头，就是为了不改变state
	        	// 对象展开也可以：{ ...state, visibilityFilter: action.filter }
	        default:
	            return state;//这个很关键，异常未定义的action，返回原来的state
	    }
	},

	//所有dispatch都需要执行的state变化
	user: (state=null, action) => {
        return state;
    }
});

/*
在 Redux 中，对于 store state 的定义是通过组合 reducer 函数来得到的，也就是说 reducer 决定了最后的整个状态的数据结构
最终生成的state是各个reducer下的state集合
{
	studyPlanInfo：{solutions,items},
	user:20
}*/

export default rootReducer
