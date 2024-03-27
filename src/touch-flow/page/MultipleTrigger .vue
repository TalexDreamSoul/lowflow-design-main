<script setup lang="ts" name="AttrTrigger">
import { ref, computed, watch, nextTick } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { SearchCondition } from "../touch-total";

// debounce / throttle
// d [1,2,3] => 3 (200ms)
// t [1,2,3] => 1 (200ms) [4] 4 (王者技能)

export interface ITriggerProp {
  obj: SearchCondition;
  attrs: any;
  placeholder?: string;
  readonly?: boolean;
}

const select = ref<any>();
const props = defineProps<ITriggerProp>();

// watch(props.obj, (val) => {


// }, { immediate: true })

/**
 * 选择器的占位符文本
 */
const _PlaceHolder = computed(() => props?.placeholder ?? "选择字段");

/**
 * 标签模式
 * do: 当前选择的是否是标签？
 * label: 当前选择的标签obj （{ label: '', labelName: '', ... }）
 */
const labelOptions = ref<{
  do: boolean;
  label: any;
}>({
  do: false,
  label: null,
});

function handleChangeSelect(val: string) {
  if (!val) return

  const { attrs, obj } = props;

  let _attrs, doLabel;

  if (val.startsWith('attr')) {
    doLabel = labelOptions.value.do = false

    _attrs = attrs[0].children
  } else {
    doLabel = labelOptions.value.do = true

    _attrs = attrs[1].children
  }

  const id = val.split('-')[1]

  const res = [..._attrs].find(item => +item.id === +id)
  if (!res) {
    console.error("MultiTrigger err", _attrs, id, val)

    return
  }

  obj.type = doLabel ? 'label' : 'attr'

  if (doLabel) {
    obj.label = {
      id: res.id,
      labelId: res.id,
      labelName: res.labelName,
      labelValue: [],
    };

    labelOptions.value.label = res
  } else {

    console.log("field", obj, res)

    // field
    Object.assign(obj.attr, {
      id: res.id,
      field: res.field,
      fieldName: res.fieldName,
      fieldType: res.fieldType,
    })

  }
}
// const handleChangeSelect = useDebounceFn(_handleChangeSelect)

const val = props.obj
const { type } = val

console.log("w", val)

if (type === 'label') {
  if (val.label.labelName!)
    select.value = type + '-' + String(val.label.labelId!)
} else {
  if (val.attr.field!)
    select.value = type + '-' + String(val.attr.id)
}

handleChangeSelect(select.value)
</script>

<template>
  <div class="Trigger-Wrapper">
    <el-select :disabled="readonly" @change="handleChangeSelect" :placeholder="_PlaceHolder" v-model="select">
      <el-option-group :placeholder="placeholder" v-for="(group, index) in attrs" :key="index" :label="group.label">
        <el-option v-for="(item, ind) in group.children" :key="`${group.value}-${item.id}`"
          :value="`${group.value}-${item.id}`" :label="item.label" />
      </el-option-group>
    </el-select>
    <el-select :disabled="readonly" v-model="obj.label.labelValue" multiple placeholder="请选择标签" v-if="labelOptions.do">
      <el-option :value="each" :key="each" :label="each" v-for="(each, i) in labelOptions.label.labelValue?.data" />
    </el-select>
  </div>
</template>

<style scoped lang="scss">
.Trigger-Wrapper {
  &>* {
    flex: 1;
  }

  display: flex;

  flex: 1;
  gap: .5rem;
  min-width: 120px;
}
</style>
