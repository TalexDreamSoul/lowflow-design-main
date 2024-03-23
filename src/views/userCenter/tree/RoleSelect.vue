<script setup lang="ts" name="RoleSelect">
import { ref, watchEffect } from 'vue'

const props = defineProps<{
  data: any,
  select: Array<any>
}>()

const data1 = ref<any[]>([])
const data2 = ref<any[]>([])
const data3 = ref<any[]>([])

const dom1 = ref()
const dom2 = ref()
const dom3 = ref()

const defaultProps = {
  children: '_',
  label: 'menuName',
}

console.log("rs", props)

function transformData(data: any) {

  // 拿到第一层
  for (let floor1 of data) {
    for (let floor2 of floor1.subMenus) {
      for (let floor3 of floor2.subMenus) {

      }

    }

    data1.value.push(floor1)
  }

}

watchEffect(() => {
  $ignored: props

  const { data } = props

  transformData(data)
})

function select(data: any, floor: number) {
  if (floor === 0) {
    // 第一层
    const floor1Checked = dom1.value.getCheckedNodes()
    const totalData = props.data

    // 筛选出没有选中的node
    const checkoutList = [...totalData].filter((item: any) => floor1Checked.some((each: any) => each.id === item.id))
    props.select[0] = [...checkoutList].map(item => item.id)

    const pendingList: any[] = []

    // 对每一个选中的递归去选中子元素
    const arr = [...checkoutList].map(each => {
      const { subMenus } = each

      return subMenus.map((_each: any) => {

        pendingList.push(() => select(_each, 1))

        return _each.id
      })
    }).flat()

    props.select[1] = new Set([...props.select[1], ...arr])

    setTimeout(() => {
      pendingList.forEach(a => a())

      floor1Change(dom1.value.getCurrentNode())

      // 清空没有选中node的id => 递归
      const checkoutListNodes = [...checkoutList].map(item => item.subMenus).flat()

      props.select[1] = new Set([...props.select[1]].filter(item => !checkoutListNodes.some(each => each.id === item)))
      dom2.value.setCheckedKeys(props.select[1])

      console.log("HERE", checkoutListNodes)
    }, 0);
  } else if (floor === 1) {
    // 第二层
    // const floor2Checked = data //dom2.value.getCheckedNodes()

    console.log("floor2222", data)

    const arr = [...data.subMenus].map(each => each.id)

    // dom3.value.setCheckedKeys(arr)
    props.select[2] = new Set([...props.select[2], ...arr])

    // const floor2Checked = dom2.value.getCheckedNodes()

    // ![...floor2Checked].forEach(item => select(item, 2))

    console.log("2", data)
  } else if (floor === 2) {
    // 第三层
    const { subMenus } = data

    const arr = [...subMenus].map(each => each.id)

    dom3.value.setCheckedNodes(arr)

    console.log('3', arr, data)
  }
}

function handleSave() {
  return []
}

function floor1Check(checkedNodes: any) {
  const { $treeNodeId } = checkedNodes

  console.log("第一层选中", checkedNodes)

  dom1.value.setCurrentKey($treeNodeId)

  floor1Change(checkedNodes)

  select(checkedNodes, 0)
}

function floor1Change(data: any) {
  console.log("floor1", data)

  dom2.value.setCheckedKeys(props.select[1])

  console.log(props.select)

  data2.value = [...data.subMenus]
  data3.value = []
}

function floor2Change(data: any, node: any) {
  console.log("floor2", data, node)

  dom3.value.setCheckedKeys(props.select[2])

  data3.value = [...data.subMenus]
}

function areArraysEqual(arr1, arr2) {
  // 使用 every() 方法检查两个数组是否完全一样
  return arr1.every((item, index) => [ ...arr2 ].includes(item));
}

/**
 * 返回三个数字
 * 2: 代表全选
 * 1: 代表半选
 * 0: 代表未选
 */
function getCheckStatus(data: any, floor: number = 1) {
  const selected = props.select[1]
  const thisArr = [...data.subMenus].map((item: any) => item.id)

  // 判断选中是否为空
  if (!selected.length) return 0;

  // 判断 selected 和 thisArr 必须完全一样
  if (areArraysEqual(selected, thisArr)) {
    return 2
  }

  return 1
}

defineExpose({ handleSave })
</script>

<template>
  <div class="RoleSelect">
    <el-tree @current-change="floor1Change" ref="dom1" :props="defaultProps" :data="data1" node-key="id">
      <template v-slot="{ node, data }">
        <el-checkbox v-model="data.$check" :indeterminate="getCheckStatus(data) === 1" @change="floor1Check(data)" />
        {{ data.menuName }}
      </template>
    </el-tree>
    <el-tree @current-change="floor2Change" ref="dom2" :props="defaultProps" :data="data2" show-checkbox
      node-key="id" />
    <!-- v-if="data3?.length" -->
    <el-tree ref="dom3" :props="defaultProps" :data="data3" show-checkbox node-key="id" />
  </div>
</template>

<style lang="scss">
.RoleSelect {
  &>* {
    flex: 1;

    &:last-child {
      border-right: none;
    }

    border-right: 1px solid #000;
  }

  display: flex;

  align-items: stretch;
  justify-content: space-between;

  border: 1px solid #000;
}
</style>