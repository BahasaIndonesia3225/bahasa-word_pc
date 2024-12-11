<template>
  <div class="recordingInvalid">
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
        width="150"
        prop="remark"
        label="单词">
      </el-table-column>
      <el-table-column
        prop="soundRecording"
        label="音频文件">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {getWordManagement } from "@/api/wordManagement";
import PlayAudio from "@/views/wordManagement/playAudio.vue";
export default {
  data() {
    return {
      tableData: [],
      total: 0,
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
