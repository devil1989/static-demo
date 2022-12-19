/*
 组件的核心就是，只接受从外面传入的数据，组件内不写任何第三方业务数据和逻辑，只写自身的逻辑
 同时组件的交互效果，是通过组件内部的钩子来实现的，正常情况下，组件和外部的state是不联动的，
 如果需要联动数据或者action，那么就需要通过ReactRedux.connect方法来实现组件之间的数据联动；
 */
import React from 'react';

//组件不涉及ajax，都是拿到数据直接渲染
import styles from "./index.scss";//如果文件后缀是.scss?mc ， 表示打包的时候走px2rem插件打包，会把所有的px转成rem

export default class StudyPlan extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="root">
                <ul>
                    <li></li>
                </ul>
                <div>
                </div>
            </div>
        );
    }
}
