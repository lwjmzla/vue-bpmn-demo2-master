
import base64 from './base64.js'
export default function userPaletteProvider (palette, create, elementFactory) {
  this._create = create
  this._elementFactory = elementFactory

  palette.registerProvider(this)
}

userPaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory'
]

userPaletteProvider.prototype.getPaletteEntries = function () {
  var elementFactory = this._elementFactory
  var create = this._create

  function startCreateUser (event) {
    var userTaskShape = elementFactory.create(
      'shape', { type: 'bpmn:UserTask' }
    )
    create.start(event, userTaskShape)
  }
  function startCreateService (event) {
    var serviceTaskShape = elementFactory.create(
      'shape', { type: 'bpmn:ServiceTask' }
    )
    create.start(event, serviceTaskShape)
  }
  function startCreateReceive (event) {
    var serviceTaskShape = elementFactory.create(
      'shape', { type: 'bpmn:ReceiveTask' }
    )
    create.start(event, serviceTaskShape)
  }

  return {
    'create-user-task': {
      group: 'activity',
      title: '用户节点',
      imageUrl: base64.user,
      action: {
        dragstart: startCreateUser,
        click: startCreateUser
      }
    },
    'create-service-task': {
      group: 'activity',
      title: '服务节点',
      imageUrl: base64.service,
      action: {
        dragstart: startCreateService,
        click: startCreateService
      }
    },
    'create-receive-task': {
      group: 'activity',
      title: '接收节点',
      imageUrl: base64.receive,
      action: {
        dragstart: startCreateReceive,
        click: startCreateReceive
      }
    }
  }
}
