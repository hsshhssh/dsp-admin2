<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px">
      <el-select v-model="listQuery.type" placeholder="操作类型" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-input placeholder="操作项目" v-model="listQuery.amname_like" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        v-model="listQuery.timestamp_gte"
        align="right"
        type="date"
        placeholder="开始时间"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-date-picker
        v-model="listQuery.timestamp_lte"
        align="right"
        type="date"
        placeholder="结束时间"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
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

      <el-table-column label="主键id" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作时间" prop="id" sortable="custom" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.recordTimeStr }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作类型" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.typeStr }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作项目" prop="id" sortable="custom" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.amname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作前内容" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.updateBefore }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作后内容" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.updateAfter }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
  import { fetchStrategyRecordList } from "@/api/dsp/strategyrecord";
  import { Message } from 'element-ui'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  const typeOptions = [
    { key: 1, display_name: '修改价格' },
    { key: 2, display_name: '修改状态' }
  ]



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
          sort: '+id',
          timestamp_gte: undefined,
          timestamp_lte: undefined
        },
        importanceOptions: [1, 2, 3],
        typeOptions,
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
        buttonDisabled: true,
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        console.log(this.listQuery)
        if (this.listQuery.timestamp_gte !== undefined && this.listQuery.timestamp_gte !== null) {
          this.listQuery.timestamp_gte_ignore = this.listQuery.timestamp_gte.getTime();
        } else {
          this.listQuery.timestamp_gte_ignore = undefined
        }
        if (this.listQuery.timestamp_lte !== undefined && this.listQuery.timestamp_lte !== null) {
          this.listQuery.timestamp_lte_ignore = this.listQuery.timestamp_lte.getTime();
        } else {
          this.listQuery.timestamp_lte_ignore = undefined
        }
        fetchStrategyRecordList(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.total

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
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
