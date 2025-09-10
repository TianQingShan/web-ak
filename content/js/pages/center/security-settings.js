const ITEM_KEY = {
  /** Google验证 */
  GoogleVerification: Symbol(),
  /** 投诉 */
  Complaint: Symbol(),
  /** 登录密码 */
  LoginPassword: Symbol(),
  /** 交易密码 */
  TransactionPassword: Symbol(),
  /** 重置助记词 */
  ResetRecoveryPhrase: Symbol(),
  /** 荣耀历程 */
  GloryJourney: Symbol(),
  /** 退出登录 */
  LogOut: Symbol(),
}

var _vue = new Vue({
  el: '#app',
  data: () => ({
    items: [
      {
        key: ITEM_KEY.GoogleVerification,
        icon: '/assets/svg/icon9.svg',
        text: 'Google验证',
        iconBoxLinearGradient: 'linear-gradient(180deg, rgba(238, 238, 238, 1), rgba(238, 238, 238, 1))',
        iconWidth: 20,
      },
      {
        key: ITEM_KEY.Complaint,
        icon: '/assets/svg/icon10.svg',
        text: '投诉',
        iconBoxLinearGradient: 'linear-gradient(180deg, rgba(255, 121, 116, 1), rgba(255, 82, 95, 1))',
        iconWidth: 24
      },
      {
        key: ITEM_KEY.LoginPassword,
        icon: '/assets/svg/icon11.svg',
        text: '登录密码',
        iconBoxLinearGradient: 'linear-gradient(180deg, rgba(105, 173, 255, 1), rgba(54, 114, 255, 1))',
        iconWidth: 16
      },
      {
        key: ITEM_KEY.TransactionPassword,
        icon: '/assets/svg/icon12.svg',
        text: '交易密码',
        iconBoxLinearGradient: 'linear-gradient(180deg, rgba(255, 176, 0, 1), rgba(255, 147, 0, 1))',
        iconWidth: 16
      },
      {
        key: ITEM_KEY.ResetRecoveryPhrase,
        icon: '/assets/svg/icon13.svg',
        text: '重置助记词',
        iconBoxLinearGradient: 'linear-gradient(180deg, rgba(205, 163, 255, 1), rgba(139, 119, 255, 1))',
        iconWidth: 20
      },
      {
        key: ITEM_KEY.GloryJourney,
        icon: '/assets/svg/icon14.svg',
        text: '荣耀历程',
        iconBoxLinearGradient: 'linear-gradient(180deg, rgba(254, 235, 86, 1), rgba(255, 191, 0, 1))',
        iconWidth: 16
      },
      {
        key: ITEM_KEY.LogOut,
        icon: '/assets/svg/icon15.svg',
        text: '退出登录',
        iconBoxLinearGradient: 'linear-gradient(180deg, rgba(135, 255, 189, 1), rgba(17, 207, 74, 1))',
        iconWidth: 17
      }
    ]
  }),
  methods: {
    handleItemClick(key) {
      switch (key) {
        case ITEM_KEY.GoogleVerification:
          APP.GLOBAL.gotoNewWindow('activation.codePage', '../center/google/activation.code')
        break
        case ITEM_KEY.Complaint:
          APP.GLOBAL.gotoNewWindow('my.complaintPage', '../center/my.complaint')
        break
        case ITEM_KEY.LoginPassword:
          APP.GLOBAL.gotoNewWindow('change.passwordPage', '../center/security/change.password')
        break
        case ITEM_KEY.TransactionPassword:
          APP.GLOBAL.gotoNewWindow('change.pinPage', '../center/security/change.pin')
        break
        case ITEM_KEY.ResetRecoveryPhrase:
          APP.GLOBAL.gotoNewWindow('change.pinPage', '../center/security/reset.mnemonic')
        break
        case ITEM_KEY.GloryJourney:
          // isupgradePassowrdShow = true
        break
        case ITEM_KEY.LogOut:
          // 退出登录
        break
        default:
          const never = key
          return never
      }
    }
  }
})