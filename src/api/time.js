export function formatSeconds(value)
{
  var theTime = parseInt(value)// 秒
  var middle = 0// 分
  var hour = 0// 小时

  if (theTime >= 60) {
    middle = parseInt(theTime / 60)
    theTime = parseInt(theTime % 60)
    if (middle >= 60) {
      hour = parseInt(middle / 60)
      middle = parseInt(middle % 60)
    }
  }
  var result = ''
  if(parseInt(theTime) < 10){
    result = '0' + parseInt(theTime).toString()
  }else{
    result = '' + parseInt(theTime).toString()
  }

  if (middle === 0 && hour === 0){
    result = '00:00:' + result
    return result
  }

  if (middle > 0) {
    if(middle < 10){
      result = '0' + parseInt(middle).toString() + ':' + result
    }else{
      result = '' + parseInt(middle).toString() + ':' + result
    }
  }

  if (hour === 0){
    result = '00:' + result
    return result
  }

  if (hour > 0) {
    if(hour < 10){
      result = '0' + parseInt(hour).toString() + ':' + result
    }else{
      result = '' + parseInt(hour).toString() + ':' + result
    }
  }
  return result
}
