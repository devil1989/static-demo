//这个文件基本不用修改

import rootReducer from './reducer';
import * as Redux from 'redux';
import ReduxThunk from 'redux-thunk';//redux-thunk 或 redux-promise 这样支持异步的 middleware 都包装了 store 的 dispatch() 方法

const finalCreateStore = Redux.compose(

	/* 正常dispatch只支持对象类型的action，需要改变store的dispatch方法，让他支持function，在function里面执行ajax，
	   在ajax的callback中调用原生的dispatch方法 ：applyMiddleware+thunk来修改store的dispatch; */
    Redux.applyMiddleware(ReduxThunk)//类似koa里面的app.use()来添加中间件，这个Redux.applyMiddleware就是在action发起之后，reduce执行之前，执行里面的中间件；所以可以按照ReduxThunk来编写自己的redux的中间件
)(Redux.createStore);//Redux.createStore(预加载状态)的第二个参数必须与组合的reducer具有相同的对象结构,否则会警告；也就是finalCreateStore函数的第二个参数；这个值是初始化store的state的值

/* 为了满足store.dispatch执行后，自动执行对应reducer，需要有一个store和reducer的关联
	   这个关联是在创建store的时候就已经定制好了的，Redux.createStore(reducer,initialState);*/

export default function configureStore(initialState) {//传入初始state
    return finalCreateStore(rootReducer, initialState);
}
