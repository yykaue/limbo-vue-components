/**
 *Created by limbo <yykaue@qq.com> on 2020/10/12 19:56
 */
const sc = document.getElementsByTagName('script')

function versionCheck ({
                         url,
                         path,
                         license,
                         timeout = 5 * 60 * 1000,
                         key = 'version',
                         cb
                       }) {
  const times = setInterval(() => {
    if (!license) {
      clearInterval(times)
      return
    }
    const request = new XMLHttpRequest()
    const _url = url || `//${location.host}${path}/version.json`

    request.onreadystatechange = done
    // request.responseType = 'text/plain'
    request.timeout = 30000
    request.open('GET', `${_url}?t=${+new Date()}`, true)
    request.send()

    function done (response) {
      if (request.readyState !== 4) return
      if (request.status !== 200) return
      const JSONInfo = JSON.parse(request.response)
      const flag = Array.from(sc).some(item => {
        if (item.src && item.src.includes(JSONInfo[key])) {
          return true
        }
      })
      if (!flag) {
        const params = { request, response, times }
        cb && cb(params)
      }
    }
  }, timeout)
}

export default versionCheck
