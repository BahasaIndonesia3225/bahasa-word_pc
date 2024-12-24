<template>
  <div class="multiFruit">
    <el-table
      stripe
      height="100%"
      size="mini"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="themeColor"
        label="主题色">
        <template slot-scope="scope">
          <div class="itemColor" :style="{background: scope.row.themeColor}"></div>
        </template>
      </el-table-column>
      <el-table-column label="题目数量">
        <template slot-scope="scope">
          <span>{{scope.row.subjectList.length}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import jsonData from './jsonData.json';
export default {
  data() {
    return {
      tableData: jsonData,
      total: jsonData.length,
    }
  },
  created() {
    this.initTable();
  },
  methods: {
    initTable() {

    }
  }
}
</script>
<style lang="scss" scoped>
div.multiFruit {
  div.itemColor {
    width: 46px;
    height: 23px;
  }
}
</style>

