/*
 组件的核心就是，只接受从外面传入的数据，组件内不写任何第三方业务数据和逻辑，只写自身的逻辑
 同时组件的交互效果，是通过组件内部的钩子来实现的，正常情况下，组件和外部的state是不联动的，
 如果需要联动数据或者action，那么就需要通过ReactRedux.connect方法来实现组件之间的数据联动；
 */
import React from 'react';

//组件不涉及ajax，都是拿到数据直接渲染
import styles from "./index.scss";//如果文件后缀是.scss?mc ， 表示打包的时候走px2rem插件打包，会把所有的px转成rem

//这个组件是纯react组件，不依赖于redux，完全和redux解耦；如果这个组件是类似container一样的和redux耦合的组件，那么可以给他添加static contextType = ReactRedux.ReactReduxContext;然后通过this.context.store来获取store
export default class StudyPlan extends React.Component {
    constructor(props) {
        super(props);
        this.clickItem=this.clickItem.bind(this);//在template中绑定，每次触发都会生成一个新的function，影响性能
    }

    clickItem(st){
        var innerInfo={};
        //...这里写点击时候的组件自身内部的UI变化效果
        this.props.callback(innerInfo);//调用回调函数，出来组件和外面其他组件的联动，也就是这个组件变化后，其他组件执行什么操作
    }

    render() {
        let {
            items,
            callback,
            studyPlanInfo
        } = this.props;

        //虽然下面通过store的方式获取数据，也能实现相同的功能，但还是用上面的props传入的方式较好，这样组件和store就解耦了
        // var state=store.getState();
        // let {
        //     items,
        //     studyPlanInfo
        // } = state;
        items=studyPlanInfo.items||[];

        return (
            <div className="root">
                <ul>
                    {
                        items.map((item, index) => {
                            return (
                                <li className="item" key={index} onClick={this.clickItem} >
                                    {item.name}:{item.age}
                                    年龄：{studyPlanInfo.age}
                                </li>
                            );
                        })
                    }
                </ul>
                <div>
                </div>
            </div>
        );
    }
}
