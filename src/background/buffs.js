(function () {
  var newBuff = function (id, level, endTime) {
    return {
      id: id,
      level: level,
      endTime: endTime
    };
  }
  var supportURL = 'http://gbf.game-a1.mbga.jp/assets_en/img/sp/assets/item/support/support_';
  var buffInfo = {
    '1': 20501,
    '2': 20401,
    '3': 20701,
    '4': 20801,
    '5': 10601,
    '6': 10301
  };

  var buffs = [];
  var buffTimers = [];
  // var $buffs = $('#buffs');
  // var $buffTimes = $buffs.find('.item-count');
  // var $buffIcons = $buffs.find('.item-img');
  window.Buffs = {
    Initialize: function () {
      Storage.Get(['buffs'], function (response) {
        if (response['buffs'] !== undefined) {
          buffs = response['buffs'];
          var updated = false;
          for (var i = 0; i < buffs.length; i++) {
            if (Date.now() < buffs[i].endTime) {
              startBuffTimer(buffs[i]);
            } else {
              buffs.splice(i, 1);
              i--;
              updated = true;
            }
          }
          if (updated) {
            saveBuffs();
          }
          for (var i = 0; i < 3; i++) {
            setBuff(i);
          }
        } else {
          Storage.Set('buffs', buffs);
        }
      });
    },
    InitializeDev: function () {
      var response = [];
      for (var i = 0; i < 3; i++) {
        response.push(getJquery('text', i));
        response.push(getJquery('image', i));
      }
      return response;
    },
    StartBuff: function (json, payload) {
      if (json.success) {
        var id = payload.support_id;
        var level = payload.support_level;
        var duration = parseInt(payload.support_time);
        var startTime = Date.now();
        var index = buffs.length;
        buffs.push(newBuff(id, level, startTime + duration * 3600000));
        startBuffTimer(buffs[index]);
        saveBuffs();
      }
    }

  };

  var setBuff = function (index) {
    Message.PostAll(getJquery('text', index));
    Message.PostAll(getJquery('image', index));
    //var id = '#buffs-' + index + '-';
    // if(buffs.length > index) {
    //   Message.PostAll({'setText':{
    //     'id': id + 'time',
    //     'value': Time.ParseTime(Math.abs(buffs[index].endTime - Date.now()), 'h').replace(',','')
    //   }});
    //   Message.PostAll({'setImage':{
    //     'id': id + 'image',
    //     'value': supportURL + buffInfo[buffs[index].id] + '_' + buffs[index].level + '.png'
    //   }});
    // } else {
    //   Message.PostAll({'setText':{
    //     'id': id + 'time',
    //     'value': ''
    //   }});
    //   Message.PostAll({'setImage':{
    //     'id': id + 'image',
    //     'value': '../../assets/images/icons/handtinytrans.gif'
    //   }});
    // }
  }

  var getJquery = function (type, index) {
    var id = '#buffs-' + index + '-';
    if (buffs.length > index) {
      if (type === 'text') {
        return {
          'setText': {
            'id': id + 'time',
            'value': Time.ParseTime(Math.abs(buffs[index].endTime - Date.now()), 'h').replace(',', '')
          }
        };
      } else if (type === 'image') {
        return {
          'setImage': {
            'id': id + 'image',
            'value': supportURL + buffInfo[buffs[index].id] + '_' + buffs[index].level + '.png'
          }
        };
      }
    } else {
      if (type === 'text') {
        return {
          'setText': {
            'id': id + 'time',
            'value': ''
          }
        };
      } else if (type === 'image') {
        return {
          'setImage': {
            'id': id + 'image',
            'value': '../../assets/images/icons/handtinytrans.gif'
          }
        };
      }
    }
  }

  var startBuffTimer = function (buff) {
    buffTimers.push(setInterval(function () {
      var index = buffs.indexOf(buff);
      if (Date.now() >= buff.endTime) {
        buffs.splice(index, 1);
        clearInterval(buffTimers[index]);
        buffTimers.splice(index, 1);
        for (var i = index; i < 3; i++) {
          setBuff(i);
        }
        saveBuffs();
      } else {
        setBuff(index);
      }
    }, 1000));
  }

  var saveBuffs = function () {
    Storage.Set('buffs', buffs);
  }

})();