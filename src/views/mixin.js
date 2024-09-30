export default {
  data() {
    return {
      userTypeOption: [
        { value: "001", label: "新注册用户" },
        { value: "002", label: "老用户" },
        { value: "003", label: "付费用户" },
      ]
    }
  },
  methods: {
    authorityToName(authority) {
      const authorityList = authority.split(',');
      const authorityNameList = authorityList.map(value => {
        return this.userTypeOption.filter(item => item.value === value)[0].label
      })
      return authorityNameList.join(",");
    }
  }
}
