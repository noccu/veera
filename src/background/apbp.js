(function () {
  var currAP = 0;
  var maxAP = 0;
  var currBP = 0;
  var maxBP = 0;
  var apTime = {
    hour: 0,
    minute: 0,
    second: 0
  };
  var bpTime = {
    hour: 0,
    minute: 0,
    second: 0
  };
  var apTimer;
  var bpTimer;
  var availableRaids = {};
  var currRaids = {};
  var decAP = 0;
  var decBP = 0;
  var responseAP = [];

  window.APBP = {
    VerifyAPBP: function (json) {
      var status;
      if (json.status !== undefined) {
        status = json.status;
      } else if (json.mydata !== undefined) {
        status = json.mydata.status;
      } else if (json.option !== undefined) {
        if (json.option.mydata_assets !== undefined && json.option.mydata_assets.mydata !== undefined) {
          status = json.option.mydata_assets.mydata.status;
        } else if (json.option.user_status !== undefined) {
          status = json.option.user_status;
        }
      }
      if (status !== undefined) {
        setAP(status.now_action_point, status.max_action_point);
        setBP(status.now_battle_point, status.max_battle_point);
        if (status.action_point_remain.indexOf('00:00') === -1) {
          var index = status.action_point_remain.indexOf('h');
          var hour = apTime.hour;
          var minute = apTime.minute;
          if (index !== -1) {
            apTime.hour = Number(status.action_point_remain.substring(0, index));
          } else {
            bpTime.hour = 0;
          }
          if (status.action_point_remain.indexOf('m') !== -1) {
            apTime.minute = Number(status.action_point_remain.substring(index + 1, status.action_point_remain.length - 1));
          } else {
            apTime.minute = 0;
          }
          if (hour !== apTime.hour || minute !== apTime.minute) {
            apTime.second = 59;
            setAPTime();
            resetAPTimer();
          }
        } else {
          stopAPTimer();
        }
        if (status.battle_point_remain.indexOf('00:00') === -1) {
          index = status.battle_point_remain.indexOf('h');
          hour = bpTime.hour;
          minute = bpTime.minute;
          if (index !== -1) {
            bpTime.hour = Number(status.battle_point_remain.substring(0, index));
          } else {
            bpTime.hour = 0;
          }
          if (status.battle_point_remain.indexOf('m') !== -1) {
            bpTime.minute = Number(status.battle_point_remain.substring(index + 1, status.battle_point_remain.length - 1));
          } else {
            bpTime.minute = 0;
          }
          if (hour !== bpTime.hour || minute !== bpTime.minute) {
            bpTime.second = 59;
            setBPTime();
            resetBPTimer();
          }
        } else {
          stopBPTimer();
        }
      }
    },

    InitializeQuest: function (json) {
      decAP = json.action_point;
    },

    StartQuest: function (json, payload) {
      var id = payload.quest_id;
      if (id == 715571 || id == 715561 || id == 715551) {
        decAP = 50;
      } else if (id == 715541) {
        decAP = 30;
      } else if (id == 715531) {
        decAP = 25;
      } else if (id == 715521) {
        decAP = 15;
      } else if (id == 715511) {
        decAP = 10;
      }
      if (json.result !== undefined && json.result === 'ok') {
        spendAP(decAP);
        decAP = 0;
      }
      //715561 = dragon
      //715551
      //715541
      //715531
      //715571 = snowman 50ap
    },

    InitializeRaid: function (json) {
      availableRaids = {};
      var raid;
      for (var i = 0; i < json.assist_raids_data.length; i++) {
        raid = json.assist_raids_data[i];
        availableRaids[raid.raid.id] = {
          bp: raid.used_battle_point
        };
      }
    },
    InitializeRaidCode: function (json) {
      availableRaids = {};
      availableRaids[json.raid.id] = {
        bp: json.used_battle_point
      };
    },

    StartRaid: function (json, payload) {
      if (json.result !== false) {
        if (json.is_host === false) {
          spendBP(parseInt(payload.select_bp));
        }
        currRaids[json.raid_id] = availableRaids[json.raid_id];
      }
      availableRaids = {};
      decAP = 0;
    },

    ClearRaid: function (json, url) {

      // var index = url.indexOf('/check_reward/') + '/check_reward/'.length;
      // if(currRaids[index] !== null) {
      //   delete currRaids[index];
      // }
    },

    RestoreAPBP: function (json) {
      if (json.result !== undefined && json.result.recovery_str !== undefined) {
        if (json.result.recovery_str === "AP") {
          addAP(json.result.after - json.result.before);
        } else if (json.result.recovery_str === "EP") {
          addBP(json.result.after - json.result.before);
        }
      }
    },
    GetAP: function (response) {
      if (response !== undefined) {
        if (responseAP.indexOf(response) === -1) {
          responseAP.push(response);
        }
      }
      return currAP;
    },
    SetMax: function () {
      addAP(maxAP);
      addBP(maxBP);
    }
  }
  //   //COOP??
  //   if(request.request.url.indexOf('/room_quest_setting/') !== -1) {
  //   }

  var spendAP = function (amt) {
    var full;
    if (currAP >= maxAP) {
      full = true;
      setAP(currAP - amt, maxAP);
      if (currAP < maxAP) {
        amt = maxAP - currAP;
      } else {
        return;
      }
    } else {
      setAP(currAP - amt, maxAP);
    }
    if (currAP < maxAP) {
      apTime.minute += amt * 5 % 60;
      if (apTime.minute >= 60) {
        apTime.minute -= 60;
        apTime.hour++;
      }
      if (full) {
        apTime.minute--;
        if (apTime.minute < 0) {
          apTime.minute += 60;
          apTime.hour--;
        }
        apTime.second = 59;
      }
      apTime.hour += Math.floor(amt * 5 / 60);
      setAPTime();
      if (!apTimer) {
        resetAPTimer();
      }
    }
  }

  var addAP = function (amt) {
    setAP(currAP + amt, maxAP);
    if (currAP >= maxAP) {
      stopAPTimer();
    } else {
      apTime.minute -= amt * 5 % 60;
      if (apTime.minute < 0) {
        apTime.minute += 60;
        apTime.hour--;
      }
      apTime.hour -= Math.floor(amt * 5 / 60);
      setAPTime();
    }
  }

  var spendBP = function (amt) {
    var full = false;
    if (currBP >= maxBP) {
      full = true;
      setBP(currBP - amt, maxBP);
      if (currBP < maxBP) {
        amt = maxBP - currBP;
      } else {
        return;
      }
    } else {
      setBP(currBP - amt, maxBP);
    }
    if (currBP < maxBP) {
      bpTime.minute += amt * 10 % 60;
      if (bpTime.minute >= 60) {
        bpTime.minute -= 60;
        bpTime.hour++;
      }
      if (full) {
        bpTime.minute--;
        if (bpTime.minute < 0) {
          bpTime.minute += 60;
          bpTime.hour--;
        }
        bpTime.second = 59;
      }
      bpTime.hour += Math.floor(amt * 10 / 60);
      setBPTime();
      if (!bpTimer) {
        resetBPTimer();
      }
    }
  }

  var addBP = function (amt) {
    setBP(currBP + amt, maxBP);
    if (currBP >= maxBP) {
      stopBPTimer();
    } else {
      bpTime.minute -= amt * 10 % 60;
      if (bpTime.minute < 0) {
        bpTime.minute += 60;
        bpTime.hour--;
      }
      bpTime.hour -= Math.floor(amt * 10 / 60);
      setBPTime();
    }
  }

  var setAP = function (curr, max) {
    for (var i = 0; i < responseAP.length; i++) {
      responseAP[i](curr);
    }
    currAP = parseInt(curr);
    maxAP = parseInt(max);
    Message.PostAll({
      setText: {
        'id': '#ap-number',
        'value': 'AP: ' + currAP + '/' + maxAP
      }
    });
    Message.PostAll({
      setBar: {
        'id': '#ap-bar',
        'value': ((currAP / maxAP) * 100) + '%'
      }
    });
    // $apNumber.text('AP: ' + currAP + '/' + maxAP);
    // $apBar.css('width', ((currAP / maxAP) * 100) + '%');
  }

  var setBP = function (curr, max) {
    currBP = parseInt(curr);
    maxBP = parseInt(max);
    Message.PostAll({
      setText: {
        'id': '#bp-number',
        'value': 'EP: ' + currBP + '/' + maxBP
      }
    });
    Message.PostAll({
      setBar: {
        'id': '#bp-bar',
        'value': ((currBP / maxBP) * 100) + '%'
      }
    });
    // $bpNumber.text('EP: ' + currBP + '/' + maxBP);
    // $bpBar.each(function(index) {
    //   if(index >= currBP) {
    //     $(this).hide();
    //   } else {
    //     $(this).show();
    //   }
    // });
  }

  var setAPTime = function () {
    var str = "";
    if (apTime.hour > 0) {
      str += apTime.hour + ':';
      if (apTime.minute < 10) {
        str += '0'
      }
    }
    if (apTime.minute > 0 || (apTime.minute == 0 && apTime.hour > 0)) {
      str += apTime.minute + ':';
      if (apTime.second < 10) {
        str += '0';
      }
    }
    str += apTime.second;
    if (parseInt(str) <= 0) {
      str = "";
    }
    Message.PostAll({
      setText: {
        'id': '#ap-time',
        'value': str
      }
    });
    // $apTime.text(str);
  }
  var setBPTime = function () {
    var str = "";
    if (bpTime.hour > 0) {
      str += bpTime.hour + ':';
      if (bpTime.minute < 10) {
        str += '0'
      }
    }
    if (bpTime.minute > 0 || (bpTime.minute == 0 && bpTime.hour > 0)) {
      str += bpTime.minute + ':';
      if (bpTime.second < 10) {
        str += '0';
      }
    }
    str += bpTime.second;
    if (parseInt(str) <= 0) {
      str = "";
    }
    Message.PostAll({
      setText: {
        'id': '#bp-time',
        'value': str
      }
    });
    // $bpTime.text(str);
  }

  var resetAPTimer = function () {
    clearInterval(apTimer);
    apTimer = setInterval(function () {
      apTime.second--;
      if (apTime.second < 0) {
        apTime.minute--;
        if (apTime.minute < 0) {
          apTime.hour--;
          if (apTime.hour < 0) {
            stopAPTimer();
            setAP(currAP + 1, maxAP);
            setAPTime();
            Message.Notify('Your AP is full!', currAP + '/' + maxAP + ' AP\n' + currBP + '/' + maxBP + ' EP', 'apNotifications');
            return;
          }
          apTime.minute = 59;
        }
        var max = maxAP * 20;
        if ((apTime.minute % 10 === 4 || apTime.minute % 10 === 9) && !(apTime.hour === Math.floor((maxAP * 5 - 1) / 60) && apTime.minute === (maxAP * 5 - 1) % 60)) {
          setAP(currAP + 1, maxAP);
          // if(currAP == 50) {
          //   Message.Notify('You have 50 AP!', currAP + '/' + maxAP + ' AP\n' + currBP + '/' + maxBP + ' EP');
          // }
        }
        apTime.second = 59;
      }
      setAPTime();
    }, 1000);
  }

  var stopAPTimer = function () {
    apTime.second = 0;
    apTime.minute = 0;
    apTime.hour = 0;
    clearInterval(apTimer);
    apTimer = false;
    setAPTime();
  }

  var resetBPTimer = function () {
    clearInterval(bpTimer);
    bpTimer = setInterval(function () {
      bpTime.second--;
      if (bpTime.second < 0) {
        bpTime.minute--;
        if (bpTime.minute < 0) {
          bpTime.hour--;
          if (bpTime.hour < 0) {
            setBP(currBP + 1, maxBP);
            stopBPTimer();
            setBPTime();
            Message.Notify('Your EP is full!', currAP + '/' + maxAP + ' AP\n' + currBP + '/' + maxBP + ' EP', 'epNotifications');
            return;
          }
          bpTime.minute = 59;
        }
        if ((bpTime.minute === 19 || bpTime.minute === 39 || bpTime.minute === 59) && !(bpTime.hour === Math.floor((maxBP * 10 - 1) / 60) && bpTime.minute === (maxBP * 10 - 1) % 60)) {
          setBP(currBP + 1, maxBP);
        }
        bpTime.second = 59;
      }
      setBPTime();
    }, 1000);
  }
  var stopBPTimer = function () {
    bpTime.second = 0;
    bpTime.minute = 0;
    bpTime.hour = 0;
    clearInterval(bpTimer);
    bpTimer = false;
    setBPTime();
  }
})();