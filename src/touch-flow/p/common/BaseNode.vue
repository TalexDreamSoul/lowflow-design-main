<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";

const props = defineProps<{
  display: boolean,
  disabled: boolean,
  params: any
}>()

const { readonly, data, dialogVisible, drawerOptions, openDrawer, comps, handleClick, handleSave } = props.params

</script>

<template>
  <el-card class="PBlock">
    <slot />

    <teleport to=".FlowPage">
      <el-dialog v-model="dialogVisible" width="25%" title="请选择添加类型" align-center>
        <div class="Dialog-Sections">
          <div @click="openDrawer(item)" v-for="item in comps" :class="{ disabled: item.disabled?.value }"
            class="PBlock-Section">
            <p style="    display: flex;
            align-items: center;">
              <el-icon v-if="item.icon.type === 'comp'">
                <component :is="item.icon.value" />
              </el-icon>
              <img v-else :src="item.icon.value as any" style="    margin-right: 2px;" />
              {{ item.title }}
            </p>
            <span v-text="item.desc" />
          </div>
        </div>
      </el-dialog>
    </teleport>

    <teleport to=".FlowPage">
      <el-drawer @click="handleClick" v-model="drawerOptions.visible" :title="drawerOptions.title" size="65%">
        <component :readonly="readonly" :p="data" :is="drawerOptions.comp" />
        <template #footer>
          <template v-if="readonly">
            <el-button round @click="drawerOptions.visible = false">返回</el-button>
          </template>
          <template v-else>
            <el-button round @click="drawerOptions.visible = false">取消</el-button>
            <el-button round @click="handleSave" type="primary" primaryStyle>保存</el-button>
          </template>
        </template>
      </el-drawer>
    </teleport>
  </el-card>
  <!-- && !customerConditioned.display -->
  <el-button :class="{ display, disabled }" @click="dialogVisible = true" class="start-add" type="primary" :icon="Plus"
    circle />
</template>

<style lang="scss">
.Dialog-Sections {
  p {
    margin: 0;
  }

  display: flex;

  gap: 2rem;
  justify-content: center;
}

.PBlock-Section {
  &.disabled {
    opacity: 0.5;
    border: 1px solid var(--el-border-color);
    pointer-events: none;
  }

  p {
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    color: #333;
    overflow: hidden;
    position: relative;
    padding-bottom: 12px;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      bottom: 20px;
      width: 60%;
      height: 8px;
      transition: 0.25s;
      transform: scaleX(0) translateX(-100%);
      width: 160px;
      height: 7px;
      background: linear-gradient(82deg,
          rgba(64, 120, 224, 0.4) 0%,
          rgba(64, 120, 224, 0) 100%);
      border-radius: 2px 2px 2px 2px;
      opacity: 0.6;
      position: absolute;
    }

    span {
      float: right;

      font-size: 1.25rem;

      color: #00c068 !important;
    }

    position: relative;
  }

  &.checked {
    p {
      &::before {
        transform: scaleX(1) translateX(0%);
      }

      color: #4078e0;
    }
  }

  &:hover {
    border: 1px solid #4078e0;
  }

/*  width: 50%;*/

  border: 1px solid transparent;
}

.PBlock-Section .el-icon {
  top: 0.125rem;

  margin-bottom: 0.5rem;
}
</style>
