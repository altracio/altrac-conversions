// index.js
var round = function round(n, d) {
  var decimalPlaces;

  switch (d) {
    case 0:
      decimalPlaces = 1;
      break;
    case 1:
      decimalPlaces = 10;
      break;
    case 2:
      decimalPlaces = 100;
      break;
    case 3:
      decimalPlaces = 1000;
      break;
    default:
      decimalPlaces = 1;
  }
  return Math.round(n * decimalPlaces) / decimalPlaces;
};

var isNumber = function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var voltToVWC = function voltToVWC(v) {
  /*
    0 to 1.1V VWC= 10*V-1  
    1.1V to 1.3V  VWC= 25*V- 17.5
    1.3V  to 1.82V  VWC= 48.08*V- 47.5
    1.82V to 2.2V VWC= 26.32*V- 7.89
  */
  if (v < 0.1) {
    return 0;
  } else if (v >= 0.1 && v < 1.1) {
    return ((10 * v) - 1);
  } else if (v >= 1.1 && v < 1.3) {
    return ((25 * v) - 17.5);
  } else if (v >= 1.3 && v < 1.82) {
    return ((48.04 * v) - 47.5);
  } else if (v >= 1.82 && v <= 3) { // went to 3, since this is suppsoedly the max
    return ((26.32 * v) - 7.89);
  } else {
    return 'ERR';
  }
};
var percentToVWC = function percentToVWC(p) {
  var v = (p) * 5;
  return voltToVWC(v);
};
var analogToVWC = function analogToVWC(a) {
  var v = (a / 1023) * 5;
  return voltToVWC(v);
};

var percentToDigital = function percentToDigital(a) {
  if (a > 0.5) {
    return 1;
  }
  return 0;
};
var analogToDigital = function analogToDigital(a) {
  if (a > 511) {
    return 1;
  }
  return 0;
};

var percentToDigitalInverse = function percentToDigitalInverse(a) {
  return (percentToDigital(a) === 1 ? 0 : 1);
};
var analogToDigitalInverse = function analogToDigitalInverse(a) {
  return (analogToDigital(a) === 1 ? 0 : 1);
};

var voltToCentibar = function voltToCentibar(v) {
  var centibar = 'ERR';
  if (v < 0) {
    centibar = 'VLO';
  } else if (v >= 0 && v <= 3.1) {
    centibar = (1 / 0.0117155) * v;
  } else {
    centibar = 'VHI';
  }
  return round(centibar, 0);
};
var percentToCentibar = function percentToCentibar(p) {
  var v = (p) * 5;
  return voltToCentibar(v);
};
var analogToCentibar = function analogToCentibar(a) {
  var v = (a / 1023) * 5;
  return voltToCentibar(v);
};

var metersPerSecondToMilesPerHour = function metersPerSecondToMilesPerHour(ms, precision) {
  var precisionValue = 0;
  if (precision && !isNaN(precision)) {
    precisionValue = Number(precision);
  }
  return round(ms * 2.23694, precisionValue);
};

var millimetersToInches = function millimetersToInches(mm, precision) {
  var precisionValue = 0;
  if (precision && !isNaN(precision)) {
    precisionValue = Number(precision);
  }
  return round(mm * 0.0393701, precisionValue);
};

var kilometersToMiles = function kilometersToMiles(km, precision) {
  var precisionValue = 0;
  if (precision && !isNaN(precision)) {
    precisionValue = Number(precision);
  }
  return round(km * 0.621371, precisionValue);
};

var kPaToInchesMercury = function kPaToInchesMercury(kpa, precision) {
  var precisionValue = 0;
  if (precision && !isNaN(precision)) {
    precisionValue = Number(precision);
  }
  return round(kpa * 0.2953, precisionValue);
};

var numberMap = function numberMap(value, inMin, inMax, outMin, outMax) {
  return (((value - inMin) * (outMax - outMin)) / (inMax - inMin)) + outMin;
};

var valveStatus = function valveStatus(status) {
  if (status === 0xFFFF) {
    return 0;
  }
  return status & 1 ? 1 : 0;
};
var valveStatusString = function valveStatusString(status) {
  if (status === 0xFFFF) {
    return 'ERR';
  }
  return valveStatus(status) ? 'ON' : 'OFF';
};

var cToF = function cToF(c) {
  return (c * 1.8) + 32;
};

var fToC = function fToC(f) {
  return (f - 32) / 1.8;
};

var cellSignalToRssi = function cellSignalToRssi(signal) {
  return signal >>> 8;
};
var cellSignalToQuality = function cellSignalToQuality(signal) {
  return signal & 0xFF >>> 0;
};

var fromC = function fromC(c, tempConv, precision) {
  var returnValue = null;
  if (c <= 120 && c >= -50) {
    if (tempConv === 'f') {
      returnValue = round(cToF(c), precision);
    } else if (tempConv === 'c') {
      returnValue = round(c, precision);
    }
  }
  return returnValue;
};
var fromCMultiplier = function fromCMultiplier(c, tempConv, precision) {
  return fromC(c / 100, tempConv, precision);
};

var toC = function toC(v, tempConv, precision) {
  var returnValue = -99;
  if (tempConv === 'f') {
    returnValue = fToC(v);
  } else if (tempConv === 'c') {
    returnValue = v;
  }
  return round(returnValue, precision);
};

var valveTimeToEpoch = function valveTimeToEpoch(valveTime) {
  return (Number(valveTime) & 0xFFFFFFF) * 60;
};
var valveTimeToEpochMillis = function valveTimeToEpochMillis(valveTime) {
  return (Number(valveTime) & 0xFFFFFFF) * 60 * 1000;
};

var valveTimeToDate = function valveTimeToDate(valveTime) {
  return (new Date(valveTimeToEpochMillis(valveTime)));
};

var nextValveTime = function nextValveTime(valveTimeArr) {
  var returnValue = [0, 0];
  if (valveTimeArr) {
    for (var i = 0; i < valveTimeArr.length; i += 2) {
      if (
        valveTimeToEpochMillis(valveTimeArr[i]) < (new Date().getTime()) &&
        valveTimeToEpochMillis(valveTimeArr[i + 1]) < (new Date().getTime())
      ) {
        // nothing to do here
      } else {
        if (valveTimeArr[i] < returnValue[0] || returnValue[0] === 0) {
          returnValue[0] = valveTimeArr[i];
          returnValue[1] = valveTimeArr[i + 1];
        } else {
          // do nothing
        }
      }
    }
  }
  return returnValue;
};

var nextValveTimeToEpochMillis = function nextValveTimeToEpochMillis(valveTimeArr) {
  var nextTimes = nextValveTime(valveTimeArr);
  var returnValue = [0, 0];
  returnValue[0] = valveTimeToEpochMillis(nextTimes[0]);
  returnValue[1] = valveTimeToEpochMillis(nextTimes[1]);
  return returnValue;
};

var toValveTime = function toValveTime(state, valve, epoch) {
  var statePrep = (state << 31) >>> 0;
  var valvePrep = (valve << 28) >>> 0;
  var epochPrep = epoch / 60;
  var returnVal = (statePrep | valvePrep | epochPrep) >>> 0;
  return returnVal;
};

var secondsToHHMMSS = function secondsToHHMMSS(totalSeconds) {
  var hours = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
  var seconds = totalSeconds - (hours * 3600) - (minutes * 60);
  var result = '';

  // round seconds
  seconds = Math.round(seconds * 100) / 100;

  result += hours > 0 ? hours + ' hours, ' : '';
  result += minutes > 0 ? minutes + ' minutes, ' : '';
  result += seconds > 0 ? seconds + ' seconds' : '';

  return result;
};

var percentTo20V = function percentTo20V(p, precision) {
  return round(p * (1 / (1800 / (1800 + 10000))) * 3.3, precision || 2);
};

var fourToTwenty = function fourToTwenty(p, min, max, zero, precision) {
  var minNumber = 0;
  var maxNumber = 100;
  var zeroNumber = 0;
  var precisionNumber = 0;
  if (!isNaN(min)) {
    minNumber = Number(min);
  }
  if (!isNaN(max)) {
    maxNumber = Number(max);
  }
  if (!isNaN(zero)) {
    zeroNumber = Number(zero);
  }
  if (!isNaN(precision)) {
    precisionNumber = Number(precision);
  }
  var returnValue = (((((p * 3.34) / 100) * 1000) - 4) * (maxNumber - minNumber)) / (20 - 4);
  var mA = (((p * 3.34) / 100) * 1000);
  var map = ((mA - 4) * (maxNumber - minNumber)) / (20 - 4);
  if (mA > 3.5 && returnValue < zeroNumber) {
    return 0;
  } else if (returnValue < zeroNumber) {
    return 'OFF';
  } else if (returnValue > maxNumber) {
    return 'ERH';
  }
  return round(returnValue, precisionNumber);
};

var fuelLevel = function fuelLevel(percent, size, maxSize) {
  return percent * (1 / (size / maxSize));
};

var ftToM = function ftToM(ft) {
  return ft * 0.3048;
};

var mToFt = function mToFt(m) {
  return m * 3.28084;
};

var millisecondsPastExpectedConnection = function millisecondsPastExpectedConnection(lastConnection, sleepTime) {
  var currentTime = (new Date()).getTime();
  var sleepInterval = (sleepTime * 1000);

  if (!sleepTime || sleepTime === 0) {
    sleepInterval = (60 * 10 * 1000) + 20000; // checks in every ten minutes, max
  }

  var nextSeen = new Date(
    (new Date(lastConnection).getTime() + sleepInterval)
  ).getTime();

  if (nextSeen < currentTime) {
    return (currentTime - nextSeen);
  }
  return 0;
}

var spaceCamel = function spaceCamel(s) {
  return s.replace(/([A-Z])/g, ' $1').replace(/^./, function(str) { return str.toUpperCase(); });
};

var pumpState = function pumpState(state) {
  var deviceStatus = '';
  switch (state & 0xF) {
    case 1:
      deviceStatus = 'FWD';
      break;
    case 2:
      deviceStatus = 'REV';
      break;
    case 4:
      deviceStatus = 'BRK';
      break;
    case 8:
      deviceStatus = 'STP';
      break;
    default:
      deviceStatus = 'ERR';
  }
  return deviceStatus;
};

var flowMeterState = function flowMeterState(value) {
  if (value > 0) {
    return 'RUN';
  }
  return 'STP';
};

var pumpOutput = function pumpOutput(readingCurrent, readingLast, currentTime, lastTime, multiplierValue) {
  var diff = (readingCurrent - readingLast) / multiplierValue;
  if (readingCurrent - readingLast < 0 && readingCurrent - readingLast >= -60000) {
    return 0;
  } else if (readingCurrent - readingLast < -60000) {
    diff = (readingCurrent - readingLast + 65535) / multiplierValue;
  }
  var current = new Date(isNumber(currentTime) ? currentTime * 1000 : currentTime).getTime();
  var previous = new Date(isNumber(lastTime) ? lastTime * 1000 : lastTime).getTime();
  var diffMinutes = (current - previous) / 1000 / 60;
  var output = Math.round(diff / diffMinutes);
  return isNaN(output) ? 0 : output;
};

var rpmToState = function rpmToState(rpm, off, high) {
  var returnValue = 'OFF';
  var offTest = 150;
  if (off) {
    offTest = off;
  }
  var highTest = 350;
  if (high) {
    highTest = high;
  }
  var rpmTest = 0;
  if (rpm) {
    rpmTest = rpm;
  }
  if (rpmTest < offTest) {
    returnValue = 'OFF';
  } else if (rpmTest >= offTest && rpmTest < highTest) {
    returnValue = 'LOW';
  } else {
    returnValue = 'HIGH';
  }
  return returnValue;
}

var rpmOrchardRite(rpm) {
  var returnValue = Math.round((rpm / -170.1244909 + 8.572735138) * rpm);
  if (returnValue < 0) { return 0; }
  if (returnValue > 3000) { return 3000; }
  return returnValue;
}

var binLevel = function binLevel(
  binLevelCurrent,
  binLevelLast,
  debounce,
  powered,
  numberOfBins
) {
  var fullness = 0;
  if (binLevelCurrent === binLevelLast) {
    fullness = binLevelCurrent;
  } else if (binLevelCurrent < binLevelLast) {
    fullness = binLevelCurrent;
  } else {
    fullness = binLevelLast;
  }

  var iterations = 4;
  var totalBins = 4;
  if (numberOfBins && numberOfBins > 0 && numberOfBins < 5) {
    iterations = numberOfBins;
    totalBins = numberOfBins;
  }
  var i = 1;
  if (powered) {
    i = 2;
    iterations += 1;
  }

  var numberFull = 0;
  for (i; i <= iterations; i += 1) {
    if ((fullness & Math.pow(2, (i - 1))) === Math.pow(2, (i - 1))) {
      numberFull += 1;
    } else {
      numberFull += 0;
    }
  }
  return numberFull + '/' + totalBins;
};

var windMachineChangeStatus = function windMachineChangeStatus(cs) {
  var returnValue = '';
  switch (cs) {
    case 0:
      returnValue = 'No Change';
      break;
    case 1:
      returnValue = 'A/S New';
      break;
    case 2:
      returnValue = 'EP New';
      break;
    case 254:
      returnValue = 'Error';
      break;
    case 255:
      returnValue = 'No A/S';
      break;
    default:
      returnValue = cs;
  }
  return returnValue;
}

var windMachineCommunicationStatus = function windMachineCommunicationStatus(cs) {
  var returnValue = '';
  switch (cs) {
    case -2:
      returnValue = 'Comm Error';
      break;
    case -1:
      returnValue = 'Not Connected';
      break;
    case 0:
      returnValue = 'No Attempt';
      break;
    case 1:
      returnValue = 'Connected';
      break;
    default:
      returnValue = cs;
  }
  return returnValue;
}

var windMachineEngineState = function windMachineEngineState(cs) {
  var returnValue = '';
  switch (cs) {
    case 0:
      returnValue = 'ECU Delay';
      break;
    case 1:
      returnValue = 'Engine Stopped';
      break;
    case 2:
      returnValue = 'Controller Standby';
      break;
    case 3:
      returnValue = 'Prestart 1';
      break;
    case 4:
      returnValue = 'Checksafe';
      break;
    case 5:
      returnValue = 'Prestart 2';
      break;
    case 6:
      returnValue = 'Crank on';
      break;
    case 7:
      returnValue = 'Crank Rest';
      break;
    case 8:
      returnValue = 'False Start';
      break;
    case 9:
      returnValue = 'Warmup';
      break;
    case 10:
      returnValue = 'Line Fill 1';
      break;
    case 11:
      returnValue = 'Line Fill 2';
      break;
    case 12:
      returnValue = 'Running';
      break;
    case 13:
      returnValue = 'Cooldown';
      break;
    case 14:
      returnValue = 'Stopping';
      break;
    case 15:
      returnValue = 'Spindown';
      break;
    case 16:
      returnValue = 'Wait To Start';
      break;
    default:
      returnValue = cs;
  }
  return returnValue;
}

var windMachineMPC20ShutdownStatus = function windMachineMPC20ShutdownStatus(sd) {
  var returnArray = [];
  if (sd & Math.pow(2, 0)) { returnArray.push('Overspeed SD'); }
  if (sd & Math.pow(2, 1)) { returnArray.push('Underspeed SD'); }
  if (sd & Math.pow(2, 2)) { returnArray.push('Overcrank SD'); }
  if (sd & Math.pow(2, 3)) { returnArray.push('Low Oil Pressure SD'); }
  if (sd & Math.pow(2, 4)) { returnArray.push('High Engine Temp SD'); }
  if (sd & Math.pow(2, 5)) { returnArray.push('Low Fuel SD'); }
  if (sd & Math.pow(2, 6)) { returnArray.push('Low Discharge Pressure SD'); }
  if (sd & Math.pow(2, 7)) { returnArray.push('High Discharge Pressure SD'); }
  if (sd & Math.pow(2, 8)) { returnArray.push('Speed Signal Lost SD'); }
  if (sd & Math.pow(2, 9)) { returnArray.push('Low Lube Level SD'); }
  if (sd & Math.pow(2, 10)) { returnArray.push('Fuel Leak SD'); }
  if (sd & Math.pow(2, 11)) { returnArray.push('Fuel Filter Restriction SD'); }
  if (sd & Math.pow(2, 12)) { returnArray.push('Air Damper Closed SD no'); }
  if (sd & Math.pow(2, 13)) { returnArray.push('Air Filter Restriction SD'); }
  if (sd & Math.pow(2, 14)) { returnArray.push('Oil Filter Restriction SD'); }
  if (sd & Math.pow(2, 15)) { returnArray.push('Remote Stop SD'); }
  if (sd & Math.pow(2, 16)) { returnArray.push('Coolant Level SD'); }
  if (sd & Math.pow(2, 17)) { returnArray.push('High Level SD'); }
  if (sd & Math.pow(2, 18)) { returnArray.push('Low Level SD'); }
  if (sd & Math.pow(2, 19)) { returnArray.push('High Flow SD'); }
  if (sd & Math.pow(2, 20)) { returnArray.push('Low Flow SD'); }
  if (sd & Math.pow(2, 21)) { returnArray.push('High Pump Oil Temp SD'); }
  if (sd & Math.pow(2, 22)) { returnArray.push('High Pump Housing Temp SD'); }
  if (sd & Math.pow(2, 23)) { returnArray.push('Water in Fuel SD'); }
  if (sd & Math.pow(2, 24)) { returnArray.push('Low Suction SD'); }
  if (sd & Math.pow(2, 25)) { returnArray.push('High Suction SD'); }
  if (sd & Math.pow(2, 26)) { returnArray.push('High Engine Oil Pressure SD'); }
  if (sd & Math.pow(2, 27)) { returnArray.push('High Engine Oil Temp SD'); }
  if (sd & Math.pow(2, 28)) { returnArray.push('Low Gear Box Pressure SD'); }
  if (sd & Math.pow(2, 29)) { returnArray.push('High Gear Box Pressure SD'); }
  if (sd & Math.pow(2, 30)) { returnArray.push('Battery Charger Fail SD'); }
  if (sd & Math.pow(2, 31)) { returnArray.push('Red Lamp Status'); }
  return returnArray;
}

var windMachineMPC20WarningStatus = function windMachineMPC20WarningStatus(wd) {
  var returnArray = [];
  if (wd & Math.pow(2, 0)) { returnArray.push('Low Fuel Warn'); }
  if (wd & Math.pow(2, 1)) { returnArray.push('Fuel Leak Warn'); }
  if (wd & Math.pow(2, 2)) { returnArray.push('Fuel Filter Restriction Warn'); }
  if (wd & Math.pow(2, 3)) { returnArray.push('Low Lube Level W arn'); }
  if (wd & Math.pow(2, 4)) { returnArray.push('Coolant Level Warn'); }
  if (wd & Math.pow(2, 5)) { returnArray.push('Water in Fuel Warn'); }
  if (wd & Math.pow(2, 6)) { returnArray.push('No Flow Warn'); }
  if (wd & Math.pow(2, 7)) { returnArray.push('High Engine Oil Temp Warn'); }
  if (wd & Math.pow(2, 8)) { returnArray.push('Low Oil Pressure Warn'); }
  if (wd & Math.pow(2, 9)) { returnArray.push('High Engine Temp Warn'); }
  if (wd & Math.pow(2, 10)) { returnArray.push('High Discharge Pressure Warn'); }
  if (wd & Math.pow(2, 11)) { returnArray.push('Low Discharge Pressure Warn'); }
  if (wd & Math.pow(2, 12)) { returnArray.push('High Suction Warn'); }
  if (wd & Math.pow(2, 13)) { returnArray.push('Low Suction Warn'); }
  if (wd & Math.pow(2, 14)) { returnArray.push('High Level Warn'); }
  if (wd & Math.pow(2, 15)) { returnArray.push('Low Level Warn'); }
  if (wd & Math.pow(2, 16)) { returnArray.push('High Flow Warn'); }
  if (wd & Math.pow(2, 17)) { returnArray.push('Low Flow Warn'); }
  if (wd & Math.pow(2, 18)) { returnArray.push('High Pump Oil Temp Warn'); }
  if (wd & Math.pow(2, 19)) { returnArray.push('High Pump Housing Temp Warn'); }
  if (wd & Math.pow(2, 20)) { returnArray.push('Low Gear Box Pressure Warn'); }
  if (wd & Math.pow(2, 21)) { returnArray.push('High Gear Box Pressure Warn'); }
  if (wd & Math.pow(2, 22)) { returnArray.push('Air Damper Closed Warn'); }
  if (wd & Math.pow(2, 23)) { returnArray.push('Air Filter Restriction Warn'); }
  if (wd & Math.pow(2, 24)) { returnArray.push('Oil Filter Restriction Warn'); }
  if (wd & Math.pow(2, 25)) { returnArray.push('Low Engine Temp Warn'); }
  if (wd & Math.pow(2, 26)) { returnArray.push('High Engine Oil Pressure Warn'); }
  if (wd & Math.pow(2, 27)) { returnArray.push('Battery Charger Fail Warn'); }
  if (wd & Math.pow(2, 28)) { returnArray.push('Run To Destruct Warn'); }
  if (wd & Math.pow(2, 29)) { returnArray.push('Battery High Warn'); }
  if (wd & Math.pow(2, 30)) { returnArray.push('Battery Low Warn'); }
  if (wd & Math.pow(2, 31)) { returnArray.push('Amber Lamp Status'); }
  return returnArray;
}

var chartDimensions = function chartDimensions(windowWidth) {
  var windowWidth = windowWidth;
  var chartWidth = 288;
  if (windowWidth >= 472) {
    chartWidth = 464;
  } else if (windowWidth >= 415) {
    chartWidth = windowWidth - 8;
  } else if (windowWidth >= 375) {
    chartWidth = 346;
  }
  var chartHeight = chartWidth - 30;

  chartWidth -= 20;
  chartHeight -= 20;

  return ({
    width: chartWidth + 'px',
    height: chartHeight + 'px',
    widthNumber: chartWidth,
    heightNumber: chartHeight,
  });
};

var numberToBinary = function numberToBinary(value, bit) {
  return (value & (Math.pow(2, bit)) >>> 0);
};

var numberToBinaryFE = function numberToBinaryFE(value, bit) {
  return numberToBinary(value, bit) ? 'F' : 'E';
};

var gallonsToAcreFeet = function gallonsToAcreFeet(value, precision){
  var returnValue = 0;
  if (!isNaN(value) && Number(value) > 0) {
    returnValue = round((Number(value) / 325851), precision);
  }
  return returnValue;
};

var windDirection = function windDirection(wd) {
  if (wd > 360 || wd < 0) {
    return 'ERR';
  }
  var dir = 'ERR';
  if (wd < 0 || wd > 360) {
    alert('Enter a degree between 0 and 360 degrees.');
  } else if (wd >= 0 && wd <= 11.25) {
    dir = 'N';
  } else if (wd > 348.75 && wd <= 360) {
    dir = 'N';
  } else if (wd > 11.25 && wd <= 33.75) {
    dir = 'NNE';
  } else if (wd > 33.75 && wd <= 56.25) {
    dir = 'NE';
  } else if (wd > 56.25 && wd <= 78.75) {
    dir = 'ENE';
  } else if (wd > 78.75 && wd <= 101.25) {
    dir = 'E';
  } else if (wd > 101.25 && wd <= 123.75) {
    dir = 'ESE';
  } else if (wd > 123.75 && wd <= 146.25) {
    dir = 'SE';
  } else if (wd > 146.25 && wd <= 168.75) {
    dir = 'SSE';
  } else if (wd > 168.75 && wd <= 191.25) {
    dir = 'S';
  } else if (wd > 191.25 && wd <= 213.75) {
    dir = 'SSW';
  } else if (wd > 213.75 && wd <= 236.25) {
    dir = 'SW';
  } else if (wd > 236.25 && wd <= 258.75) {
    dir = 'WSW';
  } else if (wd > 258.75 && wd <= 281.25) {
    dir = 'W';
  } else if (wd > 281.25 && wd <= 303.75) {
    dir = 'WNW';
  } else if (wd > 303.75 && wd <= 326.25) {
    dir = 'NW';
  } else if (wd > 326.25 && wd <= 348.75) {
    dir = 'NNW';
  }
  return dir;
};

function valueCalculator(
  formula,
  value,
  context,
  precision
) {
  var returnValue = value;
  switch (formula) {
    case 'valveStatus':
      returnValue = valveStatus(value);
      break;
    case 'valveStatusString':
      returnValue = valveStatusString(value);
      break;
    case 'fromC':
    case 'temperature':
      returnValue = fromC(value, context.tempConv, precision);
      break;
    case 'temperatureF':
      returnValue = fromC(value, 'f', precision);
      break;
    case 'percentTo20V':
      returnValue = percentTo20V(value, precision);
      break;
    case 'percentToCentibar':
      returnValue = percentToCentibar(value);
      break;
    case 'percentToVWC':
      returnValue = percentToVWC(value);
      break;
    case 'metersPerSecondToMilesPerHour':
      returnValue = metersPerSecondToMilesPerHour(value, precision);
      break;
    case 'windDirection':
      returnValue = windDirection(value);
      break;
    case 'millimetersToInches':
      returnValue = millimetersToInches(value, precision);
      break;
    case 'kilometersToMiles':
      returnValue = kilometersToMiles(value, precision);
      break;
    case 'kPaToInchesMercury':
      returnValue = kPaToInchesMercury(value, precision);
      break;
    case 'analogToCentibar':
      returnValue = analogToCentibar(value);
      break;
    case 'analogToVWC':
      returnValue = analogToVWC(value);
      break;
    case 'analogToDigitalInverseString':
      returnValue = analogToDigitalInverse(value) === 1 ? 'ON' : 'OFF';
      break;
    case 'percentToDigitalInverseString':
      returnValue = percentToDigitalInverse(value) === 1 ? 'ON' : 'OFF';
      break;
    case 'analogToDigitalInverse':
      returnValue = analogToDigitalInverse(value);
      break;
    case 'percentToDigitalInverse':
      returnValue = percentToDigitalInverse(value);
      break;
    case 'analogToDigitalString':
      returnValue = (analogToDigital(value) === 1) ? 'ON' : 'OFF';
      break;
    case 'percentToDigitalString':
      returnValue = (percentToDigital(value) === 1) ? 'ON' : 'OFF';
      break;
    case 'lowPercentToDigital':
      returnValue = percentToDigital(value + 0.3);
      break;
    case 'lowPercentToDigitalString':
      returnValue = (percentToDigital((value) + 0.3) === 1) ? 'ON' : 'OFF';
      break;
    case 'analogToDigital':
      returnValue = analogToDigital(value);
      break;
    case 'percentToDigital':
      returnValue = percentToDigital(value);
      break;
    case 'pumpState':
      returnValue = pumpState(value);
      break;
    case 'rpmOrchardRite':
      returnValue = rpmOrchardRite(value);
      break;
    case 'gallonsToAcreFeet':
      returnValue = gallonsToAcreFeet(value, precision);
      break;
    case 'flowMeterState':
      returnValue = flowMeterState(value);
      break;
    case 'cellSignalToRssi':
      returnValue = cellSignalToRssi(value);
      break;
    case 'cellSignalToQuality':
      returnValue = cellSignalToQuality(value);
      break;
    case 'numberToBinary0':
      returnValue = numberToBinary(value, 0);
      break;
    case 'numberToBinary1':
      returnValue = numberToBinary(value, 1);
      break;
    case 'numberToBinary2':
      returnValue = numberToBinary(value, 2);
      break;
    case 'numberToBinary3':
      returnValue = numberToBinary(value, 3);
      break;
    case 'numberToBinary4':
      returnValue = numberToBinary(value, 4);
      break;
    case 'numberToBinary5':
      returnValue = numberToBinary(value, 5);
      break;
    case 'numberToBinary6':
      returnValue = numberToBinary(value, 6);
      break;
    case 'numberToBinary7':
      returnValue = numberToBinary(value, 7);
      break;
    case 'numberToBinaryFE0':
      returnValue = numberToBinaryFE(value, 0);
      break;
    case 'numberToBinaryFE1':
      returnValue = numberToBinaryFE(value, 1);
      break;
    case 'numberToBinaryFE2':
      returnValue = numberToBinaryFE(value, 2);
      break;
    case 'numberToBinaryFE3':
      returnValue = numberToBinaryFE(value, 3);
      break;
    case 'numberToBinaryFE4':
      returnValue = numberToBinaryFE(value, 4);
      break;
    case 'numberToBinaryFE5':
      returnValue = numberToBinaryFE(value, 5);
      break;
    case 'numberToBinaryFE6':
      returnValue = numberToBinaryFE(value, 6);
      break;
    case 'numberToBinaryFE7':
      returnValue = numberToBinaryFE(value, 7);
      break;
    default:
      returnValue = round(value, precision);
  }
  return returnValue;
}

var displayFormula = function displayFormula(
  formula,
  multiplier,
  precision,
  context,
  valueKey,
  readingCurrent,
  readingLast,
  physical
) {
  // console.log({
  //   displayFormula_inputs: {
  //     formula,
  //     multiplier,
  //     context,
  //     valueKey,
  //     readingCurrent,
  //     readingLast,
  //     physical,
  //   },
  // });
  var returnValue = readingCurrent[valueKey];
  var multiplierValue = 1;
  if (multiplier) { multiplierValue = multiplier; }
  var precisionValue = 0;
  if (precision) { precisionValue = precision; }

  var formulaValue = formula;
  var formulaValueSecondary = '';
  if (formula.substr(formula.length - ('Rolling').length) === 'Rolling') {
    formulaValue = 'rolling';
    formulaValueSecondary = formula.substr(0, formula.length - ('Rolling').length);
  }

  switch (formulaValue) {
    case 'binLevel':
      returnValue = binLevel(
        readingCurrent['131'],
        readingLast['131'],
        physical.debounce,
        physical.powered,
        physical.bins
      );
      break;
    case 'pumpOutput':
      returnValue = pumpOutput(
        readingCurrent[valueKey],
        readingLast[valueKey],
        readingCurrent[132] || readingCurrent.date,
        readingLast[132] || readingLast.date,
        multiplierValue
      );
      break;
    case 'fuelLevel':
      var fuelTankSize = 3;
      if (physical && physical.fuelTankSize) {
        fuelTankSize = physical.fuelTankSize;
      }
      var fuelSensorRange = 6.56;
      if (physical && physical.fuelSensorRange) {
        fuelSensorRange = physical.fuelSensorRange;
      }
      returnValue = round(fuelLevel(
        readingCurrent[valueKey] / multiplierValue,
        fuelTankSize,
        fuelSensorRange
      ));
      break;
    case 'fourToTwenty':
      returnValue = fourToTwenty(
        readingCurrent[valueKey] / multiplierValue,
        physical.min || 0,
        physical.max || 100,
        physical.zero || 0,
        physical.precision || 0
      );
      break;
    case 'rpmToState':
      returnValue = rpmToState(
        readingCurrent[valueKey] / multiplierValue,
        physical.offRpm,
        physical.highRpm
      );
      break;
    case 'millisecondsPastExpectedConnection':
      returnValue = millisecondsPastExpectedConnection(
        readingCurrent.date,
        readingCurrent['135']
      );
      break;
    case 'rolling' :
      returnValue = valueCalculator(
        formulaValueSecondary,
        readingCurrent[valueKey] / multiplierValue,
        context,
        precisionValue
      );
      returnValue += valueCalculator(
        formulaValueSecondary,
        readingLast[valueKey] / multiplierValue,
        context,
        precisionValue
      );
      returnValue = (returnValue / 2);
      break;
    default:
      returnValue = valueCalculator(
        formula,
        readingCurrent[valueKey] / multiplierValue,
        context,
        precisionValue
      );
  }
  return returnValue;
};

module.exports = {
  round: round,
  isNumber: isNumber,
  voltToVWC: voltToVWC,
  percentToVWC: percentToVWC,
  analogToVWC: analogToVWC,
  percentToDigital: percentToDigital,
  analogToDigital: analogToDigital,
  percentToDigitalInverse: percentToDigitalInverse,
  analogToDigitalInverse: analogToDigitalInverse,
  voltToCentibar: voltToCentibar,
  gallonsToAcreFeet: gallonsToAcreFeet,
  percentToCentibar: percentToCentibar,
  analogToCentibar: analogToCentibar,
  numberMap: numberMap,
  valveStatus: valveStatus,
  valveStatusString: valveStatusString,
  cToF: cToF,
  fToC: fToC,
  fromC: fromC,
  fromCMultiplier: fromCMultiplier,
  toC: toC,
  valveTimeToEpoch: valveTimeToEpoch,
  valveTimeToEpochMillis: valveTimeToEpochMillis,
  valveTimeToDate: valveTimeToDate,
  nextValveTime: nextValveTime,
  nextValveTimeToEpochMillis: nextValveTimeToEpochMillis,
  toValveTime: toValveTime,
  secondsToHHMMSS: secondsToHHMMSS,
  percentTo20V: percentTo20V,
  fourToTwenty: fourToTwenty,
  metersPerSecondToMilesPerHour: metersPerSecondToMilesPerHour,
  millimetersToInches: millimetersToInches,
  kilometersToMiles: kilometersToMiles,
  kPaToInchesMercury: kPaToInchesMercury,
  windDirection: windDirection,
  fuelLevel: fuelLevel,
  ftToM: ftToM,
  mToFt: mToFt,
  spaceCamel: spaceCamel,
  pumpState: pumpState,
  rpmToState: rpmToState,
  rpmOrchardRite: rpmOrchardRite,
  flowMeterState: flowMeterState,
  pumpOutput: pumpOutput,
  binLevel: binLevel,
  chartDimensions: chartDimensions,
  displayFormula: displayFormula,
  cellSignalToRssi: cellSignalToRssi,
  cellSignalToQuality: cellSignalToQuality,
  numberToBinary: numberToBinary,
  numberToBinaryFE: numberToBinaryFE,
  windMachineChangeStatus: windMachineChangeStatus,
  windMachineCommunicationStatus: windMachineCommunicationStatus,
  windMachineEngineState: windMachineEngineState,
  windMachineMPC20ShutdownStatus: windMachineMPC20ShutdownStatus,
  windMachineMPC20WarningStatus: windMachineMPC20WarningStatus
};