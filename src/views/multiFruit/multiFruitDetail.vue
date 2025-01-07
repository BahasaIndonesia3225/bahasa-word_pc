<template>
  <div class="multiFruitDetail">
    <div class="searchBar">
      <div class="searchForm">
        <div class="name">题目标题</div>
        <el-input
          v-model="searchParams.title"
          placeholder="请输入题目标题"
          clearable>
        </el-input>
        <div class="name">题目类型</div>
        <el-select
          v-model="searchParams.type"
          placeholder="请选择题目类型"
          clearable>
          <el-option
            v-for="item in typeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="name">题目状态</div>
        <el-select
          v-model="searchParams.state"
          placeholder="请选择题目状态"
          clearable>
          <el-option
            v-for="item in stateOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
      <el-table-column prop="title" label="题目标题"></el-table-column>
      <el-table-column prop="type" label="题目类型"> </el-table-column>
      <el-table-column prop="state" label="题目状态"></el-table-column>
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
      :title="wordInfoForm.id ? '编辑题目' : '新增题目'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="900px">
      <el-form
        ref="form"
        :model="wordInfoForm"
        :rules="wordInfoRules"
        label-width="80px">
        <el-form-item label="题目标题" prop="title">
          <el-input
            placeholder="请输入题目标题"
            style="width: 100%"
            v-model="wordInfoForm.title">
          </el-input>
        </el-form-item>
        <el-form-item label="题目解析" prop="analysis">
          <el-input
            style="width: 100%"
            type="textarea"
            :rows="3"
            :maxlength="100"
            show-word-limit
            placeholder="请输入题目解析"
            v-model="wordInfoForm.analysis">
          </el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="题目类型" prop="type">
              <el-select
                style="width: 100%"
                v-model="wordInfoForm.type"
                placeholder="请选择题目类型"
                clearable>
                <el-option
                  v-for="item in typeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="题目状态" prop="state">
              <el-select
                style="width: 100%"
                v-model="wordInfoForm.state"
                placeholder="请选择题目状态"
                clearable>
                <el-option
                  v-for="item in stateOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="音频地址" prop="url">
          <el-input
            placeholder="请输入音频地址"
            style="width: 100%"
            v-model="wordInfoForm.url">
          </el-input>
        </el-form-item>
        <el-form-item label="选项列表">
          <div
            class="topicCard"
            v-for="(item, index) in wordInfoForm.questionOptions"
            :key="index">
            <div class="plusBtn">
              <el-button
                :disabled="wordInfoForm.questionOptions.length >= 4"
                @click="addCourse"
                size="mini"
                type="primary"
                circle
                icon="el-icon-circle-plus-outline">
              </el-button>
              <el-button
                :disabled="wordInfoForm.questionOptions.length <= 1"
                @click="deleteCourse(index)"
                size="mini"
                type="danger"
                circle
                icon="el-icon-remove-outline">
              </el-button>
            </div>
            <el-row :gutter="20">
              <el-col :span="12">
                <span>选项名称</span>
                <el-input
                  style="width: 100%"
                  v-model="wordInfoForm.questionOptions[index].content">
                </el-input>
              </el-col>
              <el-col :span="12">
                <span>选项正确</span>
                <el-select
                  style="width: 100%"
                  v-model="wordInfoForm.questionOptions[index].correct"
                  placeholder="是否正确"
                  clearable>
                  <el-option
                    v-for="item in correctOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="24">
                <span>图片地址</span>
                <el-input
                  style="width: 100%"
                  v-model="wordInfoForm.questionOptions[index].url">
                </el-input>
              </el-col>
            </el-row>
          </div>
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
import { getQuestion, newQuestion, deleteQuestion, editQuestion, checkQuestion } from "@/api/multiFruitManagement"
import {getToken} from "@/utils/auth";

export default {
  data() {
    const { category } = this.$route.query
    return {
      category,
      stateOption: [
        { label: "上架", value: "1" },
        { label: "下架", value: "2" },
      ],
      typeOption: [
        { label: "听写", value: "1" },
        { label: "翻译", value: "2" },
        { label: "选图", value: "3" },
        { label: "选词", value: "4" },
      ],
      correctOption: [
        { label: "是", value: "1" },
        { label: "否", value: "2" },
      ],
      tableData: [],
      total: 0,
      searchParams: {
        title: "",
        type: "",
        state: "",
        category,
        pageNum: 1,
        pageSize: 100,
      },
      //新增相关
      dialogVisible: false,
      questionOptionsItem: {
        content: "",
        correct: "",
        url: ""
      },
      wordInfoForm: {
        id: "",
        title: "",
        type: "",
        state: "",
        analysis: "",
        url: "",
        category: this.category,
        questionOptions: [
          {
            content: "",
            correct: "",
            url: ""
          }
        ]
      },
      wordInfoRules: {
        title: [
          {required: true, message: '请输入题目标题', trigger: 'blur'},
        ],
        type: [
          {required: true, message: '请输入题目类型', trigger: 'blur'},
        ],
        analysis: [
          {required: true, message: '请输入题目解析', trigger: 'blur'},
        ],
        state: [
          {required: true, message: '请输入题目状态', trigger: 'blur'},
        ],
        url: [
          {required: true, message: '请输入音频', trigger: 'blur'},
        ],
      },
    }
  },
  created() {
    this.initTable();
  },
  methods: {
    initTable() {
      getQuestion(this.searchParams).then(res => {
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
    },
    handleDeleteItem(data) {
      this.$prompt('确定删除该题目？请输入安全码校验。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^HATI-HATI$/,
        inputErrorMessage: '请输入正确格式的安全校验码！'
      }).then(({value}) => {
        const {id} = data;
        deleteQuestion(id).then(res => {
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
        title: "",
        type: "",
        state: "",
        analysis: "",
        url: "",
        category: this.category,
        questionOptions: [
          {
            content: "",
            correct: "",
            url: ""
          }
        ]
      }
    },
    handleEditItem(data) {
      const { id } = data;
      checkQuestion(id).then(res => {
        const {id, title, type, state, analysis, url, questionOptions} = res.data;
        this.wordInfoForm = {id, title, type, state, analysis, url, questionOptions, category: this.category};
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
          if (this.wordInfoForm.id) {
            const params = {...this.wordInfoForm};
            editQuestion(params).then(res => {
              this.cancelForm();
              this.initTable();
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
            })
          } else {
            const params = {...this.wordInfoForm};
            newQuestion(params).then(res => {
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
    addCourse() {
      this.wordInfoForm.questionOptions.push(JSON.parse(JSON.stringify(this.questionOptionsItem)))
    },
    deleteCourse(index) {
      this.wordInfoForm.questionOptions.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
div.multiFruitDetail {
  .el-input, .el-select {
    width: 180px;
  }

  .topicCard {
    width: calc(50% - 5px);
    float: left;
    padding: 14px;
    box-sizing: border-box;
    border-radius: 8px;
    background: #f1f8fe;
    position: relative;
    &:not(:last-child) {
      margin-bottom: 10px;
    }
    &:nth-child(odd) {
      margin-right: 10px;
    }
    div.plusBtn {
      position: absolute;
      top: 4px;
      right: 10px;
      z-index: 99;
      .el-button {
        font-size: 12px;
      }
    }
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

}
</style>
