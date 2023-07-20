/**
 *Created by limbo <yykaue@qq.com> on 2023/7/20 10:42
 */
const printInformation = (infoArray = []) => {
  let messageString = ''
  const styleArray = []
  infoArray.forEach(item => {
    messageString += '%c' + item.message
    styleArray.push(item.style)
  })
  console.log(messageString, ...styleArray)
}

export {
  printInformation
}
