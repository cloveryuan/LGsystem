<template>
  <el-card>
    <div v-for="item in allData" :key="item.id" class="layout_top">
      <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="(val)=>handleCheckAllChange(val,item)" class="layout_style">{{item.name}}</el-checkbox>
      <el-checkbox-group v-model="item.checked" @change="(val)=>handleCheckedCitiesChange(val,item)" class="layout_style el-row" style="background:#fff;">
        <el-checkbox v-for="menu in item.resourceList"  :label="menu.id" :key="menu.id" style="padding: 4px 0px;margin-right:0;" class="el-col-8">{{menu.name}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div style="margin-top:20px;text-align:right;">
    <el-button @click="save"  type="primary">保存</el-button>
    <el-button  @click="clear" type="text">清空</el-button>
    <el-button  @click="$router.back()" type="text">返回</el-button>
   </div>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { getRoleResources, allocateRoleResources } from '@/services/role'

export default Vue.extend({
  name: 'allocResource',
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      allData: []
    }
  },
  mounted () {
    this.getInitData()
  },
  components: {

  },
  methods: {
    async getInitData () {
      // try {
      //   const allCategory = await getAllCategory()
      //   const allResource = await getAllResource()
      //   allResource.data.forEach((f: any) => {
      //     const _index: number = allCategory.data.findIndex((item: any) => item.id === f.categoryId)
      //     if (_index > -1) {
      //       allCategory.data[_index].children ? allCategory.data[_index].children.push(f) : allCategory.data[_index].children = [f]
      //       allCategory.data[_index].checked = []
      //       allCategory.data[_index].isIndeterminate = false
      //       allCategory.data[_index].checkAll = false
      //     }
      //   })
      //   this.allData = allCategory.data
      //   console.log(allCategory.data)
      // } catch (err) {
      //   console.log(err)
      //   this.$message.error('获取所有角色资源出错了')
      // }

      try {
        const { data } = await getRoleResources(this.roleId)
        data.forEach((f: any) => {
          if (f.resourceList) {
            f.checked = f.resourceList.filter((f: any) => !!f.selected).map((m: any) => m.id)
          } else {
            f.resourceList = []
            f.checked = []
          }
          f.isIndeterminate = f.checked.length > 0 && f.checked.length < f.resourceList.length
          f.checkAll = f.resourceList.length > 0 && f.checked.length === f.resourceList.length
        })
        this.allData = data
      } catch (err) {
        console.log(err)
        this.$message.error('获取所有角色资源出错了')
      }
    },

    handleCheckedCitiesChange (val: [], item: any) {
      const checkedCount = val.length
      item.checkAll = item.resourceList.length > 0 && checkedCount === item.resourceList.length
      item.isIndeterminate = checkedCount > 0 && checkedCount < item.resourceList.length
    },
    handleCheckAllChange (val: boolean, item: any) {
      if (val) {
        item.checked = item.resourceList.map((m: any) => m.id)
        item.isIndeterminate = false
      } else {
        item.checked = []
      }
    },
    async save () {
      try {
        const params = {
          roleId: this.roleId,
          resourceIdList: this.allData.map((m: any) => m.checked).flat()
        }
        const { code } = await allocateRoleResources(params)
        if (code === '000000') {
          this.$message.success('分配资源权限成功')
          this.$router.push({ name: 'role' })
        }
      } catch (err) {
        this.$message.error('分配资源权限失败')
      }
    },
    clear () {
      this.allData.forEach((f: any) => {
        f.checked = []
        f.checkAll = false
        f.isIndeterminate = false
      })
    }
  }
})
</script>

<style scoped lang="scss">
.layout_top{
  border-top: 1px solid #dcdfe6;
  .layout_style{
    display: block;
    padding: 20px;
    background: rgb(242, 246, 252);
    border-left: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6
  }
}

</style>
