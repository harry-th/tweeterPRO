const eqObjects = function(object1, object2) {
  if (Object.keys(object1).length !== Object.keys(object2).length) {
    return false;
  }
  let condition = (variable) => {
    return typeof variable === 'object' && !Array.isArray(variable) && variable !== null;
  };

  let eqArrays = function(array1, array2) {
    let length;
    let length1 = array1.length;
    let length2 = array2.length;
    length1 > length2 ? length = length1 : length = length2;
    for (let i = 0; i < length; i++) {
      if (Array.isArray(array1[i]) && Array.isArray(array2[i])) {
        if (!eqArrays(array1[i],array2[i])) return false;
        else continue;
      } else if (Array.isArray(array1[i]) || Array.isArray(array2[i])) {
        return false;
      }
      if ((array1[i] !== array2[i])) return false;
    }
    return true;
  };
  
  let checkEquality = function(object1, object2) {
    for (let item in object1) {
      let value1 = object1[item];
      let value2 = object2[item];
      if (Array.isArray(value1) && Array.isArray(value2)) {
        return eqArrays(value1, value2);
      } else if (condition(value1) && condition(value2)) {
        return eqObjects(value1, value2);
      }
      if (!Object.keys(object2).includes(item)) return false;
      else if (value1 !== value2) return false;
    }
    return true;
  };
  if (checkEquality(object1, object2)) {
    return true;
  } else {
    return false;
  }
};

module.exports = eqObjects;
