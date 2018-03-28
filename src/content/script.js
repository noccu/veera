(function () {
  $(window).on('beforeunload', function () {
    chrome.runtime.sendMessage({
      refresh: true
    });
  });
  var tempImageURLS = {};

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.pageLoad) {
      pageLoad(message.pageLoad);
    }
    if (message.selectQuest) {
      $('.prt-list-contents').each(function (index) {
        tempImageURLS[$(this).find('.txt-quest-title').first().text()] = $(this).find('.img-quest').first().attr('src');
      });
    }
    if (message.startQuest) {
      if (tempImageURLS[message.startQuest.name] !== undefined) {
        sendResponse(tempImageURLS[message.startQuest.name]);
      } else {
        sendResponse(null);
      }
    }
    if (message.checkRaids) {
      list = $('#prt-multi-list');
      raids = [];
      list.find('.btn-multi-raid').each(function (index) {
        if ($(this).find('.ico-enter').length > 0) {
          raids.push({
            id: "" + $(this).data('raid-id'),
            name: $(this).data('chapter-name'),
            imgURL: $(this).find('.img-raid-thumbnail').first().attr('src'),
            host: ($(this).find('.txt-request-name').text() === "You started this raid battle.")
          });
        }
      });
      var unclaimed = false;
      if ($('.btn-unclaimed').length > 0) {
        unclaimed = true;
      }
      var type;
      if ($('#tab-multi').hasClass('active')) {
        type = 'normal';
      } else {
        type = 'event';
      }
      messageDevTools({
        checkRaids: {
          'raids': raids,
          'unclaimed': unclaimed,
          'type': type
        }
      });
    }
  });

  var pageLoad = function (url) {
    if (url.indexOf('#guild') !== -1) {
      if ($('.prt-assault-guildinfo').length > 0) {
        times = [];
        $('.prt-assault-guildinfo').find('.prt-item-status').each(function (index) {
          var text = $(this).text();
          var hour = parseInt(text.split(':')[0]);
          if (text.indexOf('p.m.') !== -1 && text.indexOf('p.m') < text.length - 5) {
            if (hour !== 12) {
              hour += 12;
            }
          } else if (hour === 12) {
            hour = 0;
          }
          times[index] = hour;
        });
        messageDevTools({
          assault: {
            'times': times
          }
        });
      }
    } else if (url.indexOf('#mypage') !== -1) {
      if ($('.txt-do-remain-on-button').length !== 0) {
        messageDevTools({
          defense: {
            'time': parseInt($('.txt-do-remain-on-button').text()),
            'active': false
          }
        });
      } else if ($('.do-underway').length !== 0) {
        messageDevTools({
          defense: {
            'time': -1,
            'active': true
          }
        });
      } else {
        messageDevTools({
          defense: {
            'time': -1,
            'active': false
          }
        });
      }
      // disgusting
      messageDevTools({
        profile: {
          'rank': $('div.prt-user-info > div.prt-info-status > div.prt-info-rank > div.prt-rank > div.txt-rank-value').attr('title'),
          'rankPercent': $('div.prt-user-info > div.prt-info-status > div.prt-info-rank > div.prt-rank-gauge > div').attr('style'),
          'job': $('div.prt-info-status > div.prt-info-job > div.prt-job > div.txt-joblv-value.master').attr('title'),
          'jobPercent': $('div.prt-user-info > div.prt-info-status > div.prt-info-job > div.prt-job-gauge').attr('style'),
          'jobPoints': $('div.prt-user-info > div:nth-child(4) > div.prt-jp').text(),
          'renown': $('#mbp-status > div.prt-mbp-box > span.txt-current-point').text(),
          'prestige': $('#mbp-status > div.prt-hmbp-box > span.txt-current-point').text(),
          'crystal': $('div.prt-user-info > div:nth-child(4) > div.prt-stone').text(),
          'lupi': $('div.prt-user-info > div:nth-child(4) > div.prt-lupi').text(),
          'arcaB': $('#arcarum-status > div.prt-arcarum-passport-box').text().split('/')[0],
          'arcaP': $('#arcarum-status > div.prt-arcarum-point-box').text().split('/')[0]
        }
      });
    } else if (url.indexOf('#coopraid/room/') !== -1) {
      messageDevTools({
        coopCode: $('.txt-room-id').eq(0).text()
      });
    } else if (url.indexOf('#casino') !== -1) {
      var amt = parseInt($('.prt-having-medal').children('.txt-value').first().attr('value'));
      if (!isNaN(amt)) {
        messageDevTools({
          chips: {
            'amount': amt
          }
        });
      }
    } else if (url.indexOf('#profile') !== -1) {} else if (url.indexOf('#quest/index') !== -1) {
      $('.prt-quest-index').first().bind("DOMSubtreeModified", function () {
        if ($('.btn-recommend.visible').length !== 0) {
          $('.prt-quest-detail').each(function () {
            if ($(this).find('.txt-quest-title').text() === 'Angel Halo') {
              var time = $(this).find('.prt-remain-time');
              if (time.length !== 0 && time.text().indexOf('Starts') !== -1) {
                var num = time.first().text();
                if (num.indexOf('hour') !== -1) {
                  messageDevTools({
                    angel: {
                      'delta': parseInt(num.substring(10, num.indexOf(' hour'))) + 1,
                      'active': false
                    }
                  });
                } else if (num.indexOf('minutes') !== -1) {
                  messageDevTools({
                    angel: {
                      'delta': 1,
                      'active': false
                    }
                  });
                }
              } else {
                messageDevTools({
                  angel: {
                    'delta': 1,
                    'active': true
                  }
                });
              }
            }
          });
        }
      });
    } else if (url.indexOf('#quest/assist') !== -1) {
      if ($('.btn-unclaimed').length > 0) {

      }
    }
  }

  var messageDevTools = function (message) {
    chrome.runtime.sendMessage({
      content: message
    });
  }

  var consoleLog = function (sender, message) {
    chrome.runtime.sendMessage({
      consoleLog: {
        'sender': sender,
        'message': message
      }
    });
  }


})();