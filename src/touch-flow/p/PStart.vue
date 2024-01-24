<script setup lang="ts">
import { ref, reactive, computed, provide } from "vue";
import { Stamp, Plus } from "@element-plus/icons-vue";
import ConditionSetAttr from "../p/start/ConditionSetAttr.vue";
import CustomersAttr from "../p/start/CustomersAttr.vue";
import PolicySettingsAttr from "../p/start/PolicySettingsAttr.vue";
const props = defineProps<{
  p?: any;
}>();

const dialogVisible = ref(false);
const drawerOptions = reactive({
  visible: false,
});

function openCondition() {
  openDrawer({
    title: "流程类型设置",
    comp: ConditionSetAttr,
  });
}

function openCustomer() {
  openDrawer({
    title: "受众客户设置",
    comp: CustomersAttr,
  });
}

function openDrawer(comp: any) {
  dialogVisible.value = false;

  Object.assign(drawerOptions, comp);

  if (!props.p.labelPosition) props.p.labelPosition = "single";

  drawerOptions.visible = true;
}

const flowType = computed(() => {
  if (!props.p?.labelPosition) return "-";
  const map: { [key: string]: string } = {
    single: "定时型-单次",
    repeat: "定时型-重复",
    type: "触发型",
  };

  const s: string = props.p?.labelPosition;

  return map[s.toLowerCase()];
});

const flowTime = computed(() => {
  const _time = props.p.time;
  if (!_time) return "-";

  if (_time instanceof Date) {
    const s: Date = _time;

    return s.toLocaleString().replaceAll("/", "-");
  }

  const [date1, date2] = _time;
  if (!date1 || !date2) return "-";

  const date1Text = date1.toLocaleDateString().replaceAll("/", "-");
  const date2Text = date2.toLocaleDateString().replaceAll("/", "-");

  return `${date1Text} 至 ${date2Text}`;
});

const conditioned = computed(
  () => flowType.value !== "-" && flowTime.value !== "-"
);

const doDiverse = computed(() => {
  const { children } = props.p;

  if (!children?.length) return false;

  return [...children].find((child) => "PolicySettings" === child?.type);
});

const _comps = [
  {
    icon: {
      type: "comp",
      value: Stamp,
    },
    title: "选择策略器",
    desc: "按客户属性行为或触发事件对客户筛选分流，并执行动作。",
    comp: PolicySettingsAttr,
  },
  {
    icon: {
      type: "comp",
      value: Stamp,
    },
    title: "分流器",
    desc: "按设置的比例自动对客户随机分流，并执行动作。",
    show: () => !doDiverse.value,
    comp: ConditionSetAttr,
  },
  {
    icon: {
      type: "comp",
      value: Stamp,
    },
    title: "兜底选择器",
    desc: "筛选未进入本节点下选择策略器的客户，并执行动作。",
    show: () => doDiverse.value,
    comp: ConditionSetAttr,
  },
];

let _saveFunc: (() => boolean) | null = null;

function handleSave() {
  if (!_saveFunc || !_saveFunc()) return;

  dialogVisible.value = false;
  drawerOptions.visible = false;
}

const comps = computed(() => _comps.filter((comp) => comp?.show?.() ?? true));

provide("save", (regFunc: () => boolean) => {
  _saveFunc = regFunc;
});
</script>

<template>
  <el-card class="PBlock">
    <p>进入流程设置</p>
    <div class="PBlock-Content">

      <div @click=openCustomer class="PBlock-Section">
        <p>
          <el-icon>
            <User />
          </el-icon>
          受众客户
        </p>
        <span>根据客户属性、客户标签、客户行为、行为序列筛选能够进入流程的客户</span>
      </div>
      <div @click="openCondition" :class="{ checked: conditioned }" class="PBlock-Section">
        <p>
          <el-icon>
            <Position />
          </el-icon>
          进入条件
          <span v-if="conditioned">
            <el-icon>
              <CircleCheckFilled />
            </el-icon>
          </span>
        </p>
        <span v-if="conditioned" style="opacity: .75;font-size: 14px">
          <span>流程类型：<span class="contentdeep">{{ flowType }}</span></span><br />
          <span>进入时间：<span class="contentdeep">{{ flowTime }}</span></span><br />
        </span>
        <span v-else>设置流程类型、流程有效期、流程开始时间、进入限制。</span>
      </div>
    </div>

    <teleport to="body">
      <el-dialog v-model="dialogVisible" width="30%" title="请选择添加类型" align-center>
        <div class="Dialog-Sections">
          <div @click="openDrawer(item)" v-for="item in comps" class="PBlock-Section">
            <p>
              <el-icon v-if="item.icon.type === 'comp'">
                <component :is="item.icon.value" />
              </el-icon>
              <img v-else :src="item.icon.value" />
              {{ item.title }}
            </p>
            <span v-text="item.desc" />
          </div>
        </div>
      </el-dialog>
    </teleport>

    <teleport to="body">
      <el-drawer v-model="drawerOptions.visible" :title="drawerOptions.title"  size="45%">
        <component :p="p" :is="drawerOptions.comp" />
        <template #footer>
          <el-button round @click="drawerOptions.visible = false">取消</el-button>
          <el-button round @click="handleSave" type="primary" primaryStyle>保存</el-button>
        </template>
      </el-drawer>
    </teleport>
  </el-card>

  <el-button :class="{ display: conditioned }" @click="dialogVisible = true" class="start-add" type="primary" :icon="Plus" circle />
</template>

<style lang="scss">
.Dialog-Sections {
  p {
    margin: 0;
  }

  display: flex;

  gap: 2rem;
}

.PBlock-Section {
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
      background: linear-gradient(
        82deg,
        rgba(64, 120, 224, 0.4) 0%,
        rgba(64, 120, 224, 0) 100%
      );
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
  width: 50%;
}

.PBlock-Section .el-icon {
  top: 0.125rem;

  margin-bottom: 0.5rem;
}
</style>