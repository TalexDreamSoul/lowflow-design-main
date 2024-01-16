<script setup lang="ts">
import { useVModels } from "@vueuse/core";
import { StartNode } from "../nodes/Start/index";
import { computed, inject, Ref, ref, watchEffect, reactive } from "vue";
import { Field } from "~/components/Render/interface";
import { FormProperty } from "~/views copy/flowDesign/index";

const labelPosition = ref("right");

const sizeForm = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

function onSubmit() {
  console.log("submit!");
}
export interface ApprovalAttr {
  node: StartNode;
}

const $props = defineProps<ApprovalAttr>();
const $emits = defineEmits<{
  (e: "update:node", modelValue: StartNode): void;
}>();
const { node } = useVModels($props, $emits);
const { fields } = inject<{
  fields: Ref<Field[]>;
}>("nodeHooks")!;
// 全部可写
const allWriteable = computed({
  get() {
    return node.value.formProperties.every((e) => e.writeable);
  },
  set(val) {
    node.value.formProperties.forEach((e) => (e.writeable = val));
    if (val) {
      allReadable.value = false;
      allHidden.value = false;
    } else {
      allRequired.value = false;
    }
  },
});
// 全部必填
const allRequired = computed({
  get() {
    return node.value.formProperties.every((e) => e.required);
  },
  set(val) {
    node.value.formProperties.forEach((e) => (e.required = val));
    if (val) {
      allWriteable.value = true;
      allReadable.value = false;
      allHidden.value = false;
    }
  },
});
// 全部可读
const allReadable = computed({
  get() {
    return node.value.formProperties.every((e) => e.readable);
  },
  set(val) {
    node.value.formProperties.forEach((e) => (e.readable = val));
    if (val) {
      allWriteable.value = false;
      allHidden.value = false;
      allRequired.value = false;
    }
  },
});
// 全部隐藏
const allHidden = computed({
  get() {
    return node.value.formProperties.every((e) => e.hidden);
  },
  set(val) {
    node.value.formProperties.forEach((e) => (e.hidden = val));
    if (val) {
      allWriteable.value = false;
      allRequired.value = false;
      allReadable.value = false;
    }
  },
});
/**
 * 更改隐藏
 * @param row
 */
const changeHidden = (row: FormProperty) => {
  if (row.hidden) {
    row.readable = false;
    row.writeable = false;
    row.required = false;
  }
};
/**
 * 更改可写
 * @param row
 */
const changeWriteable = (row: FormProperty) => {
  if (row.writeable) {
    row.readable = false;
    row.hidden = false;
  } else {
    row.required = false;
  }
};
/**
 * 更改可读
 * @param row
 */
const changeReadable = (row: FormProperty) => {
  if (row.readable) {
    row.writeable = false;
    row.required = false;
    row.hidden = false;
  }
};
/**
 * 更改必填
 * @param row
 */
const changeRequired = (row: FormProperty) => {
  if (row.required) {
    row.writeable = true;
    row.readable = false;
    row.hidden = false;
  }
};
watchEffect(() => {
  const formProperties = node.value.formProperties;
  node.value.formProperties = fields.value
    .filter((e) => e.value !== undefined)
    .map((e) => ({
      id: e.id,
      name: e.title,
      readable: e.props.disabled || false,
      writeable: !e.props.disabled || false,
      hidden: e.props.hidden || false,
      required: (e.props.required && !e.props.disabled) || false,
    }));
  node.value.formProperties.forEach((item) => {
    const properties = formProperties.find((f) => f.id === item.id);
    if (properties) {
      item.readable = properties.readable;
      item.writeable = properties.writeable;
      item.hidden = properties.hidden;
      item.required = properties.required;
    }
  });
});
</script>

<template>
  <!-- v-model="activeName" -->
  <div>

  <div>
    <el-radio-group v-model="labelPosition" label="position control">
      <el-radio-button label="left">Left</el-radio-button>
      <el-radio-button label="right">Right</el-radio-button>
      <el-radio-button label="top">Top</el-radio-button>right
    </el-radio-group>
  </div>
  <br />
  <el-form ref="form" :model="sizeForm" label-width="auto" label-position="left">
    <el-form-item label="Activity name">
      <el-input v-model="sizeForm.name" />
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-select v-model="sizeForm.region" placeholder="please select your zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item label="Activity time">
      <el-col :span="11">
        <el-date-picker v-model="sizeForm.date1" type="date" label="Pick a date" placeholder="Pick a date" style="width: 100%" />
      </el-col>
      <el-col class="text-center" :span="1" style="margin: 0 0.5rem">-</el-col>
      <el-col :span="11">
        <el-time-picker v-model="sizeForm.date2" label="Pick a time" placeholder="Pick a time" style="width: 100%" />
      </el-col>
    </el-form-item>
    <el-form-item label="Activity type">
      <el-checkbox-group v-model="sizeForm.type">
        <el-checkbox-button label="Online activities" name="type" />
        <el-checkbox-button label="Promotion activities" name="type" />
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Resources">
      <el-radio-group v-model="sizeForm.resource">
        <el-radio border label="Sponsor" />
        <el-radio border label="Venue" />
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</div>

</template>

<style >
.el-radio-group {
  margin-right: 12px;
}
</style>
