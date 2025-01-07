<template>
  <div class="multiFruit">
    <div class="searchBar">
      <div class="searchForm">
        <div class="name">阶段名称</div>
        <el-input
          v-model="searchParams.name"
          placeholder="请输入阶段名称"
          clearable>
        </el-input>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </div>
      <div class="operateForm">
        <el-button type="primary" @click="handleNewItem">新增</el-button>
      </div>
    </div>
    <el-table
      stripe
      height="100%"
      size="mini"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        width="100"
        prop="stage"
        label="所属顺序">
      </el-table-column>
      <el-table-column
        prop="name"
        label="阶段名称">
        <template slot-scope="scope">
          <el-button @click="handleCheckDetail(scope.row)" type="text">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="introduce"
        label="阶段描述">
      </el-table-column>
      <el-table-column
        prop="pic"
        label="阶段主图">
        <template slot-scope="scope">
          <el-image
            style="width: 48px; height: 48px"
            :src="scope.row.pic"
            :preview-src-list="[scope.row.pic]"
            fit="contain"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="colour"
        label="主题色">
        <template slot-scope="scope">
          <div
            class="colourCard"
            :style="{background: scope.row.colour}">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
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
      :title="wordInfoForm.id ? '编辑阶段' : '新增阶段'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="600px">
      <el-form
        ref="form"
        :model="wordInfoForm"
        :rules="wordInfoRules"
        label-width="80px">
        <el-form-item label="阶段名称" prop="name">
          <el-input style="width: 100%" v-model="wordInfoForm.name"></el-input>
        </el-form-item>
        <el-form-item label="阶段描述" prop="introduce">
          <el-input
            style="width: 100%"
            type="textarea"
            :rows="3"
            :maxlength="100"
            show-word-limit
            placeholder="请输入阶段描述"
            v-model="wordInfoForm.introduce">
          </el-input>
        </el-form-item>
        <el-form-item label="阶段主图" prop="pic">
          <el-input style="width: 100%" v-model="wordInfoForm.pic"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属阶段" prop="stage">
              <el-input-number
                style="width: 100%"
                v-model="wordInfoForm.stage"
                :min="1"
                :step="1"
                :step-strictly="true">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主题色" prop="colour">
              <el-color-picker
                style="width: 100%"
                v-model="wordInfoForm.colour">
              </el-color-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getStageAdmin, newStageAdmin, deleteStageAdmin, editStageAdmin, checkStageAdmin } from "@/api/multiFruitManagement"
import {getToken} from "@/utils/auth";

export default {
  data() {
    return {
      tableData: [],
      total: 0,
      searchParams: {
        name: ""
      },
      //新增相关
      dialogVisible: false,
      wordInfoForm: {
        id: "",
        name: "",
        introduce: "",
        pic: "",
        stage: "",
        colour: ""
      },
      wordInfoRules: {
        name: [
          { required: true, message: '请输入阶段名称', trigger: 'blur' },
        ],
        introduce: [
          { required: true, message: '请输入阶段描述', trigger: 'blur' },
        ],
        pic: [
          { required: true, message: '请输入阶段主图', trigger: 'blur' },
        ],
        stage: [
          { required: true, message: '请输入所属阶段', trigger: 'blur' },
        ],
        colour: [
          { required: true, message: '请输入主题色', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.initTable();
  },
  methods: {
    initTable() {
      getStageAdmin(this.searchParams).then(res => {
        const { total, rows } = res;
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
    },
    handleDeleteItem(data) {
      this.$prompt('确定删除该阶段？请输入安全码校验。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^HATI-HATI$/,
        inputErrorMessage: '请输入正确格式的安全校验码！'
      }).then(({ value }) => {
        const { id } = data;
        deleteStageAdmin(id).then(res => {
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
      this.wordInfoForm = {
        id: "",
        name: "",
        introduce: "",
        pic: "",
        stage: "",
        colour: ""
      }
    },
    handleEditItem(data) {
      const { id, name, introduce, pic, stage, colour } = data;
      this.wordInfoForm = { id, name, introduce, pic, stage, colour };
      this.dialogVisible = true;
    },
    cancelForm() {
      this.$refs["form"].resetFields();
      this.dialogVisible = false;
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if(this.wordInfoForm.id) {
            const params = { ...this.wordInfoForm };
            editStageAdmin(params).then(res => {
              this.cancelForm();
              this.initTable();
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
            })
          }else {
            const params = { ...this.wordInfoForm };
            newStageAdmin(params).then(res => {
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
    handleCheckDetail(data) {
      const { id } = data;
      this.$router.push({
        path: "/multiFruitDetail",
        query: {
          category: id,
        },
      });
    }
  }
}
</script>
<style lang="scss" scoped>
div.multiFruit {
  .el-input, .el-select {
    width: 180px;
  }
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
  div.colourCard {
    width: 23px;
    height: 23px;
  }
}
</style>
