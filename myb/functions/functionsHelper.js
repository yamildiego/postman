const formatDateTime = (miliseconds, format = "h:i:s d/m/Y") => {
  let date = new Date(miliseconds);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  let monthText = month <= 9 ? "0" + month : month + "";
  let dayText = day <= 9 ? "0" + day : day + "";
  let hoursText = hours <= 9 ? "0" + hours : hours + "";
  let minutesText = minutes <= 9 ? "0" + minutes : minutes + "";
  let secondsText = seconds <= 9 ? "0" + seconds : seconds + "";

  let result1 = format.replace("Y", year);
  let result2 = result1.replace("m", month);
  let result3 = result2.replace("d", day);

  let result4 = result3.replace("h", hoursText);
  let result5 = result4.replace("i", minutesText);
  let result6 = result5.replace("s", seconds);

  return result6;
};

exports.formatDateTime = formatDateTime;
