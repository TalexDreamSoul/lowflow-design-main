<template>
  <div class="event warp">
    <div class="title">{{ title }}</div>
    <slot name="search"></slot>
    <div class="content">
 
      <slot name="table" :tableData="tableData"></slot>
      <slot name="pagination"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  title: String,
  tableData: Array,
});
// ... 其他逻辑
</script>



<style lang="scss">
.event {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 24px 40px;
  background-color: #f8f9fa;
  overflow-y: auto;

  > .title {
    font-size: 24px;
    line-height: 24px;
    font-weight: 500;
    color: rgba($color: #000000, $alpha: 1);
    margin-bottom: 24px;
  }

  .search {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .el {
      &-select {
        width: 278px;
      }

      &-form-item {
        margin-bottom: 16px !important;
      }

      &-input {
        width: 280px;
      }
    }
  }

  .content {
    flex: 1;
    background-color: white;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .el {
    &-pagination {
      justify-content: flex-end;
      margin: 20px 40px;
    }

    &-table {
      border-radius: 8px;
      overflow: hidden;

      .cell {
        padding: 0;

        .el-button.is-link {
          padding: 0;
        }
      }
    }

    &-table__header th {
      padding: 19.5px 16px;
      font-size: 14px;
      color: rgba($color: #000000, $alpha: 0.9);
      font-weight: 500;
      box-sizing: border-box;

      .cell {
        line-height: 16px;
      }
    }

    &-table__body td {
      padding: 12.5px 16px;
      color: #000000;

      .cell {
        line-height: 22px;
      }
    }
  }

  .el-tag.el-tag--info {
    border-color: rgba(144, 160, 184, 0.2);
    background-color: rgba(242, 244, 248, 1);
    color: #90a0b8;
    line-height: 22px;
  }

  .event-drawer {
    .el-drawer__body {
      padding: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    &-header {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.9);
      line-height: 24px;
      font-size: 20px;
      height: 72px;
      padding: 24px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    &-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }

    &-footer {
      height: 72px;
      padding: 16px 24px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      text-align: right;
    }

    .attr-content {
      margin-top: 24px;

      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .text {
          font-size: 14px;
          font-weight: 400;
          line-height: 32px;
        }
      }

      .el-table {
        border-radius: 0;

        .el-table__cell {
          background-color: rgba(242, 244, 248, 1);
        }
      }
    }
  }

  .action-btn {
    span {
      letter-spacing: 0;
      line-height: 17px;
    }
    &:not(:first-child) {
      margin-left: 6px;
    }
  }

  .attr-modal {
    border-radius: 8px;

    .el-dialog__title {
      font-size: 20px;
      font-weight: 500;
      color: #000000;
      line-height: 24px;
    }

    .el-dialog__close {
      font-size: 24px;
      color: #90a0b8;
    }

    .el-dialog__body {
      padding-top: 14px;
    }
  }

  .form .el-form-item {
    .el-form-item__label {
      color: rgba(0, 0, 0, 0.9);
    }

    &:not(:last-child) {
      width: 50%;
    }
  }
}

.pd-button {
  height: 40px;
  padding: 12px 24px;

  &.el-button--primary {
    background: linear-gradient(180deg, #205ccb 0%, #598ff1 100%);
  }
}

.delete-modal {
  border-radius: 8px;

  .el-message-box__title {
    font-size: 20px;
    font-weight: 500;
    color: #000000;
    line-height: 24px;
  }

  .el-message-box__close {
    font-size: 24px !important;
    color: #90a0b8 !important;
  }
}
</style>