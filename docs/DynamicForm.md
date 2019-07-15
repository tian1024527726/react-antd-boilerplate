### DynamicForm 动态表单 -- wxg



封装了antd的表单的组件。
旨在更快速、方便的使用表单。
因为antd的表单很难用。
建议在使用此组件之前，先看antd中的form组件的使用以及文档。

#### 用法

````
<DynamicForm
	className='form-class'
	formFields={listForm}
	fieldsConfig={listFormConfig}
	formItemLayout= {{span: 12}}
	gutter={10}
	wrappedComponentRef={dy => (this.dynamicForm = dy)}
	onChange={this.listFormUpdate}
	layout={DynamicForm.LAYOUT.INLINE}
>
	<Button onClick={submit}>提交</Button>
</DynamicForm>
````

##### props

###### formFields 表单属性

例如: 
````
{
	name: 'tom',
	sex: 'male'
	age: '23',
}
````

说明：上面的数据都是业务属性，以及属性对应的值。第一次传入的可以是默认值。


###### fieldsConfig 表单配置

使用fieldsConfig需要借助工具来生成相应的配置
1，引入工具方法
````
import { createInputFactory as CIF } from 'DynamicForm'
````

2，生成配置: 
````
{
	name: CIF('姓名'), // text input 是默认的
	sex: CIF('性别').isRadio([ // radio input
		{
			text: '男', 
			value: 'male',
		},
		{
			text: '女', 
			value: 'female',
		},
	]),
	age: CIF('年龄').isRequired(), // 必填项
}
````
注意：
以上是创建fieldsConfig的基本方式，值得说明的是，input元素显示的排序是根据formFields中属性对应的顺序来创建的。
formFields和fieldsConfig是相互对应的，formFields中保存的是表单属性对应的值，fieldsConfig中保存的是表单属性对应的表单配置。


###### formItemLayout 表单元素布局

例如: 
````
{
	span: 12
}
````

说明：一行一共有24个格子，span设置为12表示，一个表单元素占位半行，就是两列表单，三列就是 24/3，四列是 24/4等默认值是24/1


###### gutter 表单元素布局 number

例如: 
````
10
````

说明：当表单为多列的时候，gutter表示各个列之间的间距。



###### wrappedComponentRef 获取form表单组件实例

使用方式同ref，因为在dynamicForm外层会被antd的form.create()方法包裹一层，所以使用ref是获取不到真实的form实例的，需要使用wrappedComponentRef


###### onChange 表单元素改变回调

说明：onChange回调的参数
````
{
	name: 'age', // 表单属性名
	value: 12, // 表单属性名对应的修改后的值
}
````

###### layout 表单布局

表单布局有三种:
水平布局:DynamicForm.LAYOUT.HORIZONTAL
![](./images/dynamicForm-2.png)

垂直布局:DynamicForm.LAYOUT.VERTICAL
![](./images/dynamicForm-1.png)

// 行内布局
DynamicForm.LAYOUT.INLINE
![](./images/dynamicForm-3.png)




##### 内置方法

````
this.dynamicForm.setFieldsValue({name: 'teddy'}); // 将姓名表单的值设置为‘teddy’
this.dynamicForm.getFieldsValue(); // 获取当前表单所有元素的值
this.dynamicForm.validateFieldsAndScroll(callback); // 执行表单校验
this.dynamicForm.resetFields(); // 重置表单（如果，你想清空表单的数据，还要在调用此方法之前，清空你的数据）


````

##### createInputFactory(CIF) 文档

````
CIF(arg: string | InputFactory | InputFactory.getInput()) // 构造函数，传入表单对应的label值、InputFactory对象、InputFactory的input配置

CIF(arg).fieldOption(option:object) // getFieldDecorator()的第二个参数

CIF(arg).rule(aRule:object) // 设置校验规则，参数格式可以参考antd from中的rule格式

CIF(arg).prop(option: object) // 为表单元素设置属性比如为input设置一个class:{className: 'my-class'}

CIF(arg).itemProp(option: object) // 为表单元素外层的FormItem设置的属性
CIF(arg).itemProp({
	labelCol: { // label所占用的栅格
		span: 12,
		xs: 12,
		...
	},
	wrapperCol: { // input所占用的栅格
		span: 12,
		xs: 12,
		...
	}
}) // 为表单元素外层的FormItem设置布局，参数同官网

CIF(arg).label(label: string) // 表单label名字
CIF(arg).trigger(type: ['onChange', 'onBlue']) // 表单校验的时机
CIF(arg).isDisable() // 将此表单置为失效
CIF(arg).isEnable() // 将此表单置为有效
CIF(arg).isRequired(message:string) // 将此表单置为必填，message是错误提示信息。
CIF(arg).isNotRequired() // 将此表单置为非必填
CIF(arg).layout({
	xs: 24,
	sm: 24,
	md: 24,
	lg: 12,
	xl: 12,
	xxl: 6
}) // 设置此表单的布局
CIF(arg).ph(placeholder:string) // 设置placeholder
CIF(arg).validator(validator:function) // 设置表单的校验方法,校验方法有规范，可以参见antd官方文档，或者DynamicForm/validators.js中的demo

CIF(arg).on(ListenerName: string, listener:function) // 设置表单的监听事件，例如：CIF(arg).on('Click', myClickFunc); ListenerName的首字母需要大写。使用Change监听会报错，因为这个监听事件已经被antd占用

CIF(arg).isPassword() // 设置表单为password

CIF(arg).isRadio(option: array) // 设置表单为radio, option: [{text: string, value: any}]

CIF(arg).isCheckbox(option: array) // 设置表单为checkbox, option: 同isRadio
CIF(arg).isSelect(option: array, config: {showSearch: bool, multiple: bool}) // 设置表单为select, option: 同isRadio, config.showSearch,显示搜索框，multiple允许多选，
CIF(arg).isDatePicker(option: String) // 设置表单为时间选择器，参数是时间格式，默认YYYY-MM-DD
CIF(arg).isDateRangePicker(option: String) // 设置表单为时间段选择器，参数是时间格式，默认YYYY-MM-DD
CIF(arg).isTextArea() // 设置表单为textarea
CIF(arg).isText(option: String) // 设置表单text文本，只是显示
CIF(arg).clone() // 拷贝一份当前的配置，不改变原配置


CIF(arg).is(option: Object({type, prop, options})) // 设置表单为自定义组件，通常需要配合extend工具同用, type: 自定义组件类型，prop自定义组件的prop，options自定义组件的options，同select options（一般用不到这个参数，好像有问题，最好不要用）
example:

import { extend,createInputFactory } from 'DynamicForm';
extend('myComponentName', MyComponent);
CIF(arg).is(({'myComponentName', prop}))

````
[rule校验规则](https://ant.design/components/form-cn/#%E6%A0%A1%E9%AA%8C%E8%A7%84%E5%88%99)



##### 更新formConfig

由于redux需要新的对象以及新的内存地址的更新，所以建议通过以下方式更新表单配置

oldFormConfig: {
	name: CIF('姓名'),
	age: CIF('年龄'),
}
// 更新age配置
newFormConfig = {
	oldFormConfig.name,
	age: CIF(oldFormConfig.age).ph().isRequired(),
}

##### onChange:更新表单值

// name是更新的表单字段
// value是name对应的修改后的值
onChange = ({name, value}) => {}


##### reset: 重置表单

获取到dynamicForm的ref

1,清除redux中的表单数据
2,清除dynamicForm中的数据：this.dynamicForm.resetFields();

##### validateFieldsAndScroll：提交表单

// error 表单校验的结果是否有错误
this.dynamicForm.validateFieldsAndScroll(error => {
	if(error){ ... }
	else{ ... }
})
