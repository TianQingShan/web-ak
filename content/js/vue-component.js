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
    }
  },

  template: `
    <div class="TopBack">
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