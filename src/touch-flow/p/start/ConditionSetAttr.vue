<script setup lang="ts">
import {
  computed,
  ref,
  inject,
  reactive,
  onMounted,
} from "vue";
import { Delete, CirclePlus, CircleClose } from "@element-plus/icons-vue";

import EventGroupFilter from "~/components/EventGroup/index.vue";
import { dictFilterTree } from "~/api";

const timeFuncs: { [func: string]: any } = {
  single: [
    (obj: any) => {
      const { date1, date2 } = obj
      if (!date1 || !date2) return

      // 同步date1的日期和date2的时间为一个
      const date = new Date(date1);
      const time = new Date(date2);

      date.setHours(time.getHours());
      date.setMinutes(time.getMinutes());
      date.setSeconds(time.getSeconds());

      return date
    },
    (obj: any) => {
      if (!props.p.time) return

      const date = new Date(props.p.time);
      obj.date1 = date.toString();
      obj.date2 = date.toString();
    }
  ],
  repeat: [
    (obj: any) => {
      return obj.date3
    },
    (obj: any) => {
      if (!props.p.time) return

      obj.date3 = props.p.time;
    }
  ]
}

const sizeForm = reactive({
  name: "",
  region: "",
  time: {
    funcs: timeFuncs
  },
  date1: "",
  date2: "",
  date3: "",
  delivery: false,
  type: [],
  restrictions: "Unrestricted",
  resourceday: "",
  resourcetimes: "",
  desc: "",
  timenine: "",
  selectedType: "month",
  weekday: "",
  monthday: "",
});
const planB = ref(false);
const selectedType = ref()
const input = ref()
const fields = ref()
const node = ref({
  conditions: {}
})
const daysInMonth = computed(() => {
  const days = [];
  for (let i = 1; i <= 31; i++) {
    days.push(i);
  }
  return days;
});
const daysOfWeek = computed(() => ["一", "二", "三", "四", "五", "六", "日"]);

const props = defineProps<{
  p: any
}>();

function saveData() {
  const lp: string = props.p.labelPosition
  if (!lp) return

  const funcs = sizeForm.time.funcs

  const [parse] = funcs[lp.toLowerCase()]

  props.p.time = parse(sizeForm);
}

type IRegSaveFunc = (regFunc: () => void) => void
const regSaveFunc: IRegSaveFunc = inject('save')!
regSaveFunc(saveData)

const dictFilter = ref();

onMounted(() => {

  // sync time
  if (props.p.labelPosition) {
    const [, analyze] = sizeForm.time.funcs[props.p.labelPosition!.toLowerCase()]

    analyze(sizeForm)
  }

  getdictFilterTree();
});
/**
 * 获取字典树
 */
const getdictFilterTree = async () => {
  let res = await dictFilterTree();
  dictFilter.value = res.data;
};

/**
 * 添加条件条件组b
 */
const addGroup = () => {
  planB.value = !planB.value;
};
// 使用 ref 创建一个引用
const childRef = ref<any>(null); // 确保 ref 初始化为 null
const childRefB = ref<any>(null); // 确保 ref 初始化为 null

// 设置调用子组件方法的函数
const callChildMethod = () => {
  // 通过引用调用子组件的方法
  try {
    childRef.value?.addGroup();
  } catch (error) {
    console.error("Error occurred in submitDrawer:", error);
  }
};
// 设置调用子组件方法的函数
const callChildMethodB = () => {
  // 通过引用调用子组件的方法
  try {
    childRefB.value?.addGroup();
  } catch (error) {
    console.error("Error occurred in submitDrawer:", error);
  }
};

</script>

<template>
  <div>
    <el-form ref="form" :model="sizeForm" label-width="auto" label-position="top">

      <el-form-item label="流程类型：" label-class="custom-label">
        <div>
          <div class="custom-radio-group">
            <div class="custom-radio-button" :class="{ active: p.labelPosition === 'single' }"
              @click="p.labelPosition = 'single'">
              <el-icon>
                <AlarmClock />
              </el-icon>定时型-单次
            </div>
            <div class="custom-radio-button" :class="{ active: p.labelPosition === 'Repeat' }"
              @click="p.labelPosition = 'Repeat'">
              <el-icon>
                <AlarmClock />
              </el-icon>定时型-重复
            </div>
            <div class="custom-radio-button" :class="{ active: p.labelPosition === 'type' }"
              @click="p.labelPosition = 'type'">
              <el-icon>
                <Pointer />
              </el-icon>触发型
            </div>
          </div>
        </div>
      </el-form-item>
      <div v-if="p.labelPosition === 'single'">
        <!-- 单次模块内容 -->

        <el-form-item label="流程开始时间（任务开始时间）：" label-class="custom-label">
          <div class="flex-column">
            <div>
              客户在&nbsp;&nbsp;
            </div>
            <el-date-picker v-model="sizeForm.date1" type="date" label="选择日期" placeholder="选择日期"
              style="width: 150px" />&nbsp;
            <el-time-picker v-model="sizeForm.date2" label="选择时间" placeholder="选择时间" style="width: 80px" />
            <div>
              &nbsp;&nbsp;进入流程
            </div>
          </div>
        </el-form-item>
      </div>

      <div v-else-if="p.labelPosition === 'Repeat'">
        <!-- 重复模块内容 -->
        <el-form-item label="流程有效期：" label-class="custom-label">
          <el-col :span="12">
            <el-date-picker v-model="sizeForm.date3" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" />
          </el-col>

        </el-form-item>

        <el-form-item label="流程开始时间(任务开始时间):" label-class="custom-label">
          <div class="flex-column">
            <el-text> 客户在&nbsp;
            </el-text>
            <el-select v-model="sizeForm.selectedType" style="width: 100px">
              <el-option value="month" label="月份">月</el-option>
              <el-option value="week" label="周">周</el-option>
              <el-option value="day" label="天">天</el-option>
            </el-select>
            &nbsp;

            <el-select v-if="sizeForm.selectedType === 'month'" v-model="sizeForm.monthday" placeholder="选择月份的天数"
              style="width: 150px" multiple collapse-tags>
              <el-option v-for="day in daysInMonth" :key="day" :label="`${day}号`" :value="day"></el-option>
            </el-select>
            &nbsp;

            <el-select v-if="sizeForm.selectedType === 'week'" v-model="sizeForm.weekday" placeholder="选择星期几"
              style="width: 150px" multiple collapse-tags>
              <el-option v-for="(day, index) in daysOfWeek" :key="index" :label="`星期${day}`" :value="day"></el-option>
            </el-select>
            &nbsp;

            <el-time-picker v-model="sizeForm.timenine" placeholder="选择时间" style="width: 120px"></el-time-picker>
            &nbsp;
            <el-text>进入流程(启动任务)
            </el-text>

          </div>
        </el-form-item>
        <div>

          <el-form-item label="进入流程限制:" label-class="custom-label">

            <el-radio-group v-model="sizeForm.restrictions">
              <!-- Unrestricted
              Enter once
              Entered multiple times -->
              <el-radio label="Unrestricted">不限制</el-radio>
              <el-radio label="once">进入一次</el-radio>
              <el-radio label="multiple">进入多次</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="flex-column" v-if="sizeForm.restrictions === 'multiple'">
            <el-text>当前流程，同一客户</el-text>&nbsp;
            <el-input style="width: 100px" v-model="sizeForm.resourceday" label="First Name" placeholder="First Name" />
            <el-text>&nbsp;天内，最多进入</el-text>&nbsp;
            <el-input style="width: 100px" v-model="sizeForm.resourcetimes" label="First Name" placeholder="First Name" />
            <el-text> &nbsp;次
            </el-text>

          </div>
        </div>
      </div>

      <div v-else-if="p.labelPosition === 'type'">
        <!-- 触发型模块内容 -->
        <el-form-item label="流程有效期：" label-class="custom-label">
          <el-col :span="12">
            <el-date-picker v-model="sizeForm.date3" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" />
          </el-col>

        </el-form-item>

        <el-form-item>

          <div class="pannel">
            <div class="toppannel">
              触发事件组A
            </div>
            <div class="garyblock">
              <el-text>在流程有效期内依次完成下列事件后</el-text>&nbsp;
              &nbsp;
              <el-text type="primary" style="cursor: pointer;" @click="callChildMethod()">
                <el-icon size="14">
                  <CirclePlusFilled />
                </el-icon>
                添加事件
              </el-text>
            </div>
            <!-- <EventGroupFilter v-model="node.conditions" :filter-fields="fields" :dictFilter="dictFilter" ref="childRef" /> -->

          </div>
        </el-form-item>

        <div class="underright" v-show="!planB" @click="addGroup">
          <el-icon size="14">
            <CirclePlusFilled />
          </el-icon> 添加事件组b

        </div>
        <el-form-item v-show="planB">
          <div class="pannel">

            <div class="toppannel" style="    display: flex;
            justify-content: space-between;">
              触发事件组B

              <el-text type="primary" style="cursor: pointer;" @click="addGroup">
                <el-icon size="14">
                  <Delete />
                </el-icon>
                删除事件
              </el-text>
            </div>
            <div class="garyblock" style="    display: flex;
            justify-content: space-between;">
              <div>
                <el-text>且在</el-text>&nbsp;
                <el-input v-model="input" type="number" style="width: 100px" />&nbsp;
                <el-select v-model="selectedType" style="width: 150px">
                  <el-option value="month" label="月份">分钟</el-option>
                  <el-option value="week" label="周">小时</el-option>
                  <el-option value="day" label="天">天</el-option>
                </el-select>&nbsp;
                <el-text>后立即判断</el-text>
                &nbsp;
                <el-select v-model="selectedType" style="width: 150px">
                  <el-option value="month" label="月份">分钟</el-option>
                  <el-option value="week" label="周">小时</el-option>
                  <el-option value="day" label="天">天</el-option>
                </el-select>&nbsp;
              </div>
              <el-text type="primary" style="cursor: pointer;" @click="callChildMethodB()">
                <el-icon size="14">
                  <CirclePlusFilled />
                </el-icon>
                添加事件
              </el-text>
            </div>
            <!-- <EventGroupFilter ref="childRefB" v-model="node.conditions" :filter-fields="fields"
              :dictFilter="dictFilter" /> -->

          </div>
        </el-form-item>
        <div>

          <el-form-item label="进入流程限制:" label-class="custom-label">

            <el-radio-group v-model="sizeForm.restrictions">
              <!-- Unrestricted
              Enter once
              Entered multiple times -->
              <el-radio label="Unrestricted">不限制</el-radio>
              <el-radio label="once">进入一次</el-radio>
              <el-radio label="multiple">进入多次</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="flex-column" v-if="sizeForm.restrictions === 'multiple'">
            <el-text>当前流程，同一客户</el-text>&nbsp;
            <el-input style="width: 100px" v-model="sizeForm.resourceday" label="First Name" placeholder="First Name" />
            <el-text>&nbsp;天内，最多进入</el-text>&nbsp;
            <el-input style="width: 100px" v-model="sizeForm.resourcetimes" label="First Name" placeholder="First Name" />
            <el-text> &nbsp;次
            </el-text>

          </div>
        </div>
      </div>

    </el-form>
  </div>
</template>

<style scoped lang="scss">
.flex-column {
  display: -webkit-inline-box !important;
  align-items: flex-start !important;
  flex-direction: column !important;
}

.pannel {
  width: 100%;
  min-height: 200px;
  //padding: 18px 15px;
  background-color: #f5f8fc;
}

.underright {
  background: #edeff4;
  border-radius: 4px 4px 0px 0px;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  padding: 12px 24px 12px 24px;
  cursor: pointer;
  color: #4078e0;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.filter-filter-item__add {
  position: absolute;
  right: 12px;
}

:deep(.el-form--default.el-form--label-top .el-form-item .el-form-item__label) {
  margin-bottom: 8px;
  line-height: 22px;
  font-size: 16px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
  line-height: 24px;
}

.custom-radio-group {
  display: flex;
}

.custom-radio-button {
  cursor: pointer;
  padding: 4px 8px;
  margin-right: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
  border: 1px solid #e5e5e5;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.custom-radio-button:hover {
  background-color: #f0f0f0;
}

.custom-radio-button.active {
  background-color: #4078e0;
  color: #fff;
}

.toppannel {
  background: #edeff4;
  border-radius: 4px 4px 0px 0px;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  padding: 12px 24px 12px 24px;
}

.garyblock {
  padding: 12px 24px 12px 24px;
}
</style>
