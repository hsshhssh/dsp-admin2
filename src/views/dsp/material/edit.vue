<template>
  <div class="app-container">
    <el-form ref="postForm" :model="temp" :rules="rules" label-position="right" label-width="120px">
      <!--<el-form-item label="平台广告id">-->
        <!--<el-input v-model="temp.padplacementid" :disabled="true"/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="平台媒体">-->
        <!--<el-input v-model="temp.pmediaStr" :disabled="true"/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="广告位id">-->
        <!--<el-input v-model="temp.adplacementid" :disabled="true"/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="广告位">-->
        <!--<el-input v-model="temp.adplacementname" :disabled="true"/>-->
      <!--</el-form-item>-->

      <el-form-item label="素材名称">
        <el-input v-model="temp.name"/>
      </el-form-item>

      <!--<el-form-item label="价格">-->
        <!--<el-input v-model="temp.price"/>-->
      <!--</el-form-item>-->
      <el-form-item label="创意id">
        <el-input v-model="temp.crid" :disabled="true"/>
      </el-form-item>
      <el-form-item label="素材类型">
        <el-select placeholder="" v-model="temp.adtype">
          <el-option v-for="item in adtypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
      </el-form-item>
      <!--ext-->
      <el-form-item label="曝光监测对象url" v-if="false">
        <el-input v-model="temp.pmoUrl"/>
      </el-form-item>
      <el-form-item label="点击监控对象url" v-if="false">
        <el-input v-model="temp.cmoUrl"/>
      </el-form-item>

      <!--adm-->
      <el-form-item label="dsp段素材id">
        <el-input v-model="temp.adm.adId" :disabled="true"/>
      </el-form-item>
      <el-form-item label="dsp段素材url">
        <el-upload
        class="upload-demo"
        :action="uploadApi"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        multiple
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :on-success="handleUploadSucc">
        <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-link type="success">{{temp.adm.materialUrl}}</el-link>
        <!--<el-input v-model="temp.adm.materialUrl" :disabled="true"/>-->
      </el-form-item>
      <!--adm inner-->
      <el-form-item label="跳转落地页地址">
        <el-input v-model="temp.adm.dspApiMaterialInnerReqDTO.landingpage"/>
      </el-form-item>
      <el-form-item label="平台">
        <el-radio-group v-model="temp.adm.dspApiMaterialInnerReqDTO.platform">
          <el-radio :label="1">pc</el-radio>
          <el-radio :label="2">移动</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="物料类型">
        <el-radio-group v-model="temp.adm.dspApiMaterialInnerReqDTO.materialtype">
          <el-radio :label="0">图片</el-radio>
          <el-radio :label="1">视频贴片</el-radio>
          <el-radio :label="2">flash</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-collapse v-model="admType" style="margin-bottom: 30px">
        <el-collapse-item name="1">
          <template slot="title">
            <strong style="font-size: 120%">PC </strong><i class="header-icon el-icon-info"></i>
          </template>
          <el-form-item label="广告标题">
            <el-input v-model="temp.adm.dspApiMaterialInnerReqDTO.pc.title"/>
          </el-form-item>
          <el-form-item label="广告描述">
            <el-input v-model="temp.adm.dspApiMaterialInnerReqDTO.pc.desc"/>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <strong style="font-size: 120%">Mobile </strong><i class="header-icon el-icon-info"></i>
          </template>
          <el-form-item label="广告标题">
            <el-input v-model="temp.adm.dspApiMaterialInnerReqDTO.mobile.title"/>
          </el-form-item>
          <el-form-item label="广告描述">
            <el-input v-model="temp.adm.dspApiMaterialInnerReqDTO.mobile.desc"/>
          </el-form-item>
          <el-form-item label="APP应用名称">
            <el-input v-model="temp.adm.dspApiMaterialInnerReqDTO.mobile.apkname"/>
          </el-form-item>
          <el-form-item label="包名">
            <el-input v-model="temp.adm.dspApiMaterialInnerReqDTO.mobile.package"/>
          </el-form-item>
          <el-form-item label="APP唯一id号">
            <el-input v-model="temp.adm.dspApiMaterialInnerReqDTO.mobile.appstoreid"/>
          </el-form-item>
          <el-form-item label="广告类型">
            <el-radio-group v-model="temp.adm.dspApiMaterialInnerReqDTO.mobile.adtype">
              <el-radio :label="-1">无</el-radio>
              <el-radio :label="0">普通广告</el-radio>
              <el-radio :label="1">app下载</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template slot="title">
            <strong style="font-size: 120%">Video </strong><i class="header-icon el-icon-info"></i>
          </template>
          <el-form-item label="播放时长">
            <el-input v-model="temp.adm.dspApiMaterialInnerReqDTO.video.duration"/>
          </el-form-item>
          <el-form-item label="静态封面素材">
            <el-input v-model="temp.adm.dspApiMaterialInnerReqDTO.video.coverimg"/>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>

      <el-form-item label="素材宽度">
        <el-input v-model="temp.adm.width"/>
      </el-form-item>
      <el-form-item label="素材高度">
        <el-input v-model="temp.adm.height"/>
      </el-form-item>
      <el-form-item label="icon url">
        <el-input v-model="temp.adm.iconurl"/>
      </el-form-item>
      <el-form-item label="按钮文字">
        <el-input v-model="temp.adm.buttontext"/>
      </el-form-item>
      <el-form-item label="安装量">
        <el-input v-model="temp.adm.installcount"/>
      </el-form-item>
      <el-form-item label="星级推荐">
        <el-input v-model="temp.adm.starcount"/>
      </el-form-item>
      <el-form-item label="Deeplink url">
        <el-input v-model="temp.adm.dplurl"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import { getMaterial, saveMaterial } from '@/api/dsp/material'
  import waves from '@/directive/waves' // Waves directive
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  const adtypeOptions = [
    { key: "h", display_name: 'H5' },
    { key: "", display_name: '其他' }
  ]

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    filters: {

    },
    data() {
      return {
        adtypeOptions,
        fileList: [],
        rules: {
        },
        temp: {
          title: "",
          adType: undefined,
          adm:{
            materialUrl:"",
            dspApiMaterialInnerReqDTO:{
              pc:{
                "title":undefined
              },
              mobile:{
                "adtype":-1
              },
              video:{},
              materialtype: ""
            }
          },
          ext: {},
          pmoUrl:"",
          cmoUrl:""
        },
        admType: "",
        uploadApi: process.env.BASE_API + "/dsp/upload"
      }
    },
    created() {
      this.getMaterial()
    },
    methods: {
      getMaterial() {
        var query = {
          "id": this.$route.query.id === undefined ? -1 : this.$route.query.id
        }
        getMaterial(query).then(response => {
          this.temp = response.data

          // 处理materialUrl
          if (this.temp.adm.materialUrl != undefined && this.temp.adm.materialUrl !== "") {
            var arr = this.temp.adm.materialUrl.split("/")
            this.fileList = [
              {
                name: arr[arr.length - 1],
                url: this.temp.adm.materialUrl
              }
            ]
          }

          // 处理materialtype
          if (this.temp.adm.dspApiMaterialInnerReqDTO.materialtype != undefined && this.temp.adm.dspApiMaterialInnerReqDTO.materialtype !== "") {
            this.temp.adm.dspApiMaterialInnerReqDTO.materialtype = parseInt(this.temp.adm.dspApiMaterialInnerReqDTO.materialtype);
          }
          if (this.temp.adm.dspApiMaterialInnerReqDTO.pc === undefined) {
            this.temp.adm.dspApiMaterialInnerReqDTO.pc = {
              "title":"",
              "desc":""
            }
          }
          if (this.temp.adm.dspApiMaterialInnerReqDTO.mobile === undefined) {
            this.temp.adm.dspApiMaterialInnerReqDTO.mobile = {
              "title":"",
              "desc":"",
              "apkname":"",
              "package":"",
              "appstoreid":"",
              "adtype":-1,
            }
          }
          if (this.temp.adm.dspApiMaterialInnerReqDTO.video === undefined) {
            this.temp.adm.dspApiMaterialInnerReqDTO.video = {
              "duration":"",
              "coverimg":""
            }
          }

          if (this.temp.ext !== undefined && !this.filterObj(this.temp.ext) && this.temp.ext.pmo !== undefined) {
            this.temp.pmoUrl = this.temp.ext.pmo[0].url
          }
          if (this.temp.ext !== undefined && !this.filterObj(this.temp.ext) && this.temp.ext.cmo !== undefined) {
            this.temp.cmoUrl = this.temp.ext.cmo[0].url
          }
          console.log(this.temp)
        });
      },
      handleRemove() {
        this.fileList = []
        this.temp.adm.materialUrl = ""
        this.temp.adm.dspApiMaterialInnerReqDTO.url = ""
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed() {
        this.$message.warning(`当前限制选择 1 个文件`);
      },
      beforeRemove(file) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleUploadSucc(res, file) {
        if (res.code === '200') {
          this.fileList = [
            {
              name: res.fileName,
              url: res.fileUrl
            }
          ]
          this.temp.adm.materialUrl = res.fileUrl;
          this.temp.adm.dspApiMaterialInnerReqDTO.url = res.fileUrl;
        } else {
          return this.$confirm(`上传失败`);
        }
      },
      onSubmit() {
        if (this.temp.adm.dspApiMaterialInnerReqDTO.materialtype != undefined) {
          this.temp.adm.dspApiMaterialInnerReqDTO.materialtype = this.temp.adm.dspApiMaterialInnerReqDTO.materialtype + ""
        }

        if (this.temp.adm.dspApiMaterialInnerReqDTO.pc !== undefined) {
          if (this.filterObj(this.temp.adm.dspApiMaterialInnerReqDTO.pc)) {
            this.temp.adm.dspApiMaterialInnerReqDTO.pc = undefined;
          }
        }
        if (this.temp.adm.dspApiMaterialInnerReqDTO.mobile !== undefined) {
          if (this.filterObj(this.temp.adm.dspApiMaterialInnerReqDTO.mobile)) {
            this.temp.adm.dspApiMaterialInnerReqDTO.mobile = undefined;
          }
        }
        if (this.temp.adm.dspApiMaterialInnerReqDTO.video !== undefined) {
          if (this.filterObj(this.temp.adm.dspApiMaterialInnerReqDTO.video)) {
            this.temp.adm.dspApiMaterialInnerReqDTO.video = undefined;
          }
        }
        this.temp.ext = {
          "pmo": [
            {
              "type_mma":0,
              "url": this.temp.pmoUrl
            }
          ],
          "cmo": [
            {
              "type_mma":0,
              "url": this.temp.cmoUrl
            }
          ]
        }
        console.log(this.temp)
        saveMaterial(this.temp).then(response => {
          this.$message.success(`${response.data}`)
          this.$router.push({path: '/material/index'})
        })
      },
      filterObj(obj) {
        for (var key in obj) {
          if (obj[key] !== '' && obj[key] !== -1)
            return false;
        }
        return true;
      }
    }
  }
</script>

<style type="text/css">
  .line_01{
    padding: 0 20px 0;
    margin: 20px 0;
    line-height: 1px;
    border-left: 200px solid #ddd;
    border-right: 200px solid #ddd;
    text-align: center;
  }
</style>
