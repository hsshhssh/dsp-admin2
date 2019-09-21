<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px">
      <el-select v-model="listQuery.pmediaid" placeholder="平台媒体" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in pmediaOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-input placeholder="广告位id" v-model="listQuery.adplacementid" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.type" placeholder="广告位类型" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.platform" placeholder="渠道" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in platformOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.typedeclare" placeholder="广告类型" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in typedeclareOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.mediaid" placeholder="媒体名称" filterable clearable style="width: 150px" class="filter-item" @onchange="handleFilter">
        <el-option v-for="item in mediaOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleSync">手动获取广告位</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="handleClearMedia">刷新媒体</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload" :disabled="buttonDisabled">导出</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">

      <el-table-column label="平台媒体" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.pmediaStr }}</span>
        </template>
      </el-table-column>

      <el-table-column label="广告位ID" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.adplacementid }}</span>
        </template>
      </el-table-column>

      <el-table-column label="广告位名称" prop="id" sortable="custom" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.adplacementname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="媒体名称" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.medianame }}</span>
        </template>
      </el-table-column>

      <el-table-column label="广告位类型" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.typeStr }}</span>
        </template>
      </el-table-column>

      <el-table-column label="渠道" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.platformStr }}</span>
        </template>
      </el-table-column>

      <el-table-column label="广告类型" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.typedeclareStr }}</span>
        </template>
      </el-table-column>

      <el-table-column label="广告位尺寸" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.size }}</span>
        </template>
      </el-table-column>

      <el-table-column label="广告位低价" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.bidfloor }}</span>
        </template>
      </el-table-column>

      <el-table-column label="允许素材类型" prop="id" sortable="custom" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.allowmaterial }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.statusStr }}</span>
        </template>
      </el-table-column>

      <!--<el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">-->
        <!--<template slot-scope="scope">-->
          <!--<router-link :to="'/material/edit?id=' + scope.row.padplacementid">-->
            <!--<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">上传素材</el-button>-->
          <!--</router-link>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
  import { fetchListAdplacement, sync, fetchMediaList, clearMetchList } from '@/api/dsp/adplacement'
  import { Message } from 'element-ui'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  const calendarTypeOptions = [
    { key: 'CN', display_name: 'China' },
    { key: 'US', display_name: 'USA' },
    { key: 'JP', display_name: 'Japan' },
    { key: 'EU', display_name: 'Eurozone' }
  ]

  const pmediaOptions = [
    { key: 1, display_name: '软告' }
  ]

  const platformOptions = [
    { key: 1, display_name: 'pc' },
    { key: 2, display_name: '移动' }
  ]

  const typedeclareOptions = [
    { key: 0, display_name: '单图' },
    { key: 1, display_name: '一图一文' },
    { key: 2, display_name: '一图二文' }
  ]

  const typeOptions = [
    { key: 13, display_name: 'banner' },
    { key: 14, display_name: '原生' },
    { key: 15, display_name: '视频贴片' }
  ]

  const statusOptions = [
    { key: 1, display_name: '初始化' },
    { key: 2, display_name: '已上传素材' },
    { key: 3, display_name: '已竞价' },
    { key: 4, display_name: '已回调' }
  ]

  // arr to obj ,such as { CN : "China", US : "USA" }
  const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      return {
        tableKey: 0,
        list: [],
        total: 10,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          importance: undefined,
          title: undefined,
          type: undefined,
          sort: '+id'
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions,
        pmediaOptions,
        platformOptions,
        typedeclareOptions,
        typeOptions,
        statusOptions,
        mediaOptions: [],
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        showReviewer: false,
        temp: {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          type: '',
          status: 'published'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          type: [{ required: true, message: 'type is required', trigger: 'change' }],
          timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          title: [{ required: true, message: 'title is required', trigger: 'blur' }]
        },
        downloadLoading: false,
        buttonDisabled: true
      }
    },
    created() {
      this.getList()
      this.getMediaList()
    },
    methods: {
      getList() {
        this.listLoading = true
        if (this.listQuery.adplacementid === '') {
            this.listQuery.adplacementid = null
        }
        fetchListAdplacement(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.total

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
      },
      getMediaList() {
        this.mediaOptions = []
        fetchMediaList().then(response => {
          response.data.list.forEach(v => {
            this.mediaOptions.push({
              key: v.mediaid,
              display_name: v.medianame
            })
          })
        })
        console.log(this.mediaOptions)
      },
      handleClearMedia() {
        clearMediaList(response => {

        })
        this.getMediaList()
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleModifyStatus(row, status) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        row.status = status
      },
      sortChange(data) {
        const { prop, order } = data
        if (prop === 'id') {
          this.sortByID(order)
        }
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.sort = '+id'
        } else {
          this.listQuery.sort = '-id'
        }
        this.handleFilter()
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          importance: 1,
          remark: '',
          timestamp: new Date(),
          title: '',
          status: 'published',
          type: ''
        }
      },
      handleSync() {
        // this.resetTemp()
        // this.dialogStatus = 'create'
        // this.dialogFormVisible = true
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].clearValidate()
        // })
        this.listLoading = true
        sync().then(response => {
          Message({
            message: response.data,
            type: 'success',
            duration: 1000
          })
          this.getList()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.author = 'vue-element-admin'
            // createArticle(this.temp).then(() => {
            //   this.list.unshift(this.temp)
            //   this.dialogFormVisible = false
            //   this.$notify({
            //     title: '成功',
            //     message: '创建成功',
            //     type: 'success',
            //     duration: 2000
            //   })
            // })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            // updateArticle(tempData).then(() => {
            //   for (const v of this.list) {
            //     if (v.id === this.temp.id) {
            //       const index = this.list.indexOf(v)
            //       this.list.splice(index, 1, this.temp)
            //       break
            //     }
            //   }
            //   this.dialogFormVisible = false
            //   this.$notify({
            //     title: '成功',
            //     message: '更新成功',
            //     type: 'success',
            //     duration: 2000
            //   })
            // })
          }
        })
      },
      handleDelete(row) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      handleFetchPv(pv) {
        // fetchPv(pv).then(response => {
        //   this.pvData = response.data.pvData
        //   this.dialogPvVisible = true
        // })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>
