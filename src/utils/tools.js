/**
 *Created by limbo <yykaue@qq.com> on 2020/7/14 10:42
 */
const printMessage = (messageArray = []) => {
  let messageString = ''
  const styleArray = []
  messageArray.forEach(item => {
    messageString += '%c' + item.label
    styleArray.push(item.style)
  })
  console.log(messageString, ...styleArray)
}

export {
  printMessage
}
