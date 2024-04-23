<script setup lang="ts" name="NewLabel">
import { Delete, CirclePlusFilled } from "@element-plus/icons-vue";
import { reactive, ref, watch, computed, onMounted } from "vue";
import { getLabelList, addCustomLabel } from "../../api/index";
import { ElMessage } from "element-plus";

const props = defineProps<{
  p: any;
  readonly?: boolean;
}>();
const origin = {
  labelName: "",
  currentDayEffective: false,
  labelType: "",
  labelValue: {
    data: [""],
  },
  labelValueType: "text",
};
const model = reactive<any>(origin);
const visible = ref(false);
const labelList = ref<any[]>([]);

const refreshLabelList = async () => {
  const data = await getLabelList();

  labelList.value = data?.data?.records;
};
refreshLabelList();
const listContainer = ref(null);
function addLabel() {
  model.labelValue.data.push("");
  if (listContainer.value) {
    listContainer.value.scrollTop = listContainer.value.scrollHeight;
    console.log(listContainer.value);
  } else {
    console.error("listContainer is null");
  }
}

async function save() {
  if (
    model.labelName === "" ||
    (model.labelValueType === "text" &&
      model.labelValue.data.filter((item: any) => !item.length)?.length)
  ) {
    return ElMessage({
      type: "error",
      message: "不可以存在空标签名称或标签值为空",
    });
  }

  const res = await addCustomLabel(model);

  Object.assign(model, origin);

  refreshLabelList();

  visible.value = false;

  if (!+res.code) {
    ElMessage({
      type: "success",
      message: "添加成功",
    });
  }
}

function handleDelete(index: number) {
  model.labelValue.data.splice(index, 1);
}

const selectItem = computed(() =>
  [...labelList.value].find(
    (item: any) => item.labelName === props.p.labelContent.labelName
  )
);

watch(
  () => props.p.labelContent?.labelName,
  () => {
    const res = selectItem.value;

    if (res) {
      props.p.labelContent.labelId = res.id;
    }
  }
);

function handleChange(val: any) {
  if (val === "boolean") {
    model.labelValue.data = [1, 0];
  } else if (val === "text") {
    model.labelValue.data = [""];
  }
}
</script>

<template>
  <div class="NewLabel">
    <div class="NewLabel-Main">
      <el-text>
        符合该策略器条件的用户打上
        <el-select :disabled="readonly" @change="p.labelContent.labelValue = ''" v-model="p.labelContent.labelName" placeholder="标签名称" style="width: 150px">
          <el-option v-for="item in labelList" :key="item.labelName" :label="item.labelName" :value="item.labelName" />
        </el-select>
        &nbsp;
        <template v-if="selectItem?.labelValueType">
          <el-select collapse-tags :disabled="readonly" v-if="selectItem.labelValueType === 'text'" v-model="p.labelContent.labelValue" placeholder="标签值" style="width: 150px" multiple>
            <el-option v-for="item in selectItem.labelValue.data" :key="item.id" :label="item" :value="item" />
          </el-select>
          <el-select :disabled="readonly" v-else="" v-model="p.labelContent.labelValue" placeholder="标签值" style="width: 150px">
            <!-- <el-option /> -->
            <el-option v-for="item in selectItem.labelValue.data" :key="item.id" :label="item" :value="item" />
          </el-select>
        </template>
        标签
      </el-text>
    </div>

    <el-button :disabled="readonly" @click="visible = true">
      添加标签
    </el-button>
  </div>

  <teleport to="body">
    <el-dialog width="400px" title="新增标签" v-model="visible">
      <div class="LabelForm" ref="listContainer" style="width: 100%;height: 350px; overflow: auto;">
        <el-form label-position="top" label-width="100px" :model="model">
          <el-form-item label="标签类型">
            <el-select @change="handleChange" style="width: 100%" v-model="model.labelValueType">
              <el-option label="字符型" value="text" />
              <el-option label="布尔型" value="boolean" />
            </el-select>
          </el-form-item>
          <el-form-item label="标签名称">
            <el-input v-model="model.labelName" maxlength="50"/>
          </el-form-item>

          <el-form-item label="仅使用当日数据">
            <span>
              （若此开关打开，使用该标签时仅当日效据有效）
            </span> <el-switch v-model="model.currentDayEffective" />

          </el-form-item>

          <el-form-item label="标签说明">
            <el-input v-model="model.labelDesc" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item v-if="model.labelValueType === 'text'" v-for="(item, index) in model.labelValue.data" :label="`标签值${index + 1}`">
            <div style="display: flex;width: 100%;">
              <el-input style="width: 100%" v-model="model.labelValue.data[index]"  maxlength="50"/>
              <el-button @click="handleDelete(index)" plain text v-if="index" style="margin-left: 10px">
                <el-icon>
                  <Delete />
                </el-icon>
              </el-button>
            </div>
          </el-form-item>
          <div class="add-label" v-if="model.labelValueType === 'text'">
            <el-button type="primary" @click="addLabel" text plain>
              <el-icon>
                <CirclePlusFilled />
              </el-icon>
              标签值
            </el-button>
          </div>
        </el-form>
      </div>

      <template #footer>
        <el-button round @click="visible = false">取消</el-button>
        <el-button round type="primary" class="primaryStyle" @click="save">
          保存
        </el-button>
      </template>
    </el-dialog>
  </teleport>
</template>

<style lang="scss">
.primaryStyle {
  &:hover {
    color: #eee;
  }

  color: #fff;

  cursor: pointer;
  background: linear-gradient(to top, #598ff1, #205ccb);
}

.NewLabel {
  &-Main {
    display: flex;

    align-items: center;

    gap: 10px;
  }

  display: flex;

  gap: 1rem;
}

.LabelForm {
  .add-label {
    position: absolute;
    padding: 4px 20px;

    left: 0;

    bottom: 80px;
    width: 90%;

    text-align: left;

    background: #fff;
    box-sizing: border-box;
  }

  padding-bottom: 100px;
  height: 20rem;

  overflow-y: auto;
}
</style>