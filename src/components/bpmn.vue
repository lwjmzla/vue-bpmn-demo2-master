<template>
  <div class="containers" ref="content">
    <div class="canvas" ref="canvas"></div>
    <div id="js-properties-panel" class="panel"></div>
    <ul class="buttons">
      <li>
        <a class="active" ref="saveDiagram" href="javascript:" title="打印XML" @click="printXML">控制台打印XML</a>
      </li>
    </ul>
  </div>
</template>

<script>
// 引入相关的依赖
// import BpmnViewer from 'bpmn-js'
import BpmnModeler from 'bpmn-js/lib/Modeler'
// import propertiesPanelModule from 'bpmn-js-properties-panel'
// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
// import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'

export default {
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
                <bpmn2:outgoing>SequenceFlow_1iktc0e</bpmn2:outgoing>
              </bpmn2:userTask>
              <bpmn2:sequenceFlow id="SequenceFlow_06xgjro" sourceRef="StartEvent_1" targetRef="Task_1jbhebc" />
              <bpmn2:exclusiveGateway id="ExclusiveGateway_1pzvhjz">
                <bpmn2:incoming>SequenceFlow_1yjc8kt</bpmn2:incoming>
                <bpmn2:outgoing>SequenceFlow_1pgijpc</bpmn2:outgoing>
                <bpmn2:outgoing>SequenceFlow_042v6a5</bpmn2:outgoing>
                <bpmn2:outgoing>SequenceFlow_1z10sgs</bpmn2:outgoing>
              </bpmn2:exclusiveGateway>
              <bpmn2:sequenceFlow id="SequenceFlow_1iktc0e" sourceRef="Task_1jbhebc" targetRef="Task_0poygzq" />
              <bpmn2:userTask id="Task_0poygzq" name="审批人：XX">
                <bpmn2:incoming>SequenceFlow_1iktc0e</bpmn2:incoming>
                <bpmn2:outgoing>SequenceFlow_1yjc8kt</bpmn2:outgoing>
              </bpmn2:userTask>
              <bpmn2:sequenceFlow id="SequenceFlow_1yjc8kt" sourceRef="Task_0poygzq" targetRef="ExclusiveGateway_1pzvhjz" />
              <bpmn2:sequenceFlow id="SequenceFlow_1pgijpc" name="出口" sourceRef="ExclusiveGateway_1pzvhjz" targetRef="Task_09d4u2x" />
              <bpmn2:sequenceFlow id="SequenceFlow_042v6a5" name="出口" sourceRef="ExclusiveGateway_1pzvhjz" targetRef="Task_1xm18nq" />
              <bpmn2:sequenceFlow id="SequenceFlow_1z10sgs" name="出口" sourceRef="ExclusiveGateway_1pzvhjz" targetRef="Task_0qug0ql" />
              <bpmn2:userTask id="Task_1xm18nq" name="审批人：XX">
                <bpmn2:incoming>SequenceFlow_042v6a5</bpmn2:incoming>
                <bpmn2:outgoing>SequenceFlow_1vnnn1a</bpmn2:outgoing>
              </bpmn2:userTask>
              <bpmn2:userTask id="Task_09d4u2x" name="审批人：XX">
                <bpmn2:incoming>SequenceFlow_1pgijpc</bpmn2:incoming>
                <bpmn2:outgoing>SequenceFlow_0ved41y</bpmn2:outgoing>
              </bpmn2:userTask>
              <bpmn2:serviceTask id="Task_0qug0ql" name="审批人：XX">
                <bpmn2:incoming>SequenceFlow_1z10sgs</bpmn2:incoming>
                <bpmn2:outgoing>SequenceFlow_0cp9p0c</bpmn2:outgoing>
              </bpmn2:serviceTask>
              <bpmn2:receiveTask id="Task_1h6j4fb" name="审批人：XX">
                <bpmn2:incoming>SequenceFlow_1vnnn1a</bpmn2:incoming>
                <bpmn2:outgoing>SequenceFlow_0v3rvxu</bpmn2:outgoing>
              </bpmn2:receiveTask>
              <bpmn2:sequenceFlow id="SequenceFlow_1vnnn1a" sourceRef="Task_1xm18nq" targetRef="Task_1h6j4fb" />
              <bpmn2:endEvent id="EndEvent_194upm2" name="结束">
                <bpmn2:incoming>SequenceFlow_0v3rvxu</bpmn2:incoming>
                <bpmn2:incoming>SequenceFlow_0ved41y</bpmn2:incoming>
                <bpmn2:incoming>SequenceFlow_0cp9p0c</bpmn2:incoming>
              </bpmn2:endEvent>
              <bpmn2:sequenceFlow id="SequenceFlow_0v3rvxu" sourceRef="Task_1h6j4fb" targetRef="EndEvent_194upm2" />
              <bpmn2:sequenceFlow id="SequenceFlow_0ved41y" sourceRef="Task_09d4u2x" targetRef="EndEvent_194upm2" />
              <bpmn2:sequenceFlow id="SequenceFlow_0cp9p0c" sourceRef="Task_0qug0ql" targetRef="EndEvent_194upm2" />
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
                <bpmndi:BPMNShape id="ExclusiveGateway_1pzvhjz_di" bpmnElement="ExclusiveGateway_1pzvhjz" isMarkerVisible="true">
                  <dc:Bounds x="478" y="437" width="50" height="50" />
                </bpmndi:BPMNShape>
                <bpmndi:BPMNEdge id="SequenceFlow_1iktc0e_di" bpmnElement="SequenceFlow_1iktc0e">
                  <di:waypoint x="503" y="255" />
                  <di:waypoint x="503" y="299" />
                </bpmndi:BPMNEdge>
                <bpmndi:BPMNShape id="UserTask_1nyqpvs_di" bpmnElement="Task_0poygzq">
                  <dc:Bounds x="453" y="299" width="100" height="80" />
                </bpmndi:BPMNShape>
                <bpmndi:BPMNEdge id="SequenceFlow_1yjc8kt_di" bpmnElement="SequenceFlow_1yjc8kt">
                  <di:waypoint x="503" y="379" />
                  <di:waypoint x="503" y="437" />
                </bpmndi:BPMNEdge>
                <bpmndi:BPMNEdge id="SequenceFlow_1pgijpc_di" bpmnElement="SequenceFlow_1pgijpc">
                  <di:waypoint x="503" y="487" />
                  <di:waypoint x="503" y="521" />
                  <bpmndi:BPMNLabel>
                    <dc:Bounds x="507" y="501" width="22" height="14" />
                  </bpmndi:BPMNLabel>
                </bpmndi:BPMNEdge>
                <bpmndi:BPMNEdge id="SequenceFlow_042v6a5_di" bpmnElement="SequenceFlow_042v6a5">
                  <di:waypoint x="478" y="462" />
                  <di:waypoint x="282" y="462" />
                  <di:waypoint x="282" y="521" />
                  <bpmndi:BPMNLabel>
                    <dc:Bounds x="369" y="444" width="22" height="14" />
                  </bpmndi:BPMNLabel>
                </bpmndi:BPMNEdge>
                <bpmndi:BPMNEdge id="SequenceFlow_1z10sgs_di" bpmnElement="SequenceFlow_1z10sgs">
                  <di:waypoint x="528" y="462" />
                  <di:waypoint x="741" y="462" />
                  <di:waypoint x="741" y="521" />
                  <bpmndi:BPMNLabel>
                    <dc:Bounds x="624" y="444" width="22" height="14" />
                  </bpmndi:BPMNLabel>
                </bpmndi:BPMNEdge>
                <bpmndi:BPMNShape id="UserTask_1t3hvv5_di" bpmnElement="Task_1xm18nq">
                  <dc:Bounds x="232" y="521" width="100" height="80" />
                </bpmndi:BPMNShape>
                <bpmndi:BPMNShape id="UserTask_04mtqro_di" bpmnElement="Task_09d4u2x">
                  <dc:Bounds x="453" y="521" width="100" height="80" />
                </bpmndi:BPMNShape>
                <bpmndi:BPMNShape id="ServiceTask_0be5v2g_di" bpmnElement="Task_0qug0ql">
                  <dc:Bounds x="691" y="521" width="100" height="80" />
                </bpmndi:BPMNShape>
                <bpmndi:BPMNShape id="ReceiveTask_1c22ovv_di" bpmnElement="Task_1h6j4fb">
                  <dc:Bounds x="232" y="650" width="100" height="80" />
                </bpmndi:BPMNShape>
                <bpmndi:BPMNEdge id="SequenceFlow_1vnnn1a_di" bpmnElement="SequenceFlow_1vnnn1a">
                  <di:waypoint x="282" y="601" />
                  <di:waypoint x="282" y="650" />
                </bpmndi:BPMNEdge>
                <bpmndi:BPMNShape id="EndEvent_194upm2_di" bpmnElement="EndEvent_194upm2">
                  <dc:Bounds x="485" y="811" width="36" height="36" />
                  <bpmndi:BPMNLabel>
                    <dc:Bounds x="492" y="854" width="22" height="14" />
                  </bpmndi:BPMNLabel>
                </bpmndi:BPMNShape>
                <bpmndi:BPMNEdge id="SequenceFlow_0v3rvxu_di" bpmnElement="SequenceFlow_0v3rvxu">
                  <di:waypoint x="282" y="730" />
                  <di:waypoint x="282" y="829" />
                  <di:waypoint x="485" y="829" />
                </bpmndi:BPMNEdge>
                <bpmndi:BPMNEdge id="SequenceFlow_0ved41y_di" bpmnElement="SequenceFlow_0ved41y">
                  <di:waypoint x="503" y="601" />
                  <di:waypoint x="503" y="811" />
                </bpmndi:BPMNEdge>
                <bpmndi:BPMNEdge id="SequenceFlow_0cp9p0c_di" bpmnElement="SequenceFlow_0cp9p0c">
                  <di:waypoint x="741" y="601" />
                  <di:waypoint x="741" y="829" />
                  <di:waypoint x="521" y="829" />
                </bpmndi:BPMNEdge>
              </bpmndi:BPMNPlane>
            </bpmndi:BPMNDiagram>
          </bpmn2:definitions>
      `
      // 将字符串转换成图显示出来
      this.bpmnModeler.importXML(bpmnXmlStr, (err) => {
        if (err) {
          console.error(err)
        }
        this.setElements()
        this.setArrow()
      })
    },
    saveXML () {
      this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (err) { return console.log(err) }
        this.xml = xml
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
        let text = gfx.getElementsByTagName('g')[0].getElementsByTagName('tspan')[0]
        let type = ele.type
        // console.log(type)
        if (type === 'bpmn:ReceiveTask') {
          text.style.fill = 'red'
          circle.style.fill = 'orange'
          circle.style.stroke = 'orange'
        } else if (type === 'bpmn:UserTask') {
          circle.style.fill = 'rgb(44,157,255)'
          circle.style.stroke = 'rgb(44,157,255)'
        } else if (type === 'bpmn:ServiceTask') {
          circle.style.fill = 'purple'
          circle.style.stroke = 'purple'
        } else if (type === 'bpmn:StartEvent') {

        } else if (type === 'bpmn:EndEvent') {

        } else if (type === 'bpmn:ExclusiveGateway') {
          text = gfx.getElementsByTagName('g')[0].getElementsByTagName('path')[0]
          text.style.fill = 'red'
          text.style.stroke = 'red'
        } else if (type === 'bpmn:SequenceFlow') { // !线
          circle.style.stroke = 'rgb(44,157,255)'
        }
      })
    }
  },
  mounted () {
    // 获取到属性ref为“content”的dom节点
    this.container = this.$refs.content
    // 获取到属性ref为“canvas”的dom节点
    const canvas = this.$refs.canvas

    // 建模，官方文档这里讲的很详细
    this.bpmnModeler = new BpmnModeler({
      container: canvas
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
  .group[data-group="tools"],.group[data-group="data-object"],.group[data-group="data-store"],.group[data-group="collaboration"]{
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
  .bpmn-icon-send,.bpmn-icon-manual,.bpmn-icon-business-rule,.bpmn-icon-script,.bpmn-icon-call-activity,.bpmn-icon-subprocess-collapsed,.bpmn-icon-subprocess-expanded{
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
  .bjs-powered-by{
    display: none;
  }
  /*隐藏不必要的工具*/
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
