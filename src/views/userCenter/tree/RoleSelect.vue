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

console.log("rs", props, data1.value)

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
    const floor1Checked = [data] //dom1.value.getCheckedNodes()

    const pendingList: any[] = []

    const arr = [...floor1Checked].map(each => {
      const { subMenus } = each

      return subMenus.map(_each => {

        pendingList.push(() => select(_each, 1))

        console.log("_Each", _each)

        return _each.id
      })
    }).flat()

    dom2.value.setCheckedKeys(arr)

    setTimeout(() => {
      pendingList.forEach(a => a())
    }, 0);

    console.log("1", floor1Checked, arr, dom2)
  } else if (floor === 1) {
    // 第二层
    // const floor2Checked = data //dom2.value.getCheckedNodes()

    console.log("floor2222", data)

    const arr = [...data.subMenus].map(each => each.id)

    dom3.value.setCheckedKeys(arr)

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

  console.log("checkedNodes", checkedNodes)

  dom1.value.setCurrentKey($treeNodeId)

  // const node = dom1.value.getNode($treeNodeId)

  floor1Change(checkedNodes)

  select(checkedNodes, 0)
}

function floor1Change(data: any) {
  console.log("floor1", data)

  data2.value = [...data.subMenus]
  data3.value = []
}

function floor2Change(data: any, node: any) {
  console.log("floor2", data, node)

  data3.value = [...data.subMenus]
}

defineExpose({ handleSave })
</script>

<template>
  <div class="RoleSelect">
    <el-tree @check="floor1Check" @current-change="floor1Change" ref="dom1" :props="defaultProps" :data="data1"
      show-checkbox node-key="id" />
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