const path = require('path');
const CWD = p => path.resolve(process.cwd(), p);

const sinon = require('sinon');
const assert = require('assert');
const should = require('should');
const moment = require('moment');

const noop = ()=>{};

const conversions = require(CWD('../altrac-conversions'));
const moistureSensorReadings = {
  "1":0,
  "2":0,
  "3":2611,
  "4":3811,
  "5":3436,
  "6":3371,
  "7":5632,
  "8":5807,
  "9":0,
  "10":0,
  "11":2611,
  "12":3811,
  "13":3436,
  "14":3371,
  "15":5632,
  "16":5807,
  "17":0,
  "18":0,
  "19":5,
  "20":11,
  "21":8,
  "22":15,
  "23":24,
  "24":28,
  "25":0,
  "26":0,
  "27":5,
  "28":11,
  "29":8,
  "30":15,
  "31":24,
  "32":28,
  "33":2547,
  "34":2515,
  "35":2055,
  "36":1936,
  "37":2070,
  "38":2151,
  "39":2201,
  "40":2245,
  "41":2547,
  "42":2515,
  "43":2055,
  "44":1936,
  "45":2070,
  "46":2151,
  "47":2201,
  "48":2245,
  "128":0,
  "135":900,
  "140":1,
  "141":0,
  "150":3838,
  "151":11,
  "186":52,
};

describe('moisture functions', () => {
  describe('moistureSensor()', () => {

    it("Should generate an error when all values are out of range" , () => {
      const multiplier = 100;
      const precision = 0;
      const physical = {
        moistureSensorSettings: {
          moistureCombined: {
            goalMax: 50,
            goalMin: 20,
          },
        },
      };
      const valueKey = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

      const readings = {};
      valueKey.forEach(key => readings[key] = "0");

      const expectedResult = 'ERR';

      const result = conversions.moistureSensor(readings, physical, multiplier, precision, valueKey);

      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("Should generate the expected moisture sensor average value" , () => {
      const multiplier = 100;
      const precision = 0;
      const physical = {
        moistureSensorSettings: {
          moistureCombined: {
            goalMax: 50,
            goalMin: 20,
          },
        },
      };
      const valueKey = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

      const readings = {};
      valueKey.forEach(key => readings[key] = "3218");

      const expectedResult = 41;

      const result = conversions.moistureSensor(readings, physical, multiplier, precision, valueKey);

      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("Should generate negative values for low readings" , () => {
      const multiplier = 100;
      const precision = 0;
      const physical = {
        moistureSensorSettings: {
          moistureCombined: {
            goalMax: 50,
            goalMin: 20,
          },
        },
      };
      const valueKey = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

      const readings = {};
      valueKey.forEach(key => readings[key] = "1100");

      const expectedResult = -30;

      const result = conversions.moistureSensor(readings, physical, multiplier, precision, valueKey);

      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("Should generate values above 100 for high readings" , () => {
      const multiplier = 100;
      const precision = 0;
      const physical = {
        moistureSensorSettings: {
          moistureCombined: {
            goalMax: 50,
            goalMin: 20,
          },
        },
      };
      const valueKey = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

      const readings = {};
      valueKey.forEach(key => readings[key] = "9800");

      const expectedResult = 260;
      const result = conversions.moistureSensor(readings, physical, multiplier, precision, valueKey);
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });
  });

  describe('soilMoistureSensorAverage()', () => {
    it("Should generate an error when all values are out of range" , () => {
      const multiplier = 100;
      const precision = 0;
      const physical = {
        moistureSensorSettings: {
          moistureCombined: {
            goalMax: 50,
            goalMin: 20,
          },
        },
      };
      const valueKey = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

      const readings = {};
      valueKey.forEach(key => readings[key] = "0");

      const result = conversions.soilMoistureSensorAverage(readings, physical, multiplier, precision, valueKey);
      assert(typeof result === 'undefined', `result should be 'undefined', not ${result}`);
    });

    it("Should generate the expected moisture sensor average value" , () => {
      const multiplier = 100;
      const precision = 0;
      const physical = {
        moistureSensorSettings: {
          moistureCombined: {
            goalMax: 50,
            goalMin: 20,
          },
        },
      };
      const valueKey = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

      const readings = {};
      valueKey.forEach(key => readings[key] = "3218");

      const expectedResult = 32.18;
      const result = conversions.soilMoistureSensorAverage(readings, physical, multiplier, precision, valueKey);
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("Should generate the expected average value for a small collection of keys" , () => {
      const multiplier = 100;
      const precision = 0;
      const physical = {
        moistureSensorSettings: {
          moistureCombined: {
            goalMax: 50,
            goalMin: 20,
          },
        },
      };
      const valueKey = ["1", "4", "7", "10", "13", "16"];
      const readings = moistureSensorReadings;
      const expectedResult = 46.715;
      const result = conversions.soilMoistureSensorAverage(readings, physical, multiplier, precision, valueKey);
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

  });

  describe('soilSalinitySensorAverage()', () => {
    it("Should generate an error when all values are out of range" , () => {
      const multiplier = 1;
      const precision = 0;
      const physical = {};
      const valueKey = ["17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32"];

      const readings = {};
      valueKey.forEach(key => readings[key] = "100");

      const result = conversions.soilSalinitySensorAverage(readings, physical, multiplier, precision, valueKey);

      assert(typeof result === 'undefined', `result should be 'undefined', not ${result}`);
    });

    it("Should generate the expected average value" , () => {
      const multiplier = 1;
      const precision = 0;
      const physical = {};
      const valueKey = ["17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32"];

      const readings = {};
      valueKey.forEach(key => readings[key] = "11");

      const expectedResult = 11;
      const result = conversions.soilSalinitySensorAverage(readings, physical, multiplier, precision, valueKey);
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("Should generate the expected average value for a small collection of keys" , () => {
      const multiplier = 1;
      const precision = 0;
      const physical = {};
      const valueKey = ["17", "20", "23", "26", "29", "32"];
      const readings = moistureSensorReadings;
      const expectedResult = 5;
      const result = conversions.soilSalinitySensorAverage(readings, physical, multiplier, precision, valueKey);
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

  });


  describe('soilTemperatureSensorAverage()', () => {
    it("Should generate an error when all values are out of range" , () => {
      const multiplier = 100;
      const precision = 0;
      const physical = {};
      const valueKey = ["33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48"];

      const readings = {};
      valueKey.forEach(key => readings[key] = "10000");

      const result = conversions.soilTemperatureSensorAverage(readings, physical, multiplier, precision, valueKey);

      assert(typeof result === 'undefined', `result should be 'undefined', not ${result}`);
    });

    it("Should generate the expected average value" , () => {
      const multiplier = 100;
      const precision = 0;
      const physical = {};
      const valueKey = ["33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48"];

      const readings = {};
      valueKey.forEach(key => readings[key] = "1100");

      const expectedResult = 11;
      const result = conversions.soilTemperatureSensorAverage(readings, physical, multiplier, precision, valueKey);
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

    it("Should generate the expected average value for a small collection of keys" , () => {
      const multiplier = 100;
      const precision = 0;
      const physical = {};
      const valueKey = ["33", "37", "40", "43", "47", "48"];
      const readings = moistureSensorReadings;
      const expectedResult = 22;
      const result = conversions.soilTemperatureSensorAverage(readings, physical, multiplier, precision, valueKey);
      assert(result === expectedResult, `result should be ${expectedResult}, not ${result}`);
    });

  });

});
