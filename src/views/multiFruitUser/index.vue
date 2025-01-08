<template>
  <div class="multiFruitUser">
    <div class="searchBar">
      <div class="searchForm">
        <el-button type="primary" @click="handleSearch">刷新</el-button>
      </div>
      <div class="operateForm">

      </div>
    </div>
    <el-table
      stripe
      height="100%"
      size="mini"
      :data="tableData"
      style="width: 100%">
      <el-table-column prop="iosId" label="appleID"></el-table-column>
      <el-table-column prop="stage" label="阶段"></el-table-column>
      <el-table-column prop="node" label="节点"></el-table-column>
      <el-table-column prop="createTime" label="注册时间"></el-table-column>
      <el-table-column prop="updateTime" label="最后登录时间"></el-table-column>
    </el-table>
    <div class="pageContain">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchParams.pageNum"
        :page-size="searchParams.pageSize"
        :page-sizes="[100, 200, 300, 400]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getStageAdminList } from "@/api/multiFruitManagement";

export default {
  data() {
    return {
      searchParams: {
        pageNum: 1,
        pageSize: 100,
      },
      tableData: [],
      total: 0,
    }
  },
  created() {
    this.initTable();
  },
  methods: {
    initTable() {
      getStageAdminList(this.searchParams).then(res => {
        const {total, rows} = res;
        this.tableData = rows;
        this.total = total;
      })
    },
    handleSearch() {
      this.initTable();
    },
    handleSizeChange(v) {
      this.searchParams.pageNum = 1;
      this.searchParams.pageSize = v;
      this.initTable();
    },
    handleCurrentChange(v) {
      this.searchParams.pageNum = v;
      this.initTable();
    }
  }
}
</script>
<style lang="scss" scoped>
div.multiFruitUser {

  div.searchBar {
    height: 36px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    div.searchForm {
      display: flex;
      justify-content: start;
      align-items: center;

      div.name {
        width: 60px;
        margin-right: 5px;
        font-size: 14px;

        &:not(:first-child) {
          margin-left: 14px;
        }
      }

      .el-button {
        margin-left: 14px;
      }
    }

    div.operateForm {
      display: flex;
      justify-content: start;
      align-items: center;
    }
  }
}
</style>

