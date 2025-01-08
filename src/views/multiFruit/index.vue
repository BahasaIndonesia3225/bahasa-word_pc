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
      row-key="id"
      border
      :default-expand-all="true"
      :tree-props="{children: 'children'}"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="阶段/关卡名称">
        <template slot-scope="scope">
          <span v-if="scope.row.parent === 0">
            {{scope.row.name}}
          </span>
          <el-button
            v-else
            @click="handleCheckDetail(scope.row)"
            type="text">
            {{scope.row.name}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        prop="stage"
        label="顺序">
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            size="mini"
            v-if="scope.row.parent === 0">
            {{scope.row.stage}}
          </el-tag>
          <el-tag
            v-else
            effect="dark"
            size="mini"
            type="info">
            {{scope.row.stage}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="introduce"
        label="阶段/关卡描述">
      </el-table-column>
      <el-table-column
        prop="pic"
        label="主图">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.parent === 0"
            style="width: 48px; height: 48px"
            :src="scope.row.pic"
            :preview-src-list="[scope.row.pic]"
            fit="contain">
          </el-image>
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
      :title="wordInfoForm.id ? `编辑${dialogTitle}` : '新增阶段/关卡'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="600px">
      <el-form
        ref="form"
        :model="wordInfoForm"
        :rules="wordInfoRules"
        label-width="80px">
        <el-form-item label="类型" prop="type">
          <el-radio-group
            v-removeAriaHidden
            v-model="wordInfoForm.type"
            @change="handleChangeType">
            <el-radio :label="0">阶段</el-radio>
            <el-radio :label="1">关卡</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="wordInfoForm.type === 1"
          label="所属阶段"
          prop="parent">
          <el-select
            style="width: 100%"
            v-model="wordInfoForm.parent"
            placeholder="请选择所属阶段"
            clearable>
            <el-option
              v-for="item in tableData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input style="width: 100%" v-model="wordInfoForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="introduce">
          <el-input
            style="width: 100%"
            type="textarea"
            :rows="3"
            :maxlength="100"
            show-word-limit
            placeholder="请输入描述"
            v-model="wordInfoForm.introduce">
          </el-input>
        </el-form-item>
        <el-form-item label="主图" prop="pic">
          <el-input style="width: 100%" v-model="wordInfoForm.pic"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="顺序" prop="stage">
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
import { getStageAdmin, newStageAdmin, deleteStageAdmin, editStageAdmin } from "@/api/multiFruitManagement"

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
      dialogTitle: "",
      wordInfoForm: {
        id: "",
        name: "",
        introduce: "",
        pic: "",
        stage: "",
        colour: "",
        parent: "",
        type: 0
      },
      wordInfoRules: {
        type: [
          { required: true, message: '请选择类型', trigger: 'blur' },
        ],
        parent: [
          { required: true, message: '请选择所属阶段', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        introduce: [
          { required: true, message: '请输入描述', trigger: 'blur' },
        ],
        pic: [
          { required: true, message: '请输入主图', trigger: 'blur' },
        ],
        stage: [
          { required: true, message: '请输入阶段', trigger: 'blur' },
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
        colour: "",
        parent: "",
        type: 0
      }
    },
    handleEditItem(data) {
      const { id, name, introduce, pic, stage, colour, parent } = data;
      const type = parent === 0 ? 0 : 1
      this.wordInfoForm = { id, name, introduce, pic, stage, colour, parent, type};
      this.dialogTitle = parent === 0 ? '阶段' : '关卡';
      this.dialogVisible = true;
    },
    handleChangeType() {
      this.wordInfoForm.parent = "";
      this.$refs["form"].clearValidate()
    },
    cancelForm() {
      this.$refs["form"].resetFields();
      this.dialogVisible = false;
    },
    async submitForm() {
      if(this.wordInfoForm.type === 0) {
        await this.$refs["form"].validate();
      }else {
        await this.$refs["form"].validateField(['type', 'parent', 'name'])
      }
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
