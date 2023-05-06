const formatDateTime = (miliseconds, format = "h:i:s d/m/Y") => {
  const date = new Date(miliseconds);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return format.replace("Y", year).replace("m", month).replace("d", day).replace("h", hours).replace("i", minutes).replace("s", seconds);
};

exports.formatDateTime = formatDateTime;
