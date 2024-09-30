<template>
  <div class="wordManagement">
    <div class="searchBar">
      <div class="searchForm">
        <div class="name">单词名称</div>
        <el-input
          v-model="searchParams.remark"
          placeholder="请输入单词"
          clearable>
        </el-input>
        <div class="name">单词类别</div>
        <el-select
          v-model="searchParams.categoryId"
          placeholder="请选择类别"
          clearable>
          <el-option
            v-for="item in categoryOption"
            :key="item.id"
            :label="item.name"
            :value="item.id">
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
      <el-table-column
        width="150"
        prop="remark"
        label="单词">
      </el-table-column>
      <el-table-column
        width="150"
        prop="type"
        label="断句">
      </el-table-column>
      <el-table-column
        width="150"
        prop="chinese"
        label="中文含义">
      </el-table-column>
      <el-table-column label="类别">
        <template slot-scope="scope">
          <div v-for="item in setCategoryName(scope.row.categoryId)">
            <el-tag
              type="info"
              size="mini">
              {{ item }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sentence" label="用法解释"></el-table-column>
      <el-table-column label="播放">
        <template slot-scope="scope">
          <play-audio :key="scope.row.id" :src="scope.row.soundRecording"/>
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
      :title="wordInfoForm.id ? '编辑单词' : '新增单词'"
      :visible.sync="dialogVisible"
      width="45%">
      <el-form
        ref="form"
        :model="wordInfoForm"
        :rules="wordInfoRules"
        label-width="80px">
        <el-form-item label="单词" prop="remark">
          <el-input
            style="width: 100%"
            v-model="wordInfoForm.remark">
          </el-input>
          <div v-if="wordInfoForm.remark">
            {{ setAudioUrl(wordInfoForm.remark) }}
            <audio
              controls
              v-if="wordInfoForm.remark"
              :src="setAudioUrl(wordInfoForm.remark)">
            </audio>
          </div>
          <div class="wordDescription">
            <div>单词地址规范:</div>
            <div>情况1:【kakak】----【kakak.mp3】</div>
            <div>情况2:【kakak laki-laki】----【kakak_laki-laki.mp3】</div>
            <div>注意: 不区分大小写，例如单词China，文件名可以为china.mp3</div>
            <div>注意: 阿里云音频文件均为小写单词</div>
          </div>
        </el-form-item>
        <el-form-item label="中文含义" prop="chinese">
          <el-input
            style="width: 100%"
            type="textarea"
            :rows="3"
            maxlength="30"
            show-word-limit
            v-model="wordInfoForm.chinese">
          </el-input>
        </el-form-item>
        <el-form-item label="用法解释" prop="sentence">
          <el-input
            style="width: 100%"
            type="textarea"
            :rows="3"
            v-model="wordInfoForm.sentence">
          </el-input>
        </el-form-item>
        <el-form-item label="断句" prop="type">
          <el-input
            style="width: 100%"
            v-model="wordInfoForm.type">
          </el-input>
        </el-form-item>
        <el-form-item label="类别" prop="categoryId">
          <el-select
            style="width: 100%"
            clearable
            multiple
            v-model="wordInfoForm.categoryId"
            placeholder="请选择类别">
            <el-option
              v-for="item in categoryOption"
              :key="item.id"
              :label="item.name"
              :value="item.id">
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
import PlayAudio from '@/views/wordManagement/playAudio.vue'
import {getWordManagement, newWordManagement, deleteWordManagement, checkWordManagement, editWordManagement } from "@/api/wordManagement"
import mixin from '@/views/mixin'
import { getCategoryManagement } from '@/api/categoryManagement'
export default {
  components: {PlayAudio},
  mixins: [mixin],
  data() {
    return {
      tableData: [],
      total: 0,
      searchParams: {
        remark: "",
        categoryId: "",
        pageNum: 1,
        pageSize: 100,
      },

      categoryOption: [],
      dialogVisible: false,
      wordInfoForm: {
        id: "",
        remark: "",          //单词
        sentence: "",        //例句
        soundRecording: "",  //录音地址(根据单词生成)
        type: "",            //断句
        categoryId: [],      //类别id
        chinese: "",         //中文含义
        //暂时用不到的字段
        pic: "",             //单词图片
        phoneticSymbol: "",  //音标
        content: "",         //备注
      },
      wordInfoRules: {
        remark: [
          { required: true, message: '请输入单词', trigger: 'blur' },
        ],
        categoryId: [
          { required: true, message: '请选择类别', trigger: 'blur' },
        ],
        chinese: [
          { required: true, message: '请输入中文含义', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请输入断句', trigger: 'blur' },
        ],
      }
    }
  },
  created() {
    this.initTable();
    this.getCategoryOption()
  },
  methods: {
    setAudioUrl(name) {
      // suami_istri.mp3
      if (name.indexOf(" ") !== -1) {
        name = name.replace(" ", "_");
      }
      name = name.toLowerCase()
      return 'http://taioassets.oss-cn-beijing.aliyuncs.com/Audios/' + name + '.mp3'
    },
    setCategoryName(categoryId) {
      let names = [];
      this.categoryOption.forEach(item => {
        const { id, name } = item;
        if(categoryId.indexOf(id) > -1) {
          names.push(name)
        }
      })
      return names
    },
    getCategoryOption() {
      const params = {
        name: "",
        authority: "",
        pageNum: 1,
        pageSize: 100,
      }
      getCategoryManagement(params).then(res => {
        const { rows } = res;
        this.categoryOption = rows;
      })
    },
    initTable() {
      getWordManagement(this.searchParams).then(res => {
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
      this.$confirm('确定删除该单词?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const { id } = data;
        deleteWordManagement(id).then(res => {
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
      this.wordInfoForm.id = "";
    },
    handleEditItem(data) {
      const { id } = data;
      checkWordManagement(id).then(res => {
        let { id, remark, sentence, type, categoryId, chinese } = res.data;
        this.wordInfoForm = {
          id, remark, sentence, type, categoryId: categoryId.split(",").map(id => Number(id)),
          chinese
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
          if(this.wordInfoForm.id) {
            const params = { ...this.wordInfoForm };
            params.soundRecording = this.setAudioUrl(this.wordInfoForm.remark);
            params.categoryId = params.categoryId.join(",")
            editWordManagement(params).then(res => {
              this.cancelForm();
              this.initTable();
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
            })
          }else {
            const params = { ...this.wordInfoForm };
            params.soundRecording = this.setAudioUrl(this.wordInfoForm.remark);
            params.categoryId = params.categoryId.join(",")
            newWordManagement(params).then(res => {
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
div.wordDescription {
  margin-top: 10px;
  div {
    line-height: 24px;
    color: #666666;
  }
}
div.wordManagement {
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
