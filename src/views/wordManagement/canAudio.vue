<template>
  <div class="canAudio">
    <el-tag v-if="isAblePlay" size="mini" @click="playAudio">
      点击播放
    </el-tag>
    <el-tag v-else type="danger" size="mini">
      无法播放
    </el-tag>
  </div>
</template>
<script>
export default {
  props: {
    src: String
  },
  data() {
    return {
      Audio: null,
      isAblePlay: false,
    }
  },
  watch: {
    src: {
      handler(newVal, oldVal) {
        this.Audio = new Audio();
        this.Audio.addEventListener('canplaythrough', () => {
          console.log("加载完成")
          this.isAblePlay = true;
        })
        this.Audio.addEventListener('error', () => {
          console.log("加载失败")
          this.isAblePlay = false;
        })
        this.Audio.src = this.src;
      },
      immediate: true
    }
  },
  methods: {
    playAudio() {
      this.$nextTick(() => {
        this.Audio.play();
      })
    }
  }
}
</script>
<style lang="scss" scoped>
div.canAudio {
  .el-tag {
    cursor: pointer;
  }
}
</style>
