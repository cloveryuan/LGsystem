<template>
  <div class="editCourse">
    <div class="header">
      <div class="el-page-header" >
        <div class="el-page-header__left" @click="$router.back()">
          <i class="el-icon-back" size="20" style="font-size:14px;cursor:pointer;"  />
          <div class="el-page-header__title">返回</div>
        </div>
        <div class="el-page-header__content">{{courseId}}</div>
      </div>
      <!-- <el-button type="primary">保存</el-button> -->
    </div>
    <el-steps :active="activeStep" finish-status="success"  simple>
      <el-step
       style="cursor:pointer;"
        :title="item.title"
        v-for="(item, index) in steps"
        :key="index"
        @click.native="activeStep = index"
      ></el-step>
    </el-steps>
    <el-card class="box-card">
      <el-form label-width="120px" ref="form" :model="course" :rules="rules">
        <template v-if="activeStep===0" >
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="course.courseName"></el-input>
          </el-form-item>
          <el-form-item label="课程简介" >
            <el-input v-model="course.brief"></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input
              style="margin-bottom: 10px"
              v-model="course.previewFirstField"
              type="textarea"
              placeholder="概述1"
            ></el-input>
            <el-input
              v-model="course.previewSecondField"
              type="textarea"
              placeholder="概述2"
            ></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名" prop="teacherDTO.teacherName">
            <el-input v-model="course.teacherDTO.teacherName"></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="course.teacherDTO.description"></el-input>
          </el-form-item>
          <el-form-item label="课程封面">
            <course-image
              v-model="course.courseListImg"
              :limit="5"
            />
            <el-tag >建议尺寸：230*300px，JPG、PNG格式，图片小于150K</el-tag>
          </el-form-item>
          <el-form-item label="介绍封面">
             <course-image
              v-model="course.courseImgUrl"
              :limit="5"
            />
            <el-tag>建议尺寸：750*422px，JPG、PNG格式，图片小于150K</el-tag>
          </el-form-item>
          <el-form-item label="课程排序" sortNum>
            <el-input-number
              v-model="course.sortNum"
              label="描述文字"
            ></el-input-number>
          </el-form-item>
        </template>
        <template v-if="activeStep===1">
          <el-form-item label="售卖价格">
            <el-input v-model.number="course.discounts" type="number">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input v-model.number="course.price" type="number">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input v-model.number="course.sales" type="number">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model="course.discountsTag"></el-input>
          </el-form-item>
        </template>
        <template v-if="activeStep===2">
          <el-form-item label="限时秒杀开关">
            <el-switch
              v-model="course.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
          <template v-if="course.activityCourse">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="course.activityCourseDTO.beginTime"
                type="date"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="course.activityCourseDTO.endTime"
                type="date"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input v-model.number="course.activityCourseDTO.amount" type="number">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="秒杀库存">
              <el-input v-model.number="course.activityCourseDTO.stock" type="number">
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </template>
        <template v-if="activeStep===3">
          <el-form-item label="课程详情">
            <text-editor v-model="course.courseDescriptionMarkDown" />
          </el-form-item>
          <el-form-item label="是否发布">
            <el-switch
              v-model="course.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              v-loading="submitLoading"
              @click="handleSave"
            >保存</el-button>
          </el-form-item>
        </template>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  saveOrUpdateCourse,
  getCourseById
} from '@/services/course'
import CourseImage from './CourseImage.vue'
import TextEditor from './TextEditor'
import moment from 'moment'

export default Vue.extend({
  name: 'editCourse',
  props: {
    courseId: {
      type: [String, Number]
    }
  },
  components: {
    CourseImage,
    TextEditor
  },
  data () {
    return {
      activeStep: 0,
      steps: [
        { title: '基本信息' },
        { title: '销售信息' },
        { title: '秒杀活动' },
        { title: '课程详情' }
      ],
      course: {
        // id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0, // 0：未发布，1：已发布
        sales: 0,
        activityCourse: false, // 是否开启活动秒杀
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      },
      submitLoading: false,
      rules: {
        courseName: { required: true, message: '必填项', trigger: 'blur' },
        'teacherDTO.teacherName': { required: true, message: '必填项', trigger: 'blur' }
      }
    }
  },
  created () {
    if (this.courseId) {
      this.loadCourse()
    }
  },
  methods: {
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      const { activityCourseDTO } = data
      activityCourseDTO.beginTime = moment(activityCourseDTO.beginTime).format('YYYY-MM-DD')
      activityCourseDTO.endTime = moment(activityCourseDTO.endTime).format('YYYY-MM-DD')
      this.course = data
    },
    async handleSave () {
      try {
        this.submitLoading = true
        await this.$refs.form.validate()
        const { code } = await saveOrUpdateCourse(this.course)
        if (code === '000000') {
          this.$router.back()
          this.$message.success('提交成功')
        } else {
          this.$message.error('提交失败')
          this.submitLoading = false
        }
        this.submitLoading = false
      } catch (err) {
        this.$message.error('提交失败')
        this.submitLoading = false
      }
    }
  }
})
</script>

<style  lang="scss" scoped>
.header{
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom:20px;
}
</style>
