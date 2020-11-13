import React from 'react';
import ReactDOM from 'react-dom';
import { Input, Button, List } from 'antd'; // 引入antd组件库
import 'antd/dist/antd.css'; // 引入antd样式

// 1. 创建一个store管理仓库,从redux库中引入一个createStore函数
import { createStore } from 'redux';

// 2. 引入createStore后,store并没有创建,需要调用createStore()后才有store
// 创建好reducer后,需要将reducer作为参数传到createStore当中去,这样store才能拿到reducer的state数据
const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()); // createStore第二个参数添加这个redux-devtools的配置可以开启调试功能

// 3. 创建reducer函数,管理组件共享的数据状态以及一些动作
// reducer是一个纯函数,返回一个新的state给store
// 4. 初始化state值,将原先组件内部的状态的数据,移除到reducer里面去管理
function reducer(state = {
    inputValue: 'itclanCoder',
    list: ['itclanCoder', '川川', '学习Redux']
}, action){
    if(action.type === 'handle_Input_Change'){
        // 对原有的上一次的state做一次深拷贝,在Redux中,reducer不允许直接修改state
      // const newState = Object.assign({}, state);这个Object.assign()也是一个非常常用浅拷贝的方法,与下面的方法最终实现的效果是一致的,等价于下面的方法
      // 创建了一个newState完全复制了state,通过对newState的修改避免了对state的修改
        const newState = Object.assign({}, state);
        // const newState = JSON.parse(JSON.stringify(state));
        newState.inputValue = action.value; // 将新的value值赋值给newState
        return newState;
    }else if (action.type === 'submit_Input_Change') {
        const newState = JSON.parse(JSON.stringify(state));
        newState.list.push(action.value); // 将新的value值赋值给newState
        return newState;
    }
    return state;
}

// TodoList组件
class TodoList extends React.Component {
    constructor(props){
        super(props);
        // 组件内部的初始化状态数据
        // 5. 在组件内部通过getState()方法就可以拿到store里面的数据,该方法能够获取到store上存储的所有状态
        this.state = store.getState();
        // this环境的绑定
      this.handleInputChange = this.handleInputChange.bind(this);
      this.submitInputChange = this.submitInputChange.bind(this);
      this.handleStoreChange = this.handleStoreChange.bind(this);
      // 触发订阅,让store感知到state的变化
      store.subscribe(this.handleStoreChange); // 接收一个函数,重新获取store最新的数据,subscribe里面必须接收一个函数,会自动的调用this.handleStoreChange这个方法,保持store上的状态和this.state的同步,否则是会报错的,这个订阅函数放在componentWillMount或者componentDidMount生命周期函数内监听数据的变化,只要store状态发生了改变,那么就会调用这个handleStoreChange函数

    }
    // 组件卸载,移除时调用该函数,一般取消,清理已注册的订阅,定时器的清理,取消网络请求,在这里面操作
    componentWillMount(){
        store.unsubscribe(this.handleStoreChange);
    }
    render() {
        return (
            <div style={{ margin: "10px 0 0 10px"}}>
                    <div>
                        <Input onChange={this.handleInputChange} value={this.state.inputValue} style={{ width:"300px",marginRight:"10px"}}  placeholder="请输入内容..." />
                        <Button type="primary" onClick={() => this.submitInputChange(this.state.inputValue)}>提交</Button>
                    </div>
                    <List
                      style={{ width: '300px',marginTop:'10px'}}
                      bordered
                      dataSource={this.state.list}
                      renderItem={item => <List.Item>{item}</List.Item>}/>
            </div>
        )
    }
    handleInputChange(e){
        console.log(e.target.value);
        // 定义action,确定一个操作,动作,注意action必须遵循一定的规范,是一个对象,type字段是确定要做的动作,类型,监听表单输入框的变化,value是输入框的值
        const action = {
            type: 'handle_Input_Change', 
            value: e.target.value
        }
        store.dispatch(action); // 通过store派发dispatch一个action,只有这里接收一个action,Reducer里面才能对新旧数据进行计算等操作,改变store中状态的唯一方法就是派发action

    }
    submitInputChange(value){

        const action = {
            type: 'submit_Input_Change',
            value,
        }
        store.dispatch(action); // 通过store派发dispatch一个action,只有这里接收一个action,Reducer里面才能对新旧数据进行计算等操作,改变store中状态的唯一方法就是派发action

    }

    handleStoreChange(){
        console.log("handleStorechange,触发了");
        this.setState(store.getState()); // 触发setState重新获取store的数据,让input的数据与store保持同步了的
    }
}
const container = document.getElementById('root');

ReactDOM.render(<TodoList />, container);
