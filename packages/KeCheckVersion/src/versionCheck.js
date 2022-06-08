/**
 *Created by limbo <yykaue@qq.com> on 2020/10/12 19:56
 */
const sc = document.getElementsByTagName('script')

function versionCheck ({
  url,
  path,
  license,
  timeout = 5 * 60 * 1000,
  key = 'hash',
  cb
}) {
  const times = setInterval(() => {
    if (!license) {
      clearInterval(times)
      return
    }
    const xhr = new XMLHttpRequest()
    const _url = url || `//${location.host}${path}/version.json`

    xhr.onload = done
    // xhr.onreadystatechange = done
    // xhr.responseType = 'text/plain'
    xhr.timeout = 30000
    xhr.open('GET', `${_url}?t=${+new Date()}`, true)
    xhr.send()

    function done (response) {
      if (xhr.readyState !== 4) return
      if (xhr.status !== 200) return
      let JSONInfo
      try {
        JSONInfo = JSON.parse(xhr.response)
      } catch {
        JSONInfo = {}
      }

      const flag = Array.from(sc).some(item => {
        if (item.src && item.src.includes(JSONInfo[key])) {
          return true
        }
      })
      if (!flag) {
        const params = { xhr, response, times }
        cb && cb(params)
      }
    }
  }, timeout)
}

export default versionCheck
