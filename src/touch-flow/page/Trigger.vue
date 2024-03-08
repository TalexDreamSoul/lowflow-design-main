<script setup lang="ts" name="AttrTrigger">
import { ref, computed, watch } from "vue";
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  modelValue: any;
  attrs: any;
  item: any;
  obj: any;
  placeholder?: string;
  multiple?: boolean;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: any): void;
  (e: "updateType", type: "attr" | "label"): void;
}>();

const model = useVModel(props, "modelValue", emits);
const ph = computed(() => props?.placeholder ?? "选择字段");
const labelOptions = ref<{
  do: boolean;
  label: any;
}>({
  do: false,
  label: null,
});

console.log("aaaa", props);

watch(
  () => model.value,
  (val) => {
    const { attrs, multiple, item, obj } = props;

    if (multiple) {
      const _attrs = attrs.map((item: any) => item.children).flat();

      const res = _attrs.find(
        (item: any) =>
          item.label === val || item?.children?.some((item: any) => item.label === val)
      );

      if (!res) return;

      console.log("res", res, obj);

      labelOptions.value.do = !!res?.labelValueType?.length;

      // label
      if (res.labelValueType) {
        obj.label = {
          labelId: res.id,
          labelName: res.labelName,
          labelValue: [],
        };

        labelOptions.value.label = res;
      } else {
        // field
        // if (item.attr?.fieldType)
        /* if (item.attr?.hasOwnProperty?.('fieldType'))
          item.attr.fieldType = res.fieldType || res.labelValueType;
        else */ item.fieldType = res.fieldType || res.labelValueType;

        item.field = res.field
        item.fieldName = res.fieldName
      }

      emits("updateType", res.labelValueType ? "label" : "attr");
    } else {
      const res = attrs.find((item: any) => item.field === val);
      if (!res) return;

      if (item.attr?.hasOwnProperty?.('fieldType')) item.attr.fieldType = res.fieldType;
      else item.fieldType = res.fieldType;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="Trigger-Wrapper">
    <!-- <el-tree-select
      :placeholder="placeholder"
      v-if="multiple"
      v-model="model"
      :data="attrs"
      :render-after-expand="false"
    /> -->
    <div v-if="multiple" style="display: flex; gap: 0.5rem; flex: 1">
      <el-select :placeholder="placeholder" v-model="model">
        <el-option-group :placeholder="placeholder" v-for="(group, index) in attrs" :key="index" :label="group.label">
          <el-option v-for="(item, ind) in group.children" :key="item.label" :label="item.label" :value="item.label" />
        </el-option-group>
      </el-select>
      <el-select v-model="obj.label.labelValue" multiple placeholder="请选择标签" v-if="labelOptions.do">
        <el-option :value="each" :key="each" :label="each" v-for="(each, i) in labelOptions.label.labelValue?.data" />
      </el-select>
    </div>

    <!-- <el-option-group v-if="multiple" v-for="(group, index) in attrs" :key="index" :label="group.label">
        <template v-for="(option, i) in group.options" :key="i">
          <el-option v-if="!option.labelValue?.data?.length" :key="option.field"
            :label="option.fieldName ?? option.labelName" :value="option.fieldValue" />

          <el-option-group v-else :label="option.labelName">
            <el-option v-for="item in option.labelValue.data" :key="`${group.label}-${item}`" :label="item"
              :value="`${group.label}-${item}`" />
          </el-option-group>
        </template>
</el-option-group> -->
    <el-select v-else class="trigger-container" v-model="model" :placeholder="ph">
      <el-option v-for="item in attrs" :key="item.field" :label="item.fieldName" :value="item.field" />
    </el-select>
  </div>
</template>

<style scoped lang="scss">
.Trigger-Wrapper {
  min-width: 120px;
}
</style>
