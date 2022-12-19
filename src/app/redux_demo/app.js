// // 基本不用动
import React from 'react';
import * as ReactRedux from 'react-redux';
import * as ReactDOM from 'react-dom';
import 'redux-module';
import configStore from './js/store';//store的工厂函数，传入对象以初始化store
import Container from './js/container';
import {InitialState} from "./js/state.js";
const Provider=ReactRedux.Provider;//源码里面用了自定义组件，组件的render里面用了React.createContext('null')，并且把store赋值给了这个组件的state；然后把state赋值给了createContext产生的元素的value，因此所有子组件通过this.context来访问这个store
var store=configStore(InitialState);

//ReactRedux.Provider的原理是React的context特性，就是只要用const ComponentA = React.createContext('light')创建组件 ,然后用<ComponentA.Provider key={value}>...中间放子组件...</ComponentA.Provider>
//然后给子组件设置“子组件”.contextType=ComponentA ，然后所有的子组件中，都可以通过this.context[属性名]来获取传入的值，并且修改这个传入的属性，如果子组件用到了这个属性，就会自动重新render
//redux的Provider就是用React的Context这个功能，来实现所有子组件对store的访问。 https://react.docschina.org/docs/context.html
//Provider组件内写入Container组件，就是用了React的嵌套【就是等价于Vue的v-slot功能，只是React中只要用{this.props.children}就可以实现组件的嵌套】
ReactDOM.render(
    <Provider store={store} >
		<Container />
	</Provider>,
    document.getElementById("root")
);



//
/*
	1.Redux.combineReducers:组合所有reducer，里面会执行一遍所有reducer，reducer的actionType为undefined：这个用于初始化每个reducer的state；最终返回一个function类型的rootReducer
	2.Redux.compose和Redux.applyMiddleware封装store,用封装好的store来绑定rootReducer，最终实现store和reducer的绑定；//store.js中
	3.执行ReactRedux.connect ：绑定mapStateToProps和mapDispatchToProps方法绑定到Container组件，在组建执行render的过程中执行这两个函数
	4.执行react的render函数，render函数中会执行mapStateToProps和mapDispatchToProps这两个函数，实现store中的各个组件的数据绑定到Container组件的props上去
	5.生命周期：componentWillMount，componentDidMount，ShouldComponentUpdate，componentWillReceiveProps，componentWillUpdate，componentDidUpdate，componentWillUnmount

	备注：store中的每一个属性对应一个reducer，但是store.dispatch的时候会执行所有的reducer，每个reducer中有多个actionType，更加不同的actionType来执行不同的state变更
	1.store.dispatch({
		type:"fds",
		data:"fds"
	});
	2.自动执行到reducer，如果用了Redux.combineReducers，那么里面所有的函数都会执行一遍，每一个函数名称代表state的一个属性，根据actionType来判断执行那个state变更
	3.state变更导致UI更新
*/