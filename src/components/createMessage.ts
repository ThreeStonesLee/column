import { createApp } from 'vue'

import Message from './Message.vue'
export type MessageType = 'error' | 'success' | 'default'

const createMessage = (info: string, type: MessageType, timeout = 2000) => {
  const messageInstance = createApp(Message, {
    message: info,
    type
  })

  // 函数式组件，如何挂载到节点上
  const mounteNode = document.createElement('div')
  document.body.appendChild(mounteNode)
  messageInstance.mount(mounteNode)
  setTimeout(() => {
    messageInstance.unmount(mounteNode)
    document.body.removeChild(mounteNode)
  }, timeout)
}

export default createMessage
