<script setup lang="ts" name="TouchGenre">
import { computed } from "vue";
import { Delete } from "@element-plus/icons-vue";
import LogicalLine from "../behavior/LogicalLine.vue";
import AttrRender from "../../page/AttrRender.vue";
import Operator from "../../page/Operator.vue";
import Trigger from "../../page/Trigger.vue";

const props = defineProps<{
  condition: any;
  // index: number;
  dict: any;
}>();

function getConditions() {
  return (props.condition.conditions = props.condition.conditions || []);
}

const addCondition = () => {
  getConditions().push({
    field: null,
    operator: "equal",
    fieldValue: null,
  });
};

/**
 * 删除条件
 * @param index
 */
const handleDel = (index: number) => {
  getConditions().splice(index, 1);
};

const attrs = computed(() => {
  const { events } = props.dict;

  // const targetEvents =
  //   [...events]
  //     .map((e: any) => e.events)
  //     .flat()
  //     .find((e: any) => e.id === props.target.delayedAction)?.eventAttr
  //     ?.attrs ?? null;

  const targetEvents =
    [...events]
      .map((e: any) => e.events)
      .find((_: any) => (_e: any) => _e.id === props.condition.delayedAction)?.[0]
      ?.eventAttr?.attrs ?? null;

  return targetEvents;
});
</script>

<template>
  <div class="TouchGenre">
    <LogicalLine
      title="并且满足"
      v-model="condition.logicalChar"
      :display="condition.conditions.length < 2"
    >
      <div
        v-if="attrs"
        class="TouchGenre-Line"
        v-for="(item, index) in condition.conditions"
        :key="`${item.field}-${index}`"
      >
        <trigger :item="item" v-model="item.field" :attrs="attrs" />

        <operator :attrs="attrs" :item="item" ref="operatorRef" v-model="item.fieldOp" />
        <AttrRender :item="item" :attrs="attrs" />&nbsp;

        <el-text type="primary" style="cursor: pointer" @click="handleDel(index)">
          <el-icon size="14">
            <Delete />
          </el-icon>
          删除
        </el-text>
      </div>
    </LogicalLine>
  </div>
</template>

<style scoped lang="scss">
.TouchGenre {
  &-Line {
    display: flex;
    margin: 4px 0 8px;

    gap: 0.5rem;
    align-items: center;
  }
  margin: 10px 0;

  border-radius: 8px;

  background-color: #f7f8fa;
}

:deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}
</style>
