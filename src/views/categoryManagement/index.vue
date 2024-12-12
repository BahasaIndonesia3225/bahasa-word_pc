<template>
  <div class="categoryManagement">
    <div class="searchBar">
      <div class="searchForm">
        <div class="name">类别名称</div>
        <el-input
          v-model="searchParams.name"
          placeholder="请输入类别名称"
          clearable>
        </el-input>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </div>
      <el-button type="primary" @click="handleNewItem">新增</el-button>
    </div>
    <el-table
      stripe
      height="100%"
      size="mini"
      border
      row-key="id"
      ref="listTable"
      :data="tableData"
      style="width: 100%">
      <el-table-column label="" width="80" align="center">
        <template slot-scope="{ row }">
          <i class="el-icon-rank allowDrag" style="cursor:pointer"></i>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="类型名称"></el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>
      <el-table-column label="权限">
        <template slot-scope="scope">
          <span>{{ authorityToName(scope.row.authority) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="total" label="数量"></el-table-column>
      <el-table-column width="140" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEditItem(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleDeleteItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
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
    <el-dialog
      :title="categoryInfoForm.id ? '编辑类型' : '新增类型'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="600px">
      <el-form
        ref="form"
        :model="categoryInfoForm"
        :rules="categoryInfoRules"
        label-width="80px">
        <el-form-item label="类型名称" prop="name">
          <el-input v-model="categoryInfoForm.name"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            style="width: 100%"
            v-model="categoryInfoForm.sort"
            :min="1"
            :step="1"
            :step-strictly="true">
          </el-input-number>
        </el-form-item>
        <el-form-item label="权限" prop="authority">
          <el-select
            style="width: 100%"
            v-model="categoryInfoForm.authority"
            placeholder="请选择权限"
            multiple>
            <el-option
              v-for="item in userTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Sortable from 'sortablejs'
import { getCategoryManagement, newCategoryManagement, deleteCategoryManagement, checkCategoryManagement, editCategoryManagement } from "@/api/categoryManagement"
import mixin from '@/views/mixin'
export default {
  mixins: [mixin],
  data() {
    return {
      tableData: [],
      total: 0,
      searchParams: {
        name: "",
        authority: "",
        pageNum: 1,
        pageSize: 100,
      },
      dialogVisible: false,
      categoryInfoForm: {
        id: "",
        name: "",
        sort: "",
        authority: [],
      },
      categoryInfoRules: {
        name: [
          { required: true, message: '请输入类型名称', trigger: 'blur' },
        ],
        authority: [
          { required: true, message: '请选择权限', trigger: 'blur' },
        ],
      }
    }
  },
  mounted() {
    this.initTable();
  },
  methods: {
    initTable() {
      getCategoryManagement(this.searchParams).then(res => {
        const { total, rows } = res;
        this.tableData = rows;
        this.total = total;
        this.rowDrop();
      })
    },
    //行拖拽,排序方法
    rowDrop() {
      const el = this.$refs.listTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        animation: 150,
        ghostClass: "ghostClass",
        handle: ".allowDrag",//设置操作区域
        onEnd: evt => {
          const { oldIndex, newIndex } = evt;
          const targetRow = this.tableData.splice(evt.oldIndex, 1)[0];
          this.tableData.splice(evt.newIndex, 0, targetRow);
        }
      });
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
    },
    handleDeleteItem(data) {
      this.$prompt('确定删除该类型？请输入安全码校验。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^HATI-HATI$/,
        inputErrorMessage: '请输入正确格式的安全校验码！'
      }).then(({ value }) => {
        const { id } = data;
        deleteCategoryManagement(id).then(res => {
          this.initTable();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleNewItem() {
      this.dialogVisible = true;
      this.$refs["form"] && this.$refs["form"].resetFields();
      this.categoryInfoForm.id = "";
    },
    handleEditItem(data) {
      const { id } = data;
      checkCategoryManagement(id).then(res => {
        const { id, name, sort, authority } = res.data;
        this.categoryInfoForm = {
          id,
          name,
          sort,
          authority: authority.split(',')
        };
        this.dialogVisible = true;
      })
    },
    cancelForm() {
      this.$refs["form"].resetFields();
      this.dialogVisible = false;
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if(this.categoryInfoForm.id) {
            let params = { ...this.categoryInfoForm };
            params.authority = params.authority.join(",")
            editCategoryManagement(params).then(res => {
              this.cancelForm();
              this.initTable();
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
            })
          }else {
            let params = { ...this.categoryInfoForm };
            params.authority = params.authority.join(",")
            newCategoryManagement(params).then(res => {
              this.cancelForm();
              this.initTable();
              this.$message({
                type: 'success',
                message: '新增成功!'
              });
            })
          }
        }
      });
    },
  }
}
</script>
<style lang="scss" scoped>
div.categoryManagement {
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
      .el-input, .el-select {
        width: 180px;
      }
      .el-button {
        margin-left: 14px;
      }
    }
  }
  .allowDrag {
    font-size: 20px;
  }
}
</style>
