<template>
  <div class="containers" ref="content">
    <div class="canvas" ref="canvas"></div>
    <div id="js-properties-panel" class="panel"></div>
    <ul class="buttons">
      <li>
        <a class="active" ref="saveDiagram" href="javascript:" title="打印XML" @click="printXML">控制台打印XML</a>
        <a class="active" ref="downDiagram" href="javascript:" title="下载文件" >下载文件</a>
      </li>
    </ul>
  </div>
</template>

<script>
// 引入相关的依赖
// import BpmnViewer from 'bpmn-js'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import BpmnModdle from 'bpmn-moddle'
// import propertiesPanelModule from 'bpmn-js-properties-panel'
// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
// import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'

import PaletteProvider from './PaletteProvider.js'
import customTranslate from '@/bpmnChineseTranslate/index.js'
import { Loading } from 'element-ui'
import axios from 'axios'
export default {
  created () {
    this.loadingInstance = Loading.service()
    setTimeout(() => {
      this.loadingInstance.close()
    }, 1000)
  },
  data () {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null,
      xmlStr: null,
      processName: '',
      xml: ''
    }
  },
  methods: {
    createNewDiagram () {
      const bpmnXmlStr = `
        <?xml version="1.0" encoding="UTF-8"?>
        <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
          <bpmn2:process id="Process_1" isExecutable="false">
            <bpmn2:startEvent id="StartEvent_1" name="开始">
              <bpmn2:outgoing>SequenceFlow_06xgjro</bpmn2:outgoing>
            </bpmn2:startEvent>
            <bpmn2:userTask id="Task_1jbhebc" name="审批人：XX">
              <bpmn2:incoming>SequenceFlow_06xgjro</bpmn2:incoming>
              <bpmn2:outgoing>SequenceFlow_10p9o5w</bpmn2:outgoing>
            </bpmn2:userTask>
            <bpmn2:sequenceFlow id="SequenceFlow_06xgjro" sourceRef="StartEvent_1" targetRef="Task_1jbhebc" />
            <bpmn2:endEvent id="EndEvent_194upm2" name="结束">
              <bpmn2:incoming>SequenceFlow_10p9o5w</bpmn2:incoming>
            </bpmn2:endEvent>
            <bpmn2:sequenceFlow id="SequenceFlow_10p9o5w" sourceRef="Task_1jbhebc" targetRef="EndEvent_194upm2" />
          </bpmn2:process>
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
              <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
                <dc:Bounds x="485" y="93" width="36" height="36" />
                <bpmndi:BPMNLabel>
                  <dc:Bounds x="492" y="69" width="22" height="14" />
                </bpmndi:BPMNLabel>
              </bpmndi:BPMNShape>
              <bpmndi:BPMNShape id="UserTask_1xabqml_di" bpmnElement="Task_1jbhebc">
                <dc:Bounds x="453" y="175" width="100" height="80" />
              </bpmndi:BPMNShape>
              <bpmndi:BPMNEdge id="SequenceFlow_06xgjro_di" bpmnElement="SequenceFlow_06xgjro">
                <di:waypoint x="503" y="129" />
                <di:waypoint x="503" y="175" />
              </bpmndi:BPMNEdge>
              <bpmndi:BPMNShape id="EndEvent_194upm2_di" bpmnElement="EndEvent_194upm2">
                <dc:Bounds x="485" y="410" width="36" height="36" />
                <bpmndi:BPMNLabel>
                  <dc:Bounds x="492" y="453" width="22" height="14" />
                </bpmndi:BPMNLabel>
              </bpmndi:BPMNShape>
              <bpmndi:BPMNEdge id="SequenceFlow_10p9o5w_di" bpmnElement="SequenceFlow_10p9o5w">
                <di:waypoint x="503" y="255" />
                <di:waypoint x="503" y="410" />
              </bpmndi:BPMNEdge>
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </bpmn2:definitions>
      `
      this.xml = bpmnXmlStr
      // 将字符串转换成图显示出来
      this.bpmnModeler.importXML(bpmnXmlStr, (err) => {
        if (err) {
          console.error(err)
        }
        this.setElements()
        this.setArrow()
        this.setEncoded() // !设置下载文件
        // !this.bpmnModeler.invoke(fn)
      })
    },
    saveXML () {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (err) { return console.log(err) }
        this.xml = xml
        // !对xml 进行修改成自己想要的结构
        this.moddle.fromXML(xml, {format: true}, (err, definitions, context) => {
          // resolve({definitions, context})
          console.log(err)
          console.log(context)
          var process = definitions.rootElements[0]
          // var userTaskObj = process.flowElements[1] // ! "Task_1jbhebc"
          var userTaskObj
          var userTaskId = 'Task_1jbhebc'
          var eles = process.flowElements // !所有 子 ModdleElements
          var i = eles.length
          while (i--) {
            if (eles[i].id === userTaskId) {
              userTaskObj = eles[i] // ! 找到想要的 ModdleElement对象
              break
            }
          }
          // !1.documentation
          var userTaskDoc = userTaskObj.get('documentation')
          userTaskDoc.push(this.moddle.create('bpmn:Documentation', { textFormat: 'xyz', text: 'FOO\nBAR' }))
          userTaskDoc.push(this.moddle.create('bpmn:Documentation', { text: '<some /><html></html>' }))
          // !2.ExtensionElements
          var extensionElements = this.moddle.create('bpmn:ExtensionElements')
          var foosub = this.moddle.createAny('activiti:field', 'http://vendor', { // ! http://vendor 这个是比较随意的
            name: 'infType',
            $body: '111'
          })
          var foo = this.moddle.createAny('activiti:executionListener', 'http://vendor', {
            event: 'start',
            class: 'com.kmcflow.activiti.listener.KmcExecutionListener',
            $children: [
              foosub
            ]
          })
          extensionElements.get('values').push(foo)
          userTaskObj.set('extensionElements', extensionElements)

          // definitions.set('id', 'NEW ID') // !更改 definitions的id
          console.log(definitions)
          // !生成相应的XML
          this.moddle.toXML(definitions, {format: true}, (err, xml) => {
            console.log(err)
            this.xml = xml

            var blob = new Blob([xml], {type: 'applicationmn20-xml;charset=UTF-8'})
            var formData = new FormData()
            formData.append('file', blob) // !formdata.append("avatar_img",$("#avatar")[0].files[0]); 文件也是这么传
            formData.append('procId', 'a1')
            console.log(blob)
            console.log(formData) // !就算有数据打印出来也是空的
            console.log(formData.get('file'))

            axios({
              method: 'post',
              url: 'http://192.168.1.69:9088/api/workflow/releaseProcess',
              data: formData // !固定写法  不能 {file: formData,procId: 'a1'}  同时只能提交一种类型，你设置为json，就相当于是2种类型了
              // headers: { 'Content-Type': 'multipart/form-data' } // 可以不设置
            }).then((res) => {
              console.log(res)
            })
            // this.bpmn.importXML(xml, _=>{
            //   // 改变元素颜色
            //   // let modeling = this.bpmn.get('modeling');
            //   // let elementRegistry = this.bpmn.get('elementRegistry');
            //   // let elementToColor = elementRegistry.get(this.nodeId);
            //   // modeling.setColor(elementToColor, {
            //   // 	stroke: 'green',
            //   // 	fill: 'yellow'
            //   // })
            // })
          })
        })
      })
    },
    printXML () {
      console.log(this.xml)
    },
    setArrow () {
      // !改arrow颜色  看看怎么改文字颜色
      const arrow = document.getElementsByTagName('marker')[0].firstElementChild
      arrow.style.fill = 'rgb(44,157,255)'
      arrow.style.stroke = 'rgb(44,157,255)'
    },
    setElements () {
      // console.log(this.elementRegistry) 所有元素
      this.elementRegistry.forEach((ele, gfx) => {
        let circle = gfx.getElementsByTagName('g')[0].firstElementChild // ! 控制背景
        let text1 = gfx.getElementsByTagName('g')[0].getElementsByTagName('tspan')[0]
        let texts = gfx.getElementsByTagName('g')[0].getElementsByTagName('tspan')
        let type = ele.type
        // console.log(type)
        if (type === 'bpmn:ReceiveTask') {
          for (let i = 0; i < texts.length; i++) {
            texts[i].style.fill = 'orange'
          }
          // circle.style.fill = 'orange'
          circle.style.stroke = 'orange'
        } else if (type === 'bpmn:UserTask') {
          for (let i = 0; i < texts.length; i++) {
            texts[i].style.fill = 'rgb(44,157,255)'
          }
          // circle.style.fill = 'rgb(44,157,255)'
          circle.style.stroke = 'rgb(44,157,255)'

          // !!!!!!!!!!!!!!!!!!!!!!
          // console.log(ele)
          // let bo = ele.businessObject
          // bo.name = 'hhhhhhhhhhhhhhhh'
          // console.log(bo.get('documentation'))
          // bo.get('documentation').push(this.bpmnFactory.create('bpmn:Documentation', {text: 'text'}))
          // console.log(bo.get('documentation'))
          // bo.get('documentation').push(this.bpmnFactory.create('bpmn:Documentation', {text}))
          // // bo.get('documentation').splice(0, 1)
          // // console.log(bo.get('documentation'))
          // console.log(this.elementRegistry.get('Task_1jbhebc')) // 知道data-element-id="Task_1jbhebc"  快速获取 Shape对象
          this.saveXML()
        } else if (type === 'bpmn:ServiceTask') {
          for (let i = 0; i < texts.length; i++) {
            texts[i].style.fill = 'rgb(153,51,255)'
          }
          // circle.style.fill = 'purple'
          circle.style.stroke = 'rgb(153,51,255)'
        } else if (type === 'bpmn:StartEvent') {

        } else if (type === 'bpmn:EndEvent') {

        } else if (type === 'bpmn:ExclusiveGateway') {
          text1 = gfx.getElementsByTagName('g')[0].getElementsByTagName('path')[0]
          text1.style.fill = 'red'
          text1.style.stroke = 'red'
        } else if (type === 'bpmn:SequenceFlow') { // !线
          circle.style.stroke = 'rgb(44,157,255)'
        }
      })
    },
    // 当图发生改变的时候会调用这个函数，这个data就是图的xml
    setEncoded () { // (downloadLink, 'diagram.bpmn', err ? null : xml)
      let link = this.$refs.downDiagram
      let name = 'diagram.bpmn'
      let data = this.xml
      // 把xml转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data)
      // 获取到图的xml，保存就是把这个xml提交给后台
      this.xmlStr = data
      // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
      if (data) {
        link.className = 'active'
        link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
        link.download = name
      }
    }
  },
  mounted () {
    this.container = this.$refs.content
    const canvas = this.$refs.canvas

    // function withModeler (config, fn) {
    //   return function (done) {
    //     var modeler = new BpmnModeler (config)

    //     modeler.attachTo('body')

    //     modeler.importXML(diagram, function (err) {
    //       if (err) {
    //         done(err)
    //       }

    //       modeler.invoke(fn)

    //       done()
    //     })
    //   }
    // }

    // 建模，官方文档这里讲的很详细
    this.bpmnModeler = new BpmnModeler({
      container: canvas,
      keyboard: { // !ctrl + z ctrl + y功能
        bindTo: document.body
      },
      additionalModules: [ // !可以以这样的方式 再创建 几个 节点服务节点  用户节点 接收节点。这样操作直接些。
        {
          __init__: [ 'PaletteProvider' ],
          PaletteProvider: [ 'type', PaletteProvider ]
        },
        customTranslate // !国际化
      ]
      // 添加控制板
      // propertiesPanel: {
      //   parent: '#js-properties-panel'
      // },
      // additionalModules: [
      //   // 左边工具栏以及节点
      //   propertiesProviderModule,
      //   // 右边的工具栏
      //   propertiesPanelModule
      // ],
      // moddleExtensions: {
      //   camunda: camundaModdleDescriptor
      // }
    })
    // modeler.attachTo('body')

    this.moddle = new BpmnModdle()

    // 给图绑定事件，当图有发生改变就会触发这个事件
    this.bpmnModeler.on('commandStack.changed', () => {
      this.saveXML()
      this.setElements()
    })
    // this.bpmnModeler.on('element.changed', () => {
    //   console.log(2)
    //   this.saveXML()
    // })
    // this.bpmnModeler.on('shape.changed', () => {
    //   console.log(3)
    //   this.saveXML()
    // })

    this.createNewDiagram(this.bpmnModeler)

    this.eventBus = this.bpmnModeler.get('eventBus') // ! 绑定事件用
    this.elementRegistry = this.bpmnModeler.get('elementRegistry') // ! 获取所有元素集合
    this.bpmnFactory = this.bpmnModeler.get('bpmnFactory')
    this.eventBus.on('element.click', (e) => {
      let ele = e.element
      let id = e.element.id
      if (!ele.parent) { return } // root
      console.log(ele, id)
    })
  }
}
</script>

<style lang="scss">
  /*左边工具栏以及编辑节点的样式*/
  @import 'bpmn-js/dist/assets/diagram-js.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  /*@import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';*/
  /*右边工具栏样式*/
  /*@import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';*/
  /*隐藏不必要的工具*/
  .group[data-group="data-object"],.group[data-group="data-store"],.group[data-group="collaboration"]{
    display: none;
  }
  .bpmn-icon-space-tool{
    display: none;
  }
  .entry[title="Create Intermediate/Boundary Event"],.entry[title="Create expanded SubProcess"]{
    display: none;
  }
  .group[data-group="model"]{
    display: none;
  }
  .djs-popup-header{
    display: none;
  }
  .bpmn-icon-send,.bpmn-icon-manual,.bpmn-icon-business-rule,.bpmn-icon-script,.bpmn-icon-call-activity,.bpmn-icon-subprocess-collapsed{
    display: none;
  }
  [data-container-id^='ExclusiveGateway'] .bpmn-icon-screw-wrench{
    display: none;
  }
  [data-container-id^='StartEvent'] .bpmn-icon-screw-wrench{
    display: none;
  }
  [data-container-id^='EndEvent'] .bpmn-icon-screw-wrench{
    display: none;
  }
  [data-container-id^='SubProcess'] .bpmn-icon-screw-wrench{
    display: none;
  }
  .bjs-powered-by{
    display: none;
  }
  .bpmn-icon-task{
    display: none;
  }
  /*隐藏不必要的工具*/
  .djs-palette.two-column.open{
    width: 48px;
  }
  .containers{
    position: absolute;
    background-color: #ffffff;
    width: 100%;
    height: 90%;
  }
  .canvas{
    width: 100%;
    height: 100%;
  }
  .buttons{
    position: absolute;
    left: 20px;
    bottom: 20px;
    &>li{
      display:inline-block;margin: 5px;
      &>a{
        color: #999;
        background: #eee;
        cursor: not-allowed;
        padding: 8px;
        border: 1px solid #ccc;
        &.active{
          color: #333;
          background: #fff;
          cursor: pointer;
        }
      }
    }
  }

</style>
