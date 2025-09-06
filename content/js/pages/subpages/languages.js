var _vue = new Vue({
  el: '#app',
  data: {
    'statusbarHeight': 0,
    'language': {},
    'request': {
      'from': APP.GLOBAL.queryString('from')
    },
    items: [
      {
        key: 'cn',
        icon: '/assets/images/languages/image1@1x.png',
        name: '中文'
      },
      {
        key: 'en',
        icon: '/assets/images/languages/image2@1x.png',
        name: 'English'
      },
      {
        key: 'ko',
        icon: '/assets/images/languages/image3@1x.png',
        name: '한국인'
      },
      {
        key: 'jp',
        icon: '/assets/images/languages/image4@1x.png',
        name: '日本語'
      },
      {
        key: 'de',
        icon: '/assets/images/languages/image5@1x.png',
        name: 'Deutsch'
      },
      {
        key: 'es',
        icon: '/assets/images/languages/image6@1x.png',
        name: 'Espanol'
      },
      {
        key: 'fr',
        icon: '/assets/images/languages/image7@1x.png',
        name: 'Francais'
      },
      {
        key: 'pt',
        icon: '/assets/images/languages/image8@1x.png',
        name: 'Portugues'
      },
      {
        key: 'th',
        icon: '/assets/images/languages/image9@1x.png',
        name: 'แบบไทย'
      }
    ]
},
  methods: {
      'selectLanguage': function (name) {
          LSE.switchLanguage(name);

          //if (!this.request.from) {
          //    var mainPage = plus.webview.getWebviewById('mainPage');
          //    if (mainPage != null) {
          //        mainPage.evalJS('pageScript.reloadLanguage()');
          //    }
          //}

          APP.GLOBAL.closeWindow();
      },
      'getLanguageById': function (id) {
          for (var i = 0; i < this.langList.length; i++) {
              if (this.langList[i].id == id) return this.langList[i];
          }

          return this.langList[0];
      },
      'changeLanguage': function () {
          LSE.install('language', function (lang) {
              Vue.set(_vue, 'language', lang);
          });
      }
  },
  created: function () {
      this.changeLanguage();
      if (APP.CONFIG.IS_RUNTIME) {
          this.statusbarHeight = plus.navigator.getStatusbarHeight();
      }
  }
});