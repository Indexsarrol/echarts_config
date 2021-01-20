import classnames from 'classnames';
import fetch from 'cross-fetch';
import * as echarts from "echarts";
import { Request } from "./request";

export function fetchDownload(url) {
    /*let promise = new Promise((resolve, reject) => {
        fetch(url).then(res => res.blob().then(blob => {
            let a = document.createElement('a');
            let url = window.URL.createObjectURL(blob); // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
            let filename = res.headers.get('Content-Disposition').split("=")[1];
            console.log(filename);
            //filename = decodeURI(filename);
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        }).then(() => {
            resolve();
        }));
    });
    return promise;*/
    window.location = url;
}

// 内部函数, 用于判断对象类型
function _getClass(object) {
    return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
}

export function isArray(obj) {
    return _getClass(obj).toLowerCase() === 'array';
}

export function isString(obj) {
    return _getClass(obj).toLowerCase() === 'string';
}

export function isDate(obj) {
    return _getClass(obj).toLowerCase() === 'date';
}

export function isObject(obj) {
    return _getClass(obj).toLowerCase() === 'object';
}

export function isNumber(obj) {
    return _getClass(obj).toLowerCase() === 'number' && !isNaN(obj);
}

export function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    // document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
    document.cookie = name + '=' + encodeURI(value);
}

export function getCookie(name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(name + '=');
        if (c_start !== -1) {
            c_start = c_start + name.length + 1;
            var c_end = document.cookie.indexOf(';', c_start);
            if (c_end === -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
}

export function clearCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;) {
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
        }
    }
}

/**
 * @desc 判断参数是否为空, 包括null, undefined, [], '', {}
 * @param {object} obj 需判断的对象
 */
export function isEmpty(obj) {
    var empty = false;

    if (obj === null || obj === undefined) {    // null and undefined
        empty = true;
    } else if ((isArray(obj) || isString(obj)) && obj.length === 0) {
        empty = true;
    } else if (isObject(obj)) {
        var hasProp = false;
        for (let prop in obj) {
            if (prop) {
                hasProp = true;
                break;
            }
        }
        if (!hasProp) {
            empty = true;
        }
    }
    return empty;
}

/**
 * @desc 判断参数是否不为空
 */
export function isNotEmpty(obj) {
    return !isEmpty(obj);
}

/**
 * @desc 判断参数是否为空字符串, 比isEmpty()多判断字符串中有空格的情况, 如: '   '.
 * @param {string} str 需判断的字符串
 */
export function isBlank(str) {
    if (isEmpty(str)) {
        return true;
    } else if (isString(str) && str.trim().length === 0) {
        return true;
    }
    return false;
}

/**
 * @desc 判断参数是否不为空字符串
 */
export function isNotBlank(obj) {
    return !isBlank(obj);
}

/**
 * @desc 生成一个随机id
 */
export function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * @desc 根据对象和传入的对象value属性的值, 查询value对应的name值
 * @param {object} obj 需遍历的对象
 * @param {string} value 需搜索的value属性的值
 * @demo USER = {
 *           A: {
 *               name: '普通会员',
 *               value: 0
 *           },
 *           B: {
 *               name: 'VIP会员',
 *               value: 1
 *           }
 *       }
 */
export function searchNameByVal(obj, value) {
    if (isEmpty(obj) || isEmpty(value)) {
        return '';
    }

    for (let prop in obj) {
        if (obj[prop].value === value) {
            return obj[prop].name;
        }
    }
}

export function signKeyWords(str, words = [], color = '#00AFE3') {
    if (words.length < 1) {
        return str;
    }

    var map = {}, reg, items;
    var regStr = `(${words.join('|')})`;

    words.forEach(function (e) {
        e !== '' && (map[e] = true);
    });
    reg = new RegExp(regStr, 'g');

    items = str.replace(reg, '#$1#').split(/#+/);

    var result = [];

    for (var i = 0; i < items.length; i++) {
        if (items[i] === '') {
            continue;
        }
        if (map[items[i]]) {
            result.push(`<strong style="color: ${color};">${items[i]}</strong>`);
        } else {
            result.push(`<span>${items[i]}</span>`);
        }
    }

    return result.join('');
}


/**
 * @desc 通过URL搜索对象获取url参数, 如www.xxx.com?a=1&b=2, getURLParam('a') return 1
 */
export function getURLParam(name) {
    if (isBlank(name)) {
        return;
    }
    // var urlQuery = getURLQuery();
    var urlQuery = getQueryParams();
    return urlQuery[name];
}

export function dateFormat(formatDate) {
    return formatDate.replace(/(.{4})(.{2})/, '$1-$2-');
}

export function monthPlus(formatDate, num, showDay) { // 月份加一个月
    let date = new Date(formatDate);
    let month = date.getMonth() + num;
    date.setMonth(month);
    let temMonth = date.getMonth() + 1;
    temMonth = temMonth > 9 ? temMonth : '0' + temMonth;
    return showDay ? `${date.getFullYear()}-${temMonth}-${date.getDate()}` : `${date.getFullYear()}-${temMonth}`;
}

/*
* 获取 url 参数，因为 this.props.location.query 不能得到带有 # 的参数，所以添加此方法
* */
export function getQueryParams() {
    let obj = {}, name, value;
    let str = location.href;
    let num = str.indexOf('?');
    str = str.substr(num + 1);
    const arr = str.split('&');
    for (let i = 0; i < arr.length; i++) {
        num = arr[i].indexOf('=');
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            obj[name] = value;
        }
    }
    return obj;
}

/**
 * 检查元素是否在数组中
 * @param arr
 * @param obj
 * @returns {boolean}
 */
export function contains(arr, obj) {
    let i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}

/**
 * 生成随机整数
 * @param min
 * @param max
 * @constructor
 */
export function random(min, max) {
    min = min || -90;
    max = max || 90;
    return min + Math.floor(Math.random() * (max - min));
}

/**
 * 指定位置插入字符串
 * @param str
 * @param flg
 * @param sn
 * @returns {string}
 */
export function insert_flg(str, flg, sn) {
    let newstr = '';
    for (let i = 0; i < str.length; i += sn) {
        let tmp = str.substring(i, i + sn);
        newstr += tmp + flg;
    }
    return newstr;
}

export function isFormData(obj) {
    return obj instanceof FormData;
}

const keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv"
    + "wxyz0123456789+/" + "=";

export function encode64(input) {
    let output = "";
    let chr1, chr2, chr3 = "";
    let enc1, enc2, enc3, enc4 = "";
    let i = 0;
    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
            + keyStr.charAt(enc3) + keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);

    return output;
}

// 深克隆
/**
 *  深克隆 无法搞定时间类型
 *  使用递归的方式实现数组、对象的深拷贝
 * @param source
 * @returns {Array}
 */
export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'shallowClone');
    }
    const targetObj = source.constructor === Array ? [] : {};
    for (const keys in source) {
        if (source.hasOwnProperty(keys)) {
            if (source[keys] && typeof source[keys] === 'object') {
                targetObj[keys] = source[keys].constructor === Array ? [] : {};
                targetObj[keys] = deepClone(source[keys]);
            } else {
                targetObj[keys] = source[keys];
            }
        }
    }
    return targetObj;
}

/**
 * 获取表格索引序号
 * @param index
 * @param start
 * @param size
 * @returns {*}
 */
export function getTableIndex(index, start, size = 10) {
    return index + 1 + (start - 1) * size;
}

export function getIndustryOneAndTow(condition = {}, firstIndustry = "全部行业", secondIndustry = "全部子行业") {
    condition.industryOne = firstIndustry === "全部行业" ? "" : firstIndustry;
    condition.industryTwo = secondIndustry === "全部子行业" ? "" : secondIndustry;
    return condition;
}

export function splitData(data) {
    data = `${data}`;
    let splitData = '';
    let length = data.length;
    if (length <= 3) {
        return data;
    } else if (3 < length && length <= 6) {
        splitData = data.substring(0, length - 3) + ',' + data.substring(length - 3, length);
        return splitData;
    } else if (6 < length && length <= 9) {
        splitData = data.substring(0, length - 6) + ',' + data.substring(length - 6, length - 3) + ',' + data.substring(length - 3, length);
        return splitData;
    } else if (9 < length && length <= 12) {
        splitData = data.substring(0, length - 9) + ',' + data.substring(length - 9, length - 6) + ',' + data.substring(length - 6, length - 3) + ',' + data.substring(length - 3, length);
        return splitData;
    } else {
        return data;
    }
}


/**
 * 构造空值
 * @param value
 * @returns {*}
 */
export function constructorNullValue(value) {
    if (value === "" || value === null || value === undefined) {
        return "—"
    } else {
        return value;
    }
};

/**
 * 时间戳转日期字符串,输入YYYY-MM-DD
 * @param dateNum
 * @returns {string}
 */
export function dateNumToString(dateNum) {
    if (dateNum && dateNum !== null && dateNum !== '') {
        let date = new Date(dateNum);
        let seperator = '-';
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = '0' + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate;
        }
        let currentDate = year + seperator + month + seperator + strDate;
        return currentDate;
    } else {
        return '—';
    }
};

export function toThousands(value) {
    if (Math.abs(value) < 1000) {
        return value;
    }
    let num = (value || 0).toString(), result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    return result;
}

// 单个柱状图
export function getSingleBar(xAxisData, chartData) {
    const { innerWidth } = window;
    let option = {
        grid: {
            left: '23%',
            right: '2%',
            top: '22%',
            bottom: '2%',
            containLabel: true
        },
        legend: {
            show: true,
            textStyle: {
                color: '#9B9B9B'
            },
            top: 0, 
            right: 0
        },
        tooltip: {

        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisLine: {
                lineStyle: {
                    color: 'rgba(179,251,255,0.15)',
                    width:(innerWidth > 3800 && innerWidth < 3850) ? 2 : 1
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#8E99BA',
                fontSize: (innerWidth > 3800 && innerWidth < 3850) ? 24 : 12
            },
        },
        yAxis: {
            name: '张',
            nameTextStyle: {
                color: '#8E99BA'
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(179,251,255,0.15)',
                    width:(innerWidth > 3800 && innerWidth < 3850) ? 2 : 1
                }
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                color: '#8E99BA',
                fontSize: (innerWidth > 3800 && innerWidth < 3850) ? 24 : 12
            },
        },
        series: [
            {
                type: 'bar',
                barWidth: (innerWidth > 3800 && innerWidth < 3850) ? 40 : 20,
                data: chartData,
                // label: {
                //     show: true,
                //     position: 'top',
                //     textStyle: {
                //         color: '#ffffff'
                //     }
                // },
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList = [
                                ['rgba(240,255,0,1.00)', 'rgba(173,252,126,0.18)'],
                                ['rgba(0,212,246,1.00)', 'rgba(0,212,246,0.18)'],
                                ['rgba(249,130,180,1.00)', 'rgba(249,130,180,0.18)'],
                                ['#f5c379', 'transparent'],
                                ['#b4c6cc', 'transparent'],
                                ['#74d28c', 'transparent'],
                                ['#f4966e', 'transparent'],
                                ['#64b2ef', 'transparent'],
                            ];
                            var index = params.dataIndex;
                            if (params.dataIndex >= colorList.length) {
                                index = params.dataIndex - colorList.length;
                            }
                            return new echarts.graphic.LinearGradient(0, 0, 0, 1,
                                [
                                    { offset: 0, color: colorList[index][0] },
                                    { offset: 0.5, color: colorList[index][0] },
                                    { offset: 1, color: colorList[index][1] },
                                ]);
                        },
                        barBorderRadius: (innerWidth > 3800 && innerWidth < 3850) ? 40 : 20,
                    }
                }
            }
        ]
    };
    return option;
}

// 双柱状图
export function getDoubleBar(xAxisData, legendData, data1, data2) {
    const { innerWidth } = window;
    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            textStyle: {
                fontSize: (innerWidth > 3800 && innerWidth < 3850) ? 28 : 14
            }
        },
        grid: {
            left: '15%',
            right: '10%',
            bottom: '10%',
            top: '20%',
            containLabel: true
        },
        legend: {
            data: legendData,
            right: (innerWidth > 3800 && innerWidth < 3850) ? 40 : 20,
            top: '0',
            icon: 'path://M2.719,0.781 L14.719,0.781 C15.823,0.781 16.719,1.677 16.719,2.781 C16.719,3.886 15.823,4.781 14.719,4.781 L2.719,4.781 C1.614,4.781 0.719,3.886 0.719,2.781 C0.719,1.677 1.614,0.781 2.719,0.781 Z',
            textStyle: {
                padding: (innerWidth > 3800 && innerWidth < 3850) ? [0, 0, 0, 20] : [0, 0, 0, 10],
                color: '#fff',
                fontSize: (innerWidth > 3800 && innerWidth < 3850) ? 24 : 12
            }
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisLine: {
                lineStyle: {
                    width: (innerWidth > 3800 && innerWidth < 3850) ? 4 : 2,
                    color: 'rgba(89,91,113,0.3)'

                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                // interval: 0,
                // rotate: 40,
                textStyle: {
                    color: '#8D99BA',
                    fontSize:  (innerWidth > 3800 && innerWidth < 3850) ? 24 : 12,
                    fontFamily: 'Microsoft YaHei'
                }
            },
        },

        yAxis: {
            name: '(K)',
            nameTextStyle: {
                color: '#8E99BA',
                fontSize:  (innerWidth > 3800 && innerWidth < 3850) ? 24 : 12,
            },
            type: 'value',
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'white'
                }
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(89,91,113,.3)'
                }
            },
            axisLabel: {
                color: '#8D99BA',
                fontSize:  (innerWidth > 3800 && innerWidth < 3850) ? 24 : 12,
            }
        },
        series: [{
            name: '接入数据',
            type: 'bar',
            barWidth: (innerWidth > 3800 && innerWidth < 3850) ? 24 : 12,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(240,255,0,1)'
                    }, {
                        offset: 1,
                        color: 'rgba(173,252,126,0.18)'
                    }]),
                    barBorderRadius: (innerWidth > 3800 && innerWidth < 3850) ? 24 : 12,
                },
            },
            data: data1
        },
        {
            name: '流出数据',
            type: 'bar',
            barWidth: (innerWidth > 3800 && innerWidth < 3850) ? 24 : 12,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(0,212,246,1)'
                    }, {
                        offset: 1,
                        color: 'rgba(12,137,129,.18)'
                    }]),
                    barBorderRadius: (innerWidth > 3800 && innerWidth < 3850) ? 24 : 12,
                }

            },
            data: data2
        }]
    };

    return option;
}

// 折线图

export function getLine({ lineColor, startColor, endColor, xAxisData, totalData, yData }) {
    const { innerWidth } = window;
    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
            },
            textStyle: {
                fontSize: (innerWidth > 3800 && innerWidth < 3850) ? 28 : 14
            }
        },
        legend: {
            data: ['数据缺失', '数据总条数'],
            x: 'right',
            top: '0',
            icon: 'path://M2.719,0.781 L14.719,0.781 C15.823,0.781 16.719,1.677 16.719,2.781 C16.719,3.886 15.823,4.781 14.719,4.781 L2.719,4.781 C1.614,4.781 0.719,3.886 0.719,2.781 C0.719,1.677 1.614,0.781 2.719,0.781 Z',
            textStyle: {
                padding: (innerWidth > 3800 && innerWidth < 3850) ? [0, 0, 0, 20] : [0, 0, 0, 10],
                color: '#fff',
                "fontSize": (innerWidth > 3800 && innerWidth < 3850) ? 24 : 12,
            }
        },
        grid: {
            left: '5%',
            right: '4%',
            top: '20%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: xAxisData || ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                axisLine: {
                    lineStyle: {
                        width: 2,
                        color: '#00A0E9'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#c1cadf',
                    fontSize: (innerWidth > 3800 && innerWidth < 3850) ? 24 : 12,
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(240,199,37,0.5)'
                    }
                },
                axisLabel: {
                    interval: 0,
                    color: '#c1cadf',
                    fontSize: (innerWidth > 3800 && innerWidth < 3850) ? 24 : 12,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: ['#115372']
                    }
                }
            }
        ],
        series: [
            {
                name: '数据总条数',
                type: 'line',
                smooth: true,
                symbolSize: 0,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(7,135,238,0.18)'
                    }, {
                        offset: 1,
                        color: 'rgba(7,135,238,0)'
                    }])
                },
                data: totalData || [127, 224, 120, 278, 227, 237, 456],
                barWidth: '30%',
                lineStyle: { normal: { width: 3 } },
                itemStyle: { normal: { color: 'rgba(7,135,238,1)' } }
            },
            {
                name: '数据缺失',
                type: 'line',
                smooth: true,
                symbolSize: 0,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: startColor || 'rgba(209,226,15,0.40)'
                    }, {
                        offset: 1,
                        color: endColor || 'rgba(13,29,77,0.22)'
                    }])
                },
                data: yData ||  [27, 124, 70, 178, 127, 157, 34],
                barWidth: '30%',
                lineStyle: { normal: { width: 3 } },
                itemStyle: { normal: { color: lineColor || '#f0c725' } }
            }
        ]
    };
    return option
}


export function rotateDom(dataJson) {
    const { innerWidth } = window;
    this.timer = null;
    this.clear = dataJson.clear;
    this.activeImg = dataJson.activeImg
    this.originImg = dataJson.originImg
    this.startAngle = dataJson.startAngle
    this.dom = dataJson.dom;
    // 参考元素
    this.referenceDom = dataJson.referenceDom;
    // 方向
    this.direcition = dataJson.direcition || 1;
    // 总时长
    this.time = dataJson.time || 1000;
    // 帧间隔
    this.interval = dataJson.interval || 10;
    // 总帧数
    this.allFrame = this.time / this.interval;
    // 每帧旋转角度
    this.everyAngle = 360 / this.allFrame;
    // 位置数据
    // this.A = 290
    // this.B = 50
    // this.R = 350
    this.A = (innerWidth > 3800 && innerWidth < 3850) ? 580 : 290
    this.B = (innerWidth > 3800 && innerWidth < 3850) ? 100 : 50
    this.R = (innerWidth > 3800 && innerWidth < 3850) ? 700 : 350

    this.X = this.A + Math.sin(degToRadianChange(0)) * this.R;
    
    this.Y = this.B - Math.cos(degToRadianChange(0)) * this.R;

    // 渲染
    this.render();
    this.move();    
}
rotateDom.prototype.render = function(angle) {
    if (angle >= 180 && angle <= 225) {
        this.dom.setAttribute('class', 'active');
    } else {
        this.dom.setAttribute('class', 'imgs');
    }
    if (angle > 30 && angle < 280 ) {
        this.dom.style.opacity = 1;
    } else {
        this.dom.style.opacity = 0
    }
    this.dom.style.top = this.Y + 'px';
    this.dom.style.left = this.X + 'px';
}
rotateDom.prototype.move = function() {
    var self = this;
    var angle = self.startAngle || 180;
    this.timer = setInterval(function() {
        angle += self.everyAngle * self.direcition;
        angle %= 360;
        if (angle > 315) {
            angle = 90
        }
        self.X = self.A + Math.sin(degToRadianChange(angle)) * self.R;
        self.Y = self.B - Math.cos(degToRadianChange(angle)) * self.R;
        self.render(angle);
    }, this.interval)

};


rotateDom.prototype.clearTimer = function() {
    var self = this;
    clearInterval(self.timer);
}




// 角度转弧度
function degToRadianChange(deg) {
    return Math.PI / 180 * deg
}
export function setSession(name, value) {
    if (typeof sessionStorage === 'object') {
        var data = value;
        if (typeof value !== 'string') {
            if (data === undefined) {
                data = null;
            } else {
                data = JSON.stringify(data);
            }
        }
        sessionStorage.setItem(name, data);
    }
}

export function getSession(name) {
    if (typeof sessionStorage === 'object') {
        var data = sessionStorage.getItem(name);
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }
    return null;
}

export function setLocal(name, value) {
    if (typeof localStorage === 'object') {
        var data = value;
        if (typeof value !== 'string') {
            if (data === undefined) {
                data = null;
            } else {
                data = JSON.stringify(data);
            }
        }
        localStorage.setItem(name, data);
    }
}

export function getLocal(name) {
    if (typeof localStorage === 'object') {
        var data = localStorage.getItem(name);
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }
    return null;
}

export function remove(name) {
    if (typeof sessionStorage === 'object') {
        if (sessionStorage.getItem(name)) {
            sessionStorage.removeItem(name);
        }
    }
    if (typeof localStorage === 'object') {
        if (localStorage.getItem(name)) {
            localStorage.removeItem(name);
        }
    }
}

export function clear() {
    if (typeof sessionStorage === 'object') {
        sessionStorage.clear();
    }
    if (typeof localStorage === 'object') {
        localStorage.clear();
    }
}
