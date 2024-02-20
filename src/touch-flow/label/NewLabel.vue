<script setup lang="ts" name="NewLabel">
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { reactive, ref, watch, computed } from 'vue';
import { getLabelList, addCustomLabel } from '../../api/index'
import { ElMessage } from 'element-plus';

const props = defineProps<{
  p: any
}>()
const model = reactive<any>({
  labelName: '',
  labelType: '',
  labelValue: {
    data: [""]
  },
  labelValueType: 'text'
})
const visible = ref(false)
const labelList = ref<any[]>([])

const refreshLabelList = async() => {
  const data = (await getLabelList())

  labelList.value = data.data.records
}
refreshLabelList()

function addLabel() {
  model.labelValue.data.push("")
}

async function save() {
  if ( model.labelName === '' || 
  (model.labelValueType === 'text' && model.labelValue.data.filter((item: any) => !item.length)?.length)
  ) {
    return ElMessage({
    type: 'error',
    message: '不可以存在空标签名称或标签值为空'
  })

  }

  const res = await addCustomLabel(model)

  refreshLabelList()

  visible.value = false

  if ( !+res.code ) {
    ElMessage({
      type: 'success',
      message: '添加成功'
    })
  }
}

function handleDelete(index: number) {
  model.labelValue.data.splice(index, 1)
}

const selectItem = computed(() => [ ...labelList.value ].find((item: any) => item.labelName === props.p.labelContent.labelName))

watch(() => props.p.labelContent?.labelName, () => {
  const res = selectItem.value

  if ( res ) {
    props.p.labelContent.labelId = res.id
  }
})
</script>

<template>
  <div class="NewLabel">
    <div class="NewLabel-Main">
      <el-text>
        符合该策略器条件的用户打上
        <el-select v-model="p.labelContent.labelName" placeholder="标签名称" style="width: 150px">
          <el-option v-for="item in labelList" :key="item.labelName" :label="item.labelName" :value="item.labelName" />
        </el-select>
        &nbsp;
        <el-select v-if="selectItem" v-model="p.labelContent.labelValue" placeholder="标签值" style="width: 150px">
          <el-option v-for="item in selectItem.labelValue.data" :key="item.id" :label="item" :value="item" />
        </el-select>
        标签
      </el-text>
    </div>

    <el-button @click="visible = true">
      添加标签
    </el-button>
  </div>

  <teleport to="body">
    <el-dialog width="400px" title="新增标签" v-model="visible">
      <div class="LabelForm">
        <el-form label-position="top" label-width="100px" :model="model" style="width: 100%">
          <el-form-item label="标签类型">
            <el-select style="width: 100%" v-model="model.labelValueType">
              <el-option label="字符型" value="text" />
              <el-option label="布尔型" value="boolean" />
            </el-select>
          </el-form-item>
          <el-form-item label="标签名称">
            <el-input v-model="model.labelName" />
          </el-form-item>
          <el-form-item v-if="model.labelValueType === 'text'" v-for="(item, index) in model.labelValue.data" :label="`标签值${index + 1}`">
            <div style="display: flex;width: 100%;">
              <el-input style="width: 100%" v-model="model.labelValue.data[index]" />
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

  padding-bottom: 1rem;

  height: 20rem;

  overflow-y: auto;
}
</style>