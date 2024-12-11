<template>
  <div class="userManagement">
    <div class="searchBar">
      <div class="searchForm">
        <div class="name">用户账号</div>
        <el-input
          v-model="searchParams.userName"
          placeholder="请输入用户账号"
          clearable>
        </el-input>
        <div class="name">用户类型</div>
        <el-select
          v-model="searchParams.userType"
          placeholder="请选择用户类型"
          clearable>
          <el-option
            v-for="item in userTypeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </div>
      <el-button type="primary" @click="handleNewItem">新增</el-button>
    </div>
    <el-table
      stripe
      height="100%"
      size="mini"
      :data="tableData"
      style="width: 100%">
      <el-table-column prop="userName" label="用户账号"></el-table-column>
      <el-table-column label="用户类型">
        <template slot-scope="scope">
          <span>{{setUserName(scope.row.userType)}}</span>
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
      :title="userInfoForm.userId ? '编辑用户' : '新增用户'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="500px">
      <el-form
        ref="form"
        :model="userInfoForm"
        :rules="userInfoRules"
        label-width="80px">
        <el-form-item label="用户类型" prop="userType">
          <el-select
            style="width: 100%"
            v-model="userInfoForm.userType"
            placeholder="请选择用户类型">
            <el-option
              v-for="item in userTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户账号" prop="userName">
          <el-input
            style="width: 100%"
            v-model.trim="userInfoForm.userName">
          </el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input
            style="width: 100%"
            :disabled="!!userInfoForm.userId"
            v-model.trim="userInfoForm.password">
          </el-input>
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
import { getUserManagement, newUserManagement, deleteUserManagement, checkUserManagement, editUserManagement } from "@/api/userManagement";
import mixin from '@/views/mixin'
export default {
  mixins: [mixin],
  data() {
    const validateUserName = (rule, value, callback) => {
      const reg1 = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
      const reg2 = /^08\d{7,10}$/;
      if (value === '') {
        callback(new Error('请输入登陆账号'));
      } else if (!(reg1.test(value) || reg2.test(value))) {
        callback(new Error('请输入正确的中国大陆手机号（无需86）或印尼手机号（08开头）'));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      total: 0,
      searchParams: {
        userName: "", //用户账号
        userType: "",
        pageNum: 1,
        pageSize: 100,
      },
      dialogVisible: false,
      userInfoForm: {
        userId: "",
        userType: "",
        userName: "",
        password: "",
      },
      userInfoRules: {
        userType: [
          { required: true, message: '请选择用户类型', trigger: 'blur' },
        ],
        userName: [
          { required: true, message: '请输入登陆账号', trigger: 'blur' },
          // { validator: validateUserName, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登陆密码', trigger: 'blur' },
        ],
      }
    }
  },
  created() {
    this.initTable();
  },
  methods: {
    setUserName(value) {
      return this.userTypeOption.filter(item => item.value === value)[0].label
    },
    initTable() {
      getUserManagement(this.searchParams).then(res => {
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
    handleNewItem() {
      this.dialogVisible = true;
      this.$refs["form"] && this.$refs["form"].resetFields();
      this.userInfoForm = {
        userId: "",
        userType: "",
        userName: "",
        password: "",
      }
    },
    handleEditItem(data) {
      const { userId } = data;
      checkUserManagement(userId).then(res => {
        const { userId, userName, password, userType } = res.data;
        this.userInfoForm = {
          userId, userName, password, userType
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
          if(this.userInfoForm.userId) {
            const params = { ...this.userInfoForm }
            editUserManagement(params).then(res => {
              this.cancelForm();
              this.initTable();
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
            })
          }else {
            const params = { ...this.userInfoForm }
            newUserManagement(params).then(res => {
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
    handleDeleteItem(data) {
      this.$prompt('确定删除该用户？请输入安全码校验。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^HATI-HATI$/,
        inputErrorMessage: '请输入正确格式的安全校验码！'
      }).then(({ value }) => {
        const { userId } = data;
        deleteUserManagement(userId).then(res => {
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
    }
  }
}
</script>
<style lang="scss" scoped>
div.userManagement {
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
  }
}
</style>

