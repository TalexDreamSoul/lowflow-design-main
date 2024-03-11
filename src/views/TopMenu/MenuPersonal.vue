<script setup lang="ts" name="MenuPersonal">
import { inject } from 'vue';
import { QuestionFilled } from '@element-plus/icons-vue';

const appOptions: any = inject('appOptions')!
</script>

<template>
  <div class="MenuPersonal">
    <span class="divider">
      <el-icon :size="16">
        <QuestionFilled />
      </el-icon>
      帮助
    </span>
    <span>
      你好 {{ appOptions.user?.accountName }}
    </span>
    <span v-if="false" class="more">
      <el-icon>
        <MoreFilled />
      </el-icon>
    </span>
  </div>
</template>

<style lang="scss">
.MenuPersonal {
  span {
    display: flex;

    gap: .5rem;
    align-items: center;
  }

  .divider {
    padding-right: 1rem;
    font-size: 16px;
    border-right: 2px solid #E6E6E6;
  }

  .more {
    margin-left: .25rem;

    opacity: .75;
    transform: rotate(90deg);
  }

  .el-icon {
    margin-top: .125rem;
  }

  position: relative;
  margin: 0 1rem;
  display: flex;

  gap: 1rem;
  align-items: center;

  height: 100%;
  // background-color: red;
}
</style>