//多个组件组合成一个Container组件
import React ,{lazy,Suspense} from 'react';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import StudyPlan from '../components/plan';
import PropTypes from "prop-types";//用于定义数据类型，很重要，是必须的
import {getStudyPlanList,setAge} from './action';
import style from '../app.scss';

// react-router也可以实现异步，它是开发单页面程序的时候，用于页面的异步加载；我用下面的方式，也可以实现类似的效果

//webpack的import是promise，异步的包;vue的异步组件和react的异步组件都是用webpack的import来实现，只是vue中放在component下；而react用React.lazy
//lazy只支持export default的对应的
var AsyncComponent=lazy(() => import('../components/async-plan'));



class Container extends React.Component {

    /*  挂载DOM【当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下】：
            constructor()：处理this.state和事件的绑定【同时要特别注意，不要把props赋值给state】
            static getDerivedStateFromProps()：只监控props，让组件在 props 变化时更新 state，它能获得props和state，并且在update和首次渲染都会在render之前调用，
                                                返回state或null【null表示更新state】，它无法访问组件实例【因为static】；这个功能要保守使用！！！！！！！！！！

            render()：应该是个“纯函数”，只是渲染，传入数据相同，就输出相同界面【一个初始渲染的界面】
            componentDidMount()：元素插入DOM之后触发，这里放请求网络数据【页面初始化数据，比如ajax请求等】；所以在这个函数里面设置了state，那么就会再次触发render，
                                 所以render函数一般是会执行2次，第一次是默认；第二次就是在ajax请求获取到初始化数据后，触发自动的update，里面就包含了render函数的再次执行
                                 想要让render执行一次，那么就不要在componentDidMount再去请求ajax获取初始数据，而是在react创建之前就请求ajax数据，然后在constructor内就传入初始化的数据给state
        
        
        更新DOM【修改state或props时候】：
            static getDerivedStateFromProps()：只监控props，
            shouldComponentUpdate()：state或props修改后，这里判断时候需要进行更新dom，默认是返回true，这里是自定义设置哪些state和props修改后不需要更新【就是不执行后面的render以及componentDidUpdate】
                                     首次渲染或使用 forceUpdate() 时不会调用该方法；推荐使用PureComponent来自动对比，而不是手动比较
            render()：纯函数
            getSnapshotBeforeUpdate()：很少用到，一般对于界面的滚动等UI变化的时候，获取DOM的UI位置
            componentDidUpdate()：数据更新后才触发【首次挂载dom渲染不触发】，这里不可以修改state或props，因为一旦设置了state，优惠重新触发一遍新的shouldComponentUpdate>render>componentDidUpdate
                                  如果非要在这里改变state或props，必须加上条件语句，否则进入死循环无限调用。

        
        卸载DOM：
            componentWillUnmount()：卸载DOM之前调用，取消计数器，中止网络请求，解绑事件订阅等

        
        错误捕获【当渲染过程，生命周期，或子组件的构造函数中抛出错误时，会调用如下方法】
            static getDerivedStateFromError()
            componentDidCatch(error, info)：错误捕获


        
        不推荐使用的方法【因为后续将要过时，React17还可以用，但是之后的版本就不适用了】：！！！！！！！！！！
            componentWillMount() ： 挂载DOM行为，“constructor之后，render之前”；用constrctor代替
            componentWillUpdate() ：更新DOM行为，“shouldComponentUpdate之后，render之前”；逻辑放到getSnapshotBeforeUpdate和componentDidUpdate中
            componentWillReceiveProps()：和getDerivedStateFromProps类似【挂载和数据更新会执行该方法】，同时父组件更新的时候，即使子组件的props没有更新，也会执行该方法，
                                         但是使用componentWillReceiveProps经常会出现bug，尤其是把props属性赋值给state的场景下
                                         这个函数对于props的变化判断，可以通过memoization来实现：https://react.docschina.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization

*/
    static contextType = ReactRedux.ReactReduxContext;//这个千万别忘了添加，否则是无法从this.context中获取到store的，this.context.store就是provider中传入的store；ReactReduxContext就是源码中react.createContext返回的值

    constructor(props,context) {
        super(props,context);
        this.handleClick=this.handleClick.bind(this);//在template中绑定this，每次触发都会生成一个新的function，影响性能
        this.planCallback=this.planCallback.bind(this);
    }

    componentWillMount(){
    }

    componentDidMount() {
    }

    componentWillReceiveProps(){//props或state修改的收执行

    }
    
    componentWillUpdate(){//props或state修改的收执行

    }

    handleClick() {
        this.context.store.dispatch(setAge(20));//同步的action
    }

    planCallback(e){
        this.context.store.dispatch(getStudyPlanList({param:5}));//异步的action，
    }

    render() {//正常的组件内部，不应该出现store，因为组件和store不能耦合，他们之间的关系，需要在 ReactRedux.connect里面做数据转化
        var opts=this.props;//这个props是从ReactRedux.connect传递过来的，ReactRedux.connect主要用于组件和redux的解耦，把store中的state和action creater函数绑定到组件的props上
        var store=this.context.store;//如果不想要组件和redux解构的话，也可以不用ReactRedux.connect；而是直接在组件中添加static contextType = ReactRedux.ReactReduxContext;然后就可以通过this.context.store来获取store
        var state=store.getState();
        return (
            <div onClick={this.handleClick} >
                <Suspense fallback={<div>Loading...</div>}>
                    <AsyncComponent />
                </Suspense>
                <StudyPlan {...opts} callback={this.planCallback} />
            </div>
        );
    }
}

//


/******************************************组件和redux的关联：start*************************************************/
//组件和redux关联，可以通过store.subscribe(function(){...})来实现，监听函数在props或者state修改的时候，就会执行，是全局的监听
//不给过最好是通过ReactRedux.connect来实现组件和redux的数据绑定，这样可以把组件的逻辑和redux的逻辑解耦，这个connect知识做了数据转化，也就是“组件的props和state数据”与“redux中的state数据”做一一对应
//因为组件是组件，有自己的props，不依赖于redux的store的数据结构，组件只靠自己传入的props进行渲染，传入固定的props，就能产生固定的UI
//使用connect，你就不必为了性能而手动实现 React 性能优化建议 中的 shouldComponentUpdate 方法。
//connect是用来解耦的，redux的Provider来实现所有组件对store共享访问


// 将 store 中的state数据映射到组件的props上；
function mapStateToProps(state,props) {
    // var studyPlanInfo=state.studyPlanInfo;
    // return {
    //     studyPlanInfo:studyPlanInfo//每个组件都是state中的一个属性,把组件中state属性，映射到到store中的各个属性
    // };
    // return {}
    return JSON.parse(JSON.stringify(state));//把state的所有属性全部map到props上去；其实真正用的时候没必要这么用，因为当前的组件只是用到了store中的部分属性而已
}

// React-Redux会自动将function类型的action映射到组件的props上 ！！！！！！！！！！！
function mapDispatchToProps(dispatch,props) {
    // return {
    //     actions: Redux.bindActionCreators(getStudyPlanList, dispatch)
    // }

    return Redux.bindActionCreators({//把多个action creater函数绑定到dispatch上！！！！！！！
        getStudyPlanList//
    }, dispatch);
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Container);//使用ReactRedux.connect(mapStateToProps, mapDispatchToProps)主要是为了组件和store的解耦，因为组件内部的属性不一定是store的数据结构


// ReactRedux.connect(arg1,arg2,arg3,arg4)(组件类)
    //arg1将 store 中的数据作为 props 绑定到组件上
    //arg2将 action 作为 props 绑定到组件上。
    //arg3用于自定义merge流程，将stateProps 和 dispatchProps merge 到parentProps之后赋给组件。通常情况下，你可以不传这个参数，connect会使用 Object.assign。
    //arg4 如果指定这个参数，可以定制 connector 的行为。一般不用。



/******************************************组件和redux的关联：end*************************************************/



