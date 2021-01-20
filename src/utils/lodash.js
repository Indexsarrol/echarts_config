import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import concat from 'lodash/concat';
import remove from 'lodash/remove';
import keyBy from 'lodash/keyBy';
import isFunction from 'lodash/isFunction';
import differenceBy from 'lodash/differenceBy';
import uniq from 'lodash/uniq';
import keys from 'lodash/keys';
import xor from 'lodash/xor';
import difference from 'lodash/difference';

export default {
    cloneDeep, // 深拷贝
    findIndex, // 查询index
    groupBy, // 分组
    uniqBy, // 去重
    keys, // 获取key 的数组
    keyBy, // 转化keyBy
    uniq, // 去重
    xor, // 差异
    concat, // 合并数组
    remove, // 删除数组
    isFunction, // 判断函数
    difference, // 判断函数
    differenceBy // 反向查询
};