(function () {
  var clocktimer = false;
  var date;
  var dailyReset = null;
  var weeklyReset = null;
  var monthlyReset = null;

  var isAssaultTime = false;
  var nextAssaultTime = null;
  var assaultTimes = [-1, -1];

  var isDefenseOrder = false;
  var nextDefenseOrder = null;

  var isAngelHalo = false;
  var nextAngelHalo = null;

  var timeZone;

  var anchiraSun = '#f8e5be';
  var anchiraAlert = '#ffd4e3';
  var nightSun = '#705d7f';
  var nightAlert = '#749d91';

  var time = {
    'daily': 0,
    'weekly': 0,
    'monthly': 0,
    'assault-0': -1,
    'assault-1': -1,
    'angel-active': false,
    'angel-time': null,
    'defense-active': false,
    'defense-time': null
  };

  var times = {
    'daily-time': null,
    'weekly-time': null,
    'monthly-time': null,
    'assault-time': null,
    'angel-time': null,
    'defense-time': null,
  };

  var jstTimes = {
    'time': null,
    'date': null,
    'daily-date': null,
    'weekly-date': null,
    'monthly-date': null,
    'assault-date-0': null,
    'assault-date-1': null,
    'angel-date': null,
    'defense-date': null
  };

  var normalTimes = {
    'time': null,
    'date': null,
    'daily-date': null,
    'weekly-date': null,
    'monthly-date': null,
    'assault-date-0': null,
    'assault-date-1': null,
    'angel-date': null,
    'defense-date': null
  };

  var isTimes = {
    'is-daily': false,
    'is-weekly': false,
    'is-monthly': false,
    'is-assault': false,
    'is-angel': false,
    'is-defense': false
  }

  window.Time = {
    Initialize: function (callback) {
      date = new Date();

      date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + 540);
      Storage.Get(['time'], function (response) { //['daily', 'weekly', 'monthly', 'assault', 'angel', 'defense'], function(response) {
        if (response['time'] !== undefined) {
          time = response['time'];
          dailyReset = new Date(time.daily);
          weeklyReset = new Date(time.weekly);
          monthlyReset = new Date(time.monthly);
          assaultTimes = [time['assault-0'], time['assault-1']];
          isAngelHalo = time['angel-active'];
          nextAngelHalo = new Date(time['angel-time']);
          isDefenseOrder = time['defense-active'];
          nextDefenseOrder = new Date(time['defense-time']);
        } else {
          Storage.Set(time);
          newDaily();
          newWeekly();
          newMonthly();
        }
        newAssaultTime();
        setAssaultTime();
        // if(response['daily'] !== undefined) {
        //   dailyReset = new Date(response['daily']);
        // } else {
        //   newDaily();
        // }
        // if(response['weekly'] !== undefined) {
        //   weeklyReset = new Date(response['weekly']);
        // } else {
        //   newWeekly();
        // }
        // if(response['monthly'] !== undefined) {
        //   monthlyReset = new Date(response['monthly']);
        // } else {
        //   newMonthly();
        // }
        // if(response['assault'] !== undefined) {
        //   assaultTimes = response['assault'];
        // }
        // if(response['angel'] !== undefined) {
        //   isAngelHalo = response['angel'].active;
        //   nextAngelHalo = new Date(response['angel'].time);
        // }
        // if(response['defense'] !== undefined) {
        //   isDefenseOrder = response['defense'].active;
        //   nextDefenseOrder = new Date(response['defense'].time);
        // }
        if (dailyReset !== null && weeklyReset !== null && monthlyReset !== null) {
          if (Date.parse(date) >= Date.parse(dailyReset)) {

            if (Date.parse(date) >= Date.parse(monthlyReset)) {
              Dailies.MonthlyReset();
              newMonthly();
            }
            if (Date.parse(date) >= Date.parse(weeklyReset)) {
              Dailies.WeeklyReset();
              newWeekly();
            }
            Dailies.Reset();
            newDaily();
          }
        }
        newDate();
        startClock();
        if (callback !== undefined) {
          callback();
        }
      });
    },
    InitializeDev: function () {
      var response = [];
      Object.keys(times).forEach(function (key) {
        response.push(getJquery(key));
      });
      Object.keys(jstTimes).forEach(function (key) {
        response.push(getJquery(key));
      });
      Object.keys(isTimes).forEach(function (key) {
        response.push(getJquery(key));
      });
      setTimeZone();
      return response;
    },
    SetAssaultTime: function (hours) {
      saveAssaultTime(hours);
      newAssaultTime();
    },
    SetDefenseOrder: function (minutes, active) {
      isDefenseOrder = active;
      if (active && minutes === -1) {
        if (nextDefenseOrder === null) {
          newDefenseTime(29);
        }
      } else {
        newDefenseTime(minutes);
      }
    },
    SetAngelHalo: function (delta, active) {
      isAngelHalo = active;
      newAngelTime(delta);
      setDate();
    },
    ParseTime: function (diff, unit) {
      str = "";
      var parse;
      var letters = ['d', 'h', 'm', 's'];
      var index = letters.indexOf(unit);
      if (index !== -1) {
        for (var i = index, count = 0; i < letters.length && count < 2; i++) {
          switch (letters[i]) {
            case 'd':
              parse = parseInt(diff / (1000 * 60 * 60 * 24));
              break;
            case 'h':
              parse = parseInt(diff / (1000 * 60 * 60)) % 24;
              break;
            case 'm':
              parse = parseInt(diff / (1000 * 60)) % 60;
              break;
            case 's':
              parse = parseInt((diff / 1000) % 60);
              break;
          }
          if (i < letters.length - 1 || count > 0 || parse > 0) {
            if (count > 0) {
              count++;
              str += parse + letters[i];
            } else {
              if (parse > 0 && i < letters.length - 1) {
                str += parse + letters[i] + ', ';
                count++;
              } else if (parse > 0 && i === letters.length - 1) {
                str += parse + letters[i];
              }
            }
          } else {
            str = '<1s';
          }
        }
      } else {
        str = "PARSETIME ERROR";
      }
      return str;
    },
    UpdateAlertColor() {
      Object.keys(isTimes).forEach(function (key) {
        Message.PostAll(getJquery(key));
      });
    }
  }

  var startClock = function () {
    clearInterval(clocktimer);
    clocktimer = setInterval(function () {
      date.setSeconds(date.getSeconds() + 1);
      checkNewDay();
      var now = Date.now() + (date.getTimezoneOffset() + 540) * 60000;
      if (date.getTime() - 100 <= now && date.getTime() + 100 >= now && (date.getMilliseconds() <= 100 || date.getMilliseconds() >= 900)) {
        setDate();
      } else {
        refreshClock();
      }
    }, 1000);
  }

  var refreshClock = function () {
    newDate();
    clearInterval(clocktimer);
    clocktimer = setTimeout(function () {
      date.setSeconds(date.getSeconds() + 1);
      checkNewDay();
      setDate();
      startClock();
    }, 1000 - date.getMilliseconds());
  }

  var newDate = function () {
    date = new Date();
    var curr = timeZone;
    var temp = /\((.*)\)/.exec(date.toString())[1].split(' ');
    timeZone = '';
    for (var i = 0; i < temp.length; i++) {
      timeZone += temp[i][0];
    }
    if (timeZone !== curr) {
      setTimeZone();
    }
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + 540);
    setDate();
  }

  var newDaily = function () {
    dailyReset = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 5, 0, 0, 0);
    if (date.getHours() >= 5) {
      dailyReset.setDate(date.getDate() + 1);
    }
    storeTime({
      'daily': Date.parse(dailyReset)
    });
    //Storage.Set('daily', Date.parse(dailyReset));
  }
  var newWeekly = function () {
    weeklyReset = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 5, 0, 0, 0);
    if (date.getDay() === 0) {
      weeklyReset.setDate(date.getDate() + 1);
    } else if (date.getDay() === 1 && date.getHours() < 5) {} else {
      weeklyReset.setDate(date.getDate() + (8 - date.getDay()));
    }
    storeTime({
      'weekly': Date.parse(weeklyReset)
    });
    //Storage.Set('weekly', Date.parse(weeklyReset));
  }
  var newMonthly = function () {
    if (date.getDate() === 1 && date.getHours() < 5) {
      monthlyReset = new Date(date.getFullYear(), date.getMonth(), 1, 5, 0, 0, 0);
    } else {
      monthlyReset = new Date(date.getFullYear(), date.getMonth() + 1, 1, 5, 0, 0, 0);
    }
    storeTime({
      'monthly': Date.parse(monthlyReset)
    });
  }
  var newAssaultTime = function () {
    var hour = date.getHours();
    if (hour >= assaultTimes[0] && hour < assaultTimes[0] + 1) {
      isAssaultTime = true;
      nextAssaultTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), assaultTimes[0] + 1, 0, 0, 0);
    } else if (hour >= assaultTimes[1] && hour < assaultTimes[1] + 1) {
      isAssaultTime = true;
      nextAssaultTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), assaultTimes[1] + 1, 0, 0, 0);
    } else {
      isAssaultTime = false;
      if (assaultTimes[1] === -1) {
        if (assaultTimes[0] === -1) {
          nextAssaultTime = null;
        } else {
          nextAssaultTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), assaultTimes[0], 0, 0, 0);
        }
      } else {
        if (hour < assaultTimes[0] && hour < assaultTimes[1]) {
          nextAssaultTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.min(assaultTimes[0], assaultTimes[1]), 0, 0, 0);
        } else if (hour > assaultTimes[0] && hour > assaultTimes[1]) {
          nextAssaultTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, Math.min(assaultTimes[0], assaultTimes[1]), 0, 0, 0);
        } else {
          nextAssaultTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.max(assaultTimes[0], assaultTimes[1]), 0, 0, 0);
        }
      }
    }
  }
  var newAngelTime = function (delta) {
    var tuples = {};
    if (delta !== -1) {
      nextAngelHalo = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + delta, 0, 0, 0);
      tuples['angel-active'] = isAngelHalo;
      tuples['angel-time'] = Date.parse(nextAngelHalo);
    } else {
      isAngelHalo = false;
      nextAngelHalo = null;
      tuples['angel-active'] = false;
      tuples['angel-time'] = null;
    }
    storeTime(tuples);
  }

  var checkAngelTime = function () {
    if (nextAngelHalo !== null && Date.parse(date) >= Date.parse(nextAngelHalo)) {
      if (!isAngelHalo && Date.parse(date) < Date.parse(nextAngelHalo) + 3600000) {
        isAngelHalo = true;
        newAngelTime(1);
        return true;
      } else {
        newAngelTime(-1);
      }
    }
    return false;
  }

  var newDefenseTime = function (delta) {
    var tuples = {};
    if (delta !== -1) {
      nextDefenseOrder = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() + delta, 59, 0);
      tuples['defense-active'] = isDefenseOrder;
      tuples['defense-time'] = Date.parse(nextDefenseOrder);
    } else {
      isDefenseOrder = false;
      nextDefenseOrder = null;
      tuples['defense-active'] = false;
      tuples['defense-time'] = null;
    }
  }

  var checkDefenseOrder = function () {
    if (nextDefenseOrder !== null && Date.parse(date) >= Date.parse(nextDefenseOrder)) {
      if (!isDefenseOrder && Date.parse(date) < Date.parse(nextDefenseOrder) + 1800000) {
        isDefenseOrder = true;
        newDefenseTime(29);
        return true;
      } else {
        newDefenseTime(-1);
      }
    }
    return false;
  }
  var checkNewDay = function () {
    if (Date.parse(date) >= Date.parse(nextAssaultTime) && Date.parse(date) < Date.parse(nextAssaultTime) + 3600000) {
      if (!isAssaultTime) {
        Message.Notify('Strike time has begun!', '', 'strikeTimeNotifications');
      }
      newAssaultTime();
    } else if (Date.parse(date) >= Date.parse(nextAssaultTime) + 3600000) {
      newAssaultTime();
    }
    if (checkAngelTime()) {
      Message.Notify('Angel Halo has begun!', '', 'angelHaloNotifications');
    }
    if (checkDefenseOrder()) {
      Message.Notify('Defense Order has begun!', '', 'defenseOrderNotifications');
    }
    if (Date.parse(date) >= Date.parse(dailyReset)) {
      if (Date.parse(date) >= Date.parse(monthlyReset) && Date.parse(date) >= Date.parse(weeklyReset)) {
        Dailies.WeeklyReset();
        Dailies.MonthlyReset();
        newWeekly();
        newMonthly();
        Message.Notify('Monthly and weekly reset!', '', 'dailyResetNotifications');
      } else if (Date.parse(date) >= Date.parse(monthlyReset)) {
        Dailies.MonthlyReset();
        newMonthly();
        Message.Notify('Monthly reset!', '', 'dailyResetNotifications');
      } else if (Date.parse(date) >= Date.parse(weeklyReset)) {
        Dailies.WeeklyReset();
        newWeekly();
        Message.Notify('Weekly reset!', '', 'dailyResetNotifications');
      } else {
        Message.Notify('Daily reset!', '', 'dailyResetNotifications');
      }
      Dailies.Reset();
      newDaily();
      newDate();
    }
  }

  var setDate = function () {
    var str = "";
    str = Time.ParseTime(Math.abs(dailyReset - date), 'h');
    setTime('daily-time', str);
    if (str.indexOf('h') === -1) {
      setTime('is-daily', true);
    } else if (str.indexOf('h') !== -1) {
      setTime('is-daily', false);
    }

    str = Time.ParseTime(Math.abs(weeklyReset - date), 'd');
    setTime('weekly-time', str);
    if (str.indexOf('d') === -1) {
      setTime('is-weekly', true);
    } else {
      setTime('is-weekly', false);
    }

    str = Time.ParseTime(Math.abs(monthlyReset - date), 'd');
    setTime('monthly-time', str);
    if (str.indexOf('d') === -1) {
      setTime('is-monthly', true);
    } else {
      setTime('is-monthly', false);
    }

    if (nextAssaultTime !== null) {
      if (isAssaultTime) {
        setTime('is-assault', true);
      } else {
        setTime('is-assault', false);
      }
      str = Time.ParseTime(Math.abs(nextAssaultTime - date), 'h');
      setTime('assault-time', str);
    } else {
      setTime('is-assault', false);
      setTime('assault-time', '???');
    }
    if (nextAngelHalo !== null) {
      if (isAngelHalo) {
        setTime('is-angel', true);
      } else {
        setTime('is-angel', false);
      }
      str = Time.ParseTime(Math.abs(nextAngelHalo - date), 'd');
      setTime('angel-time', str);
    } else {
      setTime('is-angel', false);
      setTime('angel-time', '???');
    }
    if (nextDefenseOrder !== null) {
      if (isDefenseOrder) {
        setTime('is-defense', true);
      } else {
        setTime('is-defense', false);
      }
      str = Time.ParseTime(Math.abs(nextDefenseOrder - date), 'h');
      setTime('defense-time', str);
    } else {
      setTime('is-defense', false);
      setTime('defense-time', '???');
    }

    var offset = -(date.getTimezoneOffset() + 540);
    str = "";
    var str2 = "";
    var str3 = "";
    var str4 = "";
    var array = date.toDateString().split(' ');
    for (var i = 0; i < array.length; i++) {
      if (i !== 3) {
        str += array[i] + ' ';
      }
    }
    str2 = (date.getHours() % 12 || 12) + ':';
    if (date.getMinutes() < 10) {
      str2 += '0';
    }
    str2 += date.getMinutes() + ':'
    if (date.getSeconds() < 10) {
      str2 += '0';
    }
    str2 += date.getSeconds() + ' ';
    if (date.getHours() <= 11) {
      str2 += 'AM';
    } else {
      str2 += 'PM';
    }
    date.setMinutes(date.getMinutes() + offset);
    array = date.toDateString().split(' ');
    for (var i = 0; i < array.length; i++) {
      if (i !== 3) {
        str3 += array[i] + ' ';
      }
    }
    str4 = (date.getHours() % 12 || 12) + ':';
    if (date.getMinutes() < 10) {
      str4 += '0';
    }
    str4 += date.getMinutes() + ':'
    if (date.getSeconds() < 10) {
      str4 += '0';
    }
    str4 += date.getSeconds() + ' ';
    if (date.getHours() <= 11) {
      str4 += 'AM';
    } else {
      str4 += 'PM';
    }
    date.setMinutes(date.getMinutes() - offset);
    setJSTNormal('date', str, str3);
    setJSTNormal('time', str2, str4);
    if (nextAngelHalo !== null) {
      str = parseDate(nextAngelHalo);
      nextAngelHalo.setMinutes(nextAngelHalo.getMinutes() + offset);
      str2 = parseDate(nextAngelHalo);
      nextAngelHalo.setMinutes(nextAngelHalo.getMinutes() - offset);
      setJSTNormal('angel-date', str, str2);
    } else {
      setJSTNormal('angel-date', '', '');
    }
    if (nextDefenseOrder !== null) {
      str = parseDate(nextDefenseOrder);
      nextDefenseOrder.setMinutes(nextDefenseOrder.getMinutes() + offset);
      str2 = parseDate(nextDefenseOrder);
      nextDefenseOrder.setMinutes(nextDefenseOrder.getMinutes() - offset);
      setJSTNormal('defense-date', str, str2);
    } else {
      setJSTNormal('defense-date', '', '');
    }
    str = parseDate(dailyReset);
    dailyReset.setMinutes(dailyReset.getMinutes() + offset);
    str2 = parseDate(dailyReset);
    dailyReset.setMinutes(dailyReset.getMinutes() - offset);
    setJSTNormal('daily-date', str, str2);
    str = parseDate(dailyReset);
    dailyReset.setMinutes(dailyReset.getMinutes() + offset);
    str2 = parseDate(dailyReset);
    dailyReset.setMinutes(dailyReset.getMinutes() - offset);
    setJSTNormal('weekly-date', str, str2);
    str = parseDate(monthlyReset);
    monthlyReset.setMinutes(monthlyReset.getMinutes() + offset);
    str2 = parseDate(monthlyReset);
    monthlyReset.setMinutes(monthlyReset.getMinutes() - offset);
    setJSTNormal('monthly-date', str, str2);
  }

  var setTime = function (category, value) {
    if (times[category] !== undefined && times[category] !== value) {
      times[category] = value;
      Message.PostAll(getJquery(category));
    } else if (isTimes[category] !== undefined && isTimes[category] !== value) {
      isTimes[category] = value;
      Message.PostAll(getJquery(category));
    }
  }

  var storeTime = function (tuples) {
    var updated = false;
    Object.keys(tuples).forEach(function (category) {
      if (time[category] !== tuples[category]) {
        updated = true;
        time[category] = tuples[category];
      }
    });
    if (updated) {
      Storage.Set('time', time);
    }
  }

  var setJSTNormal = function (category, jstValue, normalValue) {
    if (jstTimes[category] !== undefined && normalTimes[category] !== undefined && jstTimes[category] !== jstValue) {
      jstTimes[category] = jstValue;
      normalTimes[category] = normalValue;
      //console.log(jstValue + ' ' + normalValue);
      Message.PostAll(getJquery(category));
    }
  }

  var setTimeZone = function () {
    Message.PostAll({
      setTimeZone: timeZone
    });
  }

  var getJquery = function (category) {
    if (times[category] !== undefined) {
      return {
        setText: {
          'id': '#time-' + category,
          'value': times[category]
        }
      };
    } else if (jstTimes[category] !== undefined) {
      return {
        setTime: {
          'id': '#time-' + category,
          'jst': jstTimes[category],
          'normal': normalTimes[category]
        }
      };
    } else if (isTimes[category] !== undefined) {
      var alert = anchiraAlert;
      var sun = anchiraSun;
      var theme = Options.Get('windowTheme');
      if (theme === 'Tiamat Night') {
        alert = nightAlert;
        sun = nightSun;
      }
      if (isTimes[category] === true) {
        return {
          setColor: {
            'id': '#time-' + category,
            'value': alert //alert
          }
        };
      } else if (isTimes[category] === false) {
        return {
          setColor: {
            'id': '#time-' + category,
            'value': sun //sun
          }
        };
      }
    }
  }

  var parseDate = function (date) {
    if (date === null) {
      return '';
    }
    var array = date.toString().split(' ');
    var str = '';
    switch (array[1]) {
      case 'Jan':
        str += '1';
        break;
      case 'Feb':
        str += '2';
        break;
      case 'Mar':
        str += '3';
        break;
      case 'Apr':
        str += '4';
        break;
      case 'May':
        str += '5';
        break;
      case 'Jun':
        str += '6';
        break;
      case 'Jul':
        str += '7';
        break;
      case 'Aug':
        str += '8';
        break;
      case 'Sep':
        str += '9';
        break;
      case 'Oct':
        str += '10';
        break;
      case 'Nov':
        str += '11';
        break;
      case 'Dec':
        str += '12';
        break;
    }
    str += '/' + array[2] + ' ';
    var parse = parseInt(array[4][0] + array[4][1]);
    if (parse >= 1 && parse <= 11) {
      str += parse + 'AM';
    } else if (parse >= 13 && parse <= 23) {
      str += (parse - 12) + 'PM';
    } else if (parse === 0) {
      str += '12AM';
    } else {
      str += '12PM';
    }
    return str;
  }
  saveAssaultTime = function (hours) {
    var tuples = {};
    for (var i = 0; i < hours.length; i++) {
      assaultTimes[i] = hours[i];
      tuples['assault-' + i] = hours[i];
    }
    storeTime(tuples);
    //Storage.Set('assault', assaultTimes);


    setAssaultTime();
  }

  setAssaultTime = function () {
    for (var i = 0; i < assaultTimes.length; i++) {
      var str = '';
      var str2 = '';
      if (assaultTimes[i] !== -1) {
        var hour = assaultTimes[i];
        if (hour >= 1 && hour <= 11) {
          str += hour + 'AM';
        } else if (hour >= 13 && hour <= 23) {
          str += (hour - 12) + 'PM';
        } else if (hour === 0) {
          str += '12AM';
        } else {
          str += '12PM';
        }
        hour = assaultTimes[i] - (date.getTimezoneOffset() / 60 + 9);
        while (hour < 0) {
          hour += 24;
        }
        while (hour > 23) {
          hour -= 24;
        }
        if (hour >= 1 && hour <= 11) {
          str2 += hour + 'AM';
        } else if (hour >= 13 && hour <= 23) {
          str2 += (hour - 12) + 'PM';
        } else if (hour === 0) {
          str2 += '12AM';
        } else {
          str2 += '12PM';
        }
        setJSTNormal('assault-date-' + i, str, str2);
      }
    }
  }
})();