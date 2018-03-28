(function () {
  var createItem = function (amount, updated) {
    return {
      amount: amount,
      updated: updated
    };
  }
  var casino = {
    updatedPages: [false, false],
    dailies: {
      '26': createItem(1, false),
      '31': createItem(1, false),
      '18': createItem(1, false),
      '19': createItem(1, false),
      '20': createItem(1, false),
      '21': createItem(1, false),
      '2': createItem(1, false),
      '5': createItem(10, false),
    },
    monthlies: {
      '20013': createItem(5, false),
      '20003': createItem(5, false),
      '1039900000': createItem(20, false),
      '1029900000': createItem(50, false),
      '2': createItem(100, false),
      '5': createItem(200, false),
    }
  }
  var casinoData = {
    dailies: {
      '26': 1,
      '31': 1,
      '18': 1,
      '19': 1,
      '20': 1,
      '21': 1,
      '2': 5,
      '5': 10
    },
    monthlies: {
      '20013': 5,
      '20003': 5,
      '1039900000': 20,
      '1029900000': 50,
      '2': 100,
      '5': 200
    }
  }
  window.Casino = {
    Initialize: function (callback) {
      Storage.Get(['casino'], function (response) {
        if (response['casino'] !== undefined) {
          casino = response['casino'];
        } else {
          Storage.Set('casino', casino);
        }
        if (callback !== undefined) {
          callback();
        }
      });

    },
    InitializeDev: function () {
      var response = [];
      Object.keys(casino.dailies).forEach(function (key) {
        response.push(getJquery('dailies', key));
      });
      Object.keys(casino.monthlies).forEach(function (key) {
        response.push(getJquery('monthlies', key));
      });
      response.push(checkCollapse('dailies'));
      response.push(checkCollapse('monthlies'));
      return response;
    },
    Reset: function () {
      var tuples = {};
      Object.keys(casino.dailies).forEach(function (key) {
        if ((key === '2' || key === '5') && casino.monthlies[key].amount < casinoData.dailies[key]) {
          tuples[key] = casino.monthlies[key].amount;
        } else {
          tuples[key] = casinoData.dailies[key];
        }
      });
      setCasino(tuples, {}, [false, false]);
      resetUpdated();
    },
    MonthlyReset: function () {
      var tuples = {};
      Object.keys(casino.monthlies).forEach(function (key) {
        tuples[key] = casinoData.monthlies[key];
      });
      setCasino({}, tuples, [false, false]);
    },
    SetCasino1: function (json) {
      var list = json.list;
      var id;
      var dailies = {};
      var monthlies = {};
      for (var i = 0; i < list.length; i++) {
        id = list[i].item_ids[0];
        if (casino.dailies[id] !== undefined) {
          dailies[id] = parseInt(list[i].remain_number);
        }
        if (casino.monthlies[id] !== undefined) {
          monthlies[id] = parseInt(list[i].max_remain.number);
        }
      }
      setCasino(dailies, monthlies, [true, casino.updatedPages[1]]);
      if (json.next === 1 || (casino.updatedPages[0] && casino.updatedPages[1])) {
        checkUpdated();
      }
    },
    SetCasino2: function (json) {
      var list = json.list;
      var shittyIndex;
      var id;
      var dailies = {};
      var monthlies = {};
      for (var i = 10; i < json.count; i++) {
        shittyIndex = "" + i;
        id = list[shittyIndex].item_ids[0];
        if (casino.dailies[id] !== undefined) {
          dailies[id] = parseInt(list[i].remain_number);
        }
        if (casino.monthlies[id] !== undefined) {
          monthlies[id] = parseInt(list[i].max_remain.number);
        }
      }
      setCasino(dailies, monthlies, [casino.updatedPages[0], true]);
      if (json.next === 2 && casino.updatedPages[0] && casino.updatedPages[1]) {
        checkUpdated();
      }
    },
    BuyCasino: function (json, payload) {
      var id = json.article.item_ids[0];
      var dailies = {};
      var monthlies = {};
      if (casino.dailies[id] !== undefined) {
        dailies[id] = casino.dailies[id].amount - parseInt(payload.num);
      }
      if (casino.monthlies[id] !== undefined) {
        monthlies[id] = casino.monthlies[id].amount - parseInt(payload.num);
      }
      setCasino(dailies, monthlies);
      // var id = json.article.name;
      // if(id === 'Half Elixir' || id === 'Soul Berry') {
      //   remainingMonthlyItems[id] -= remainingDailyItems[id];
      //   if(remainingMonthlyItems[id] < 0) {
      //     remainingMonthlyItems[id] = 0;
      //   }
      // } else if(remainingMonthlyItems[id] !== undefined) {
      //   remainingMonthlyItems[id] = 0;
      // }
      // if(remainingDailyItems[id] !== undefined) {
      //   remainingDailyItems[id] = 0;
      // }
    }
  }
  var setCasino = function (dailies, monthlies, updatedPages) {
    var updated = false;
    if (updatedPages !== undefined) {
      for (var i = 0; i < updatedPages.length; i++) {
        if (casino.updatedPages[i] !== updatedPages[i]) {
          casino.updatedPages[i] = updatedPages[i];
          updated = true;
        }
      }
    }
    Object.keys(dailies).forEach(function (key) {
      casino.dailies[key].updated = true;
      if (casino.dailies[key].amount !== dailies[key]) {
        casino.dailies[key].amount = dailies[key];
        Message.PostAll(getJquery('dailies', key));
        Message.PostAll(checkCollapse('dailies'));
        updated = true;
      }
    });
    Object.keys(monthlies).forEach(function (key) {
      casino.monthlies[key].updated = true;
      if (casino.monthlies[key].amount !== monthlies[key]) {
        casino.monthlies[key].amount = monthlies[key];
        Message.PostAll(getJquery('monthlies', key));
        Message.PostAll(checkCollapse('monthlies'));
        updated = true;
      }
    });
    //console.log(JSON.stringify(casino));
    if (updated) {
      Storage.Set('casino', casino);
    }
  }

  var checkCollapse = function (type) {
    var collapse = true;
    var keys = Object.keys(casino[type]);
    for (var i = 0; i < keys.length; i++) {
      if (casino[type][keys[i]].amount !== 0) {
        collapse = false;
      }
    }
    return {
      'collapsePanel': {
        'id': '#collapse-casino-' + type,
        'value': collapse
      }
    };
  }

  var getJquery = function (type, key) {
    var id = '#casino-' + type + '-' + key;
    return {
      'setText': {
        'id': '#casino-' + type + '-' + key,
        'value': casino[type][key].amount + '/' + casinoData[type][key]
      }
    };
  }

  var resetUpdated = function () {
    Object.keys(casino.dailies).forEach(function (key) {
      casino.dailies[key].updated = false;
    });
    Object.keys(casino.monthlies).forEach(function (key) {
      casino.monthlies[key].updated = false;
    });
    Storage.Set('casino', casino);
  }

  var checkUpdated = function () {
    var dailies = {};
    var monthlies = {};
    Object.keys(casino.dailies).forEach(function (key) {
      if (!casino.dailies[key].updated) {
        dailies[key] = 0;
      }
    });
    Object.keys(casino.monthlies).forEach(function (key) {
      if (!casino.monthlies[key].updated) {
        monthlies[key] = 0;
      }
    });
    setCasino(dailies, monthlies, [false, false]);
  }

})();