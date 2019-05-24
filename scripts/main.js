let input = document.querySelector("input");
let buttons = document.querySelectorAll("td");
let leftSpan = document.querySelector(".left_span");
let rightSpan = document.querySelector(".right_span");
// let link = document.querySelector(a);
let cos = Math.cos;
let sin = Math.sin;
let tan = Math.tan;
let ln = Math.log;
let e = Math.E;
let π = Math.PI;
let sel = 0;

input.onkeydown = function (event) {
  if (
    /[0-9,\-\+\*\/()!\^\s]/.test(event.key) || [8, 37, 38, 39, 40].indexOf(event.which) != -1 ||
    event.ctrlKey ||
    event.altKey ||
    event.metaKey
  ) {
    return true;
  } else {
    if ([13, 187].indexOf(event.which) != -1) {
      input.value = calculate();
    } else if ([83, 67, 84, 76, 80, 69, 190].indexOf(event.which) != -1) {
      sel = input.selectionStart;
      input.value = keyFunc(event.which);
    }
    return false;
  }
};

input.addEventListener('blur', () => {
  sel = input.selectionStart;
});

leftSpan.addEventListener('click', () => {
  if (leftSpan.innerHTML) {
    input.value = leftSpan.innerHTML;
    leftSpan.innerHTML = '';
    rightSpan.innerHTML = '';
  }
});

buttons.forEach(function (item) {
  switch (item.className) {
    case "sign":
      item.addEventListener("click", function () {
        input.value = signDef();
      });
      break;
    case "eq":
      item.addEventListener("click", function () {
        input.value = calculate();
      });
      break;
    case "cl":
      item.addEventListener("click", function () {
        input.value = "";
        leftSpan.innerHTML = "";
        rightSpan.innerHTML = "";
      });
      break;
    case "symbol":
      item.addEventListener("click", function () {
        input.value = addSymbol(item.id);
      });
      break;
    case "symbol num":
      item.addEventListener("click", function () {
        input.value = addSymbol(item.id);
      });
      break;
    case "par":
      item.addEventListener("click", function () {
        input.value = placeBrackets();
      });
      break;
    case "fn":
      item.addEventListener("click", function () {
        input.value = mathFunc(item);
      });
      break;
    case "inv":
      item.addEventListener("click", function () {
        if (input.value) {
          input.value = inverse();
        }
      });
      break;
  }
});

function inverse() {
  var str = input.value;
  if (/1\/[\(].*?[\)]/.test(str)) {
    str = str.slice(3, str.length - 1);
  } else {
    str = '1/(' + str + ')';
  }
  return str;
}

//Смена знака
function signDef() {
  var str = input.value;
  if (+str == input.value) {
    str = - +str;
  } else {
    if (/\-[\(].*?[\)]/.test(str)) {
      str = str.slice(2, str.length - 1);
    } else {
      str = "-(" + str + ")";
    }
  }
  return str;
}

function placeBrackets() {
  if (input.value.lastIndexOf("(") != -1 || input.value.lastIndexOf(")") != -1) {
    if (input.value.lastIndexOf("(") > input.value.lastIndexOf(")")) {
      sel = sel + 1;
      return input.value.substring(0, sel - 1) + ')' + input.value.substring(sel - 1);
    } else {
      sel = sel + 1;
      return input.value.substring(0, sel - 1) + '(' + input.value.substring(sel - 1);
    }
  } else {
    sel = sel + 1;
    return input.value.substring(0, sel - 1) + '(' + input.value.substring(sel - 1);
  }
}

//Вычисление факториала
function factorial(number) {
  var n = Math.abs(number);
  if (!(n % 1)) {
    if (number < 0) {
      return -(n ? n * factorial(n - 1) : 1);
    } else {
      return n ? n * factorial(n - 1) : 1;
    }
  } else {
    if (number < 0) {
      return -(
        Math.sqrt(2 * Math.PI * n) *
        Math.pow(n / Math.E, n) *
        (1 + 1 / (Math.sqrt(52 * Math.E) * n))
      );
    } else {
      return (
        Math.sqrt(2 * Math.PI * n) *
        Math.pow(n / Math.E, n) *
        (1 + 1 / (Math.sqrt(52 * Math.E) * n))
      );
    }
  }
}
//Баланс скобок в выражении
function balanceBrackets() {
  var str = input.value;
  var left = 0,
    right = 0;
  for (var i = 0; i < str.length; i++) {
    if (str[i] == "(") {
      ++left;
    } else if (str[i] == ")") {
      ++right;
    }
  }
  while (right < left) {
    str += ")";
    right++;
  }
  return str;
}
//Быстрый ввод функций, констант с клавиатуры
function keyFunc(key) {
  var word;
  switch (key) {
    case 83:
      word = "sin(";
      break;
    case 67:
      word = "cos(";
      break;
    case 84:
      word = "tan(";
      break;
    case 76:
      word = "ln(";
      break;
    case 80:
      word = "π";
      break;
    case 69:
      word = "e";
      break;
    case 190:
      word = ",";
      break;
  }
  sel = sel + word.length;
  return input.value.substring(0, sel - word.length) + word + input.value.substring(sel - word.length);
}

function addSymbol(word) {
  sel += word.length;
  return input.value.substring(0, sel - word.length) + word + input.value.substring(sel - word.length);
}
// Мат. функции
function mathFunc(item) {
  var word = item.innerHTML + '(';
  if (+input.value == input.value && input.value) {
    return word + input.value + ")";
  } else {
    sel += word.length;
    return input.value.substring(0, sel - word.length) + word + input.value.substring(sel - word.length);
  }
}

function calculate() {
  try {
    var spanContent = input.value;
    var i = balanceBrackets();
    i = i
      .replace(/\s+/g, "")
      .replace(/\,/g, ".")
      .replace(/\√/g, "Math.sqrt")
      .replace(/(\d+)([\(]|[a-z]|[π]|[M])/g, "$1*$2")
      .replace(/([\W])[\(](\d+[\.]\d+)[\)]!/g, "$1factorial($2)") //\(1.2)!
      .replace(/[^[a-z]][\(](\d+)[\)]!/g, "factorial($1)") //(12)!
      .replace(/(\d+[\.]\d+)!/g, "factorial($1)") //12.1!
      .replace(/(\d+)!/g, "factorial($1)") //12!
      .replace(/[\(](.+)![\)]/g, "factorial($1)") //(12!)
      .replace(/([a-z]+)[\(](.+)[\)]!/g, "factorial($1($2))") //cos(12)!
      .replace(/e!/g, "factorial(e)")
      .replace(/π!/g, "factorial(π)")
      .replace(/\^/g, "**");

    console.log(i);

    if (i) {
      var temp = (Math.round(eval(i) * 100000) / 100000).toString();
      if (!isNaN(+temp)) {
        if (isFinite(temp)) {
          temp = temp.replace(/\./g, ",");
          leftSpan.innerHTML = spanContent.replace(/(\d+)([\(]|[a-z]|[π]|[M])/g, "$1*$2");
          rightSpan.innerHTML = ' = ' + temp;
          return temp;
        } else {
          leftSpan.innerHTML = '';
          rightSpan.innerHTML = "∞";
          return "";
        }
      }
    }
  } catch (err) {
    leftSpan.innerHTML = '';
    rightSpan.innerHTML = "Ошибка";
    return input.value;
  }
}