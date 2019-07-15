### FileUpload 文件上传组件 -- wxg



封装了antd的上传文件的组件。
建议配合dynamicForm组件使用

#### 用法

````

const formFields = {
	name: [],
};

const fieldsConfig = {
	name: CIF('姓名').is({
		type: 'FileUpload',
		prop: {
			renderFileList: (fileList, remove) => (
				<ul>
					{
						fileList.map(file => (
							<li key={file.fileName || file.name}>
								<span>{file.fileName || file.name}</span>&nbsp;&nbsp;
								<span onClick={() => remove(file)}>删除</span>
							</li>
						))
					}
				</ul>
			),
			renderUploadTrigger: () => <div>点击上传</div>,
		},
	}),
};
<DynamicForm
	fieldsConfig={fieldsConfig}
	formFields={formFields}
	onChange={this.onChange}
/>
````

##### props

###### fileType 文件类型，这是后台需要的此文件的业务上的类型是什么，具体参考对应的接口文档

例如: 
````
fileType: PropTypes.oneOf([1, 2, 3, 4]),
````


###### value 表单值，约定为一个数组

格式： [
	{
		fileId: PropTypes.string,
		fileName: PropTypes.string,
		fileUrl: PropTypes.string,
	},
	...
]

###### onError 错误处理

PropTypes.func
例如: 
当文件上传出错，文件类型不支持时，会调用此方法

###### renderFileList 渲染元素列表的方法，应返回一个ReactElement

PropTypes.func
renderFileList回调会传入两个参数，
第一个是当前的fileList数据
第二个为删除文件的方法，此方法必需传入一个fileList中已存在的元素


###### renderUploadTrigger 上传文件的触发元素

````
PropTypes.func
比如： () => <div>点击上传元素</div>
````

###### fileListPosition 


说明：html元素的先后关系，renderFileList渲染出来的元素是在renderUploadTrigger渲染出来的元素之前还是之后
````
fileListPosition: PropTypes.oneOf(['before', 'after']),
````

###### type 文件类型

````
PropTypes.oneOf(['image', 'xls', 'doc']),

image: 支持jpg, png, jpeg, gif文件
xls: 支持xls, xlsx文件
doc: 支持doc, docx文件

默认是image
````



##### sizeLimit

````
PropTypes.number
文件大小限制，单位byte
默认
1024 * 1024 * 3(即3M)

````
