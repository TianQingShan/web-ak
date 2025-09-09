/**
 * 这个文件用来定义页面使用到的公共组件
 * 方便后续项目使用工程化时好迁移
 */

Vue.component('custom-button', {
  props: {
    /** 文本 */
    text: {
      required: true,
      type: String
    },

    /** 高度 */
    height: {
      type: Number,
      required: false,
      default: 45
    },

    /**
     * 是否显示Loading
     * - (true) 显示
     * - (false) 不显示
     */
    loading: {
      default: false,
      type: Boolean,
      required: false
    }
  },
  methods: {
    click() {
      if (this.loading) return

      this.$emit('click')
    }
  },
  template: `
    <div
      class="CustomButton"
      @click="$emit('click')"
      :style="{ height: height + 'px' }">
      <van-loading v-if="loading" color="#fff" />
      <template v-else>{{ text }}</template>
    </div>
  `
})

Vue.component('top-back', {
  props: {
    title: {
      type: String,
      required: true
    },
    titleFontSize: {
      type: Number,
      required: false,
      default: 18
    },
    titleColor: {
      type: String,
      required: false,
      default: '#333'
    },
    bgColor: {
      type: String,
      required: false,
      default: '#fff'
    }
  },

  template: `
    <div class="TopBack" :style="{ backgroundColor: bgColor}">
      <div class="icon" @click="APP.GLOBAL.closeWindow"></div>
      <div class="title" :style="{ fontSize: titleFontSize + 'px', color: titleColor }">
        {{ title }}
      </div>
    </div>
  `
})

Vue.component('checkbox', {
  props: {
    /**
     * 是否选中
     * - (true) 选中
     * - (false) 未选中
     */
    checked: {
      default: false,
      type: Boolean,
      required: false
    }
  },
  template: `
    <div class="Checkbox" :class="{ checked }" />
  `
})

Vue.component('tab-bar', {
  props: {
    currentIndex: {
      default: 0,
      type: Number,
      required: true
    }
  },
  data: () => ({
    'menus': [{
      'index': 0,
      'text': '首頁',
      'default': 'iconhome',
      'active': 'iconhomefill',
      'url': 'home.html',
      'icon': '/assets/images/common/tabar-item-home.svg',
      'bgColor': 'rgba(173, 177, 255, 0.39)'
    }, {
      'index': 1,
      'text': 'AK交易',
      'default': 'iconpuke',
      'active': 'iconpuke_fill',
      'url': 'ace.list.html',
      'icon': '/assets/images/common/tabar-item-ak.svg',
      'bgColor': 'rgba(171, 211, 255, 0.39)'
    }, {
      'index': 2,
      'text': 'EP交易',
      'default': 'iconjiaoyi',
      'active': 'iconjiaoyi_fill',
      'url': 'ep.list.html',
      'icon': '/assets/images/common/tabar-item-ep.svg',
      'bgColor': 'rgba(255, 201, 149, 0.39)'
    }, {
      'index': 3,
      'text': '我的',
      'default': 'iconmy',
      'active': 'iconmyfill',
      'url': 'center.html',
      'icon': '/assets/images/common/tabar-item-my.svg',
      'bgColor': 'rgba(125, 241, 221, 0.39)'
    }],
  }),
  methods: {
    jump(item) {
      if (item.index === this.currentIndex) return

      window.location = item.url
    }
  },
  template: `
    <div id="bottom" class="panel pos van-hairline--top">
      <ul id="bottom-menus-items" class="menus clearfix">
        <li v-for="(item, index) in menus" v-bind:key="index" v-bind:class="{'active': currentIndex === item.index}" @click="jump(item)">
          <div class="img-box" :style="{backgroundColor: currentIndex === item.index ? item.bgColor : ''}"><img :src="item.icon"></div>
          <p class="menus-text" v-text="item.text"></p>
        </li>
      </ul>
    </div>
  `
})