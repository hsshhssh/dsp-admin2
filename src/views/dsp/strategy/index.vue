<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 20px">
      <el-input placeholder="请输入计划名称" v-model="listQuery.name_like" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input placeholder="请输入广告名称" v-model="listQuery.adplacementname_like" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.mediaid" placeholder="媒体名称" filterable clearable style="width: 150px" class="filter-item" @onchange="handleFilter">
        <el-option v-for="item in mediaOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-input placeholder="请输入素材名称" v-model="listQuery.materialidname_like" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.status" placeholder="不限投放状态" clearable style="width: 150px" class="filter-item" @onchange="handleFilter">
        <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-edit" @click="handleInsert">新增</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilterDelete">查询已删除</el-button>
      <el-button v-waves class="filter-item" type="primary" @click="handleClearMedia">刷新媒体</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"getDeleteList
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">

      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="计划名称" prop="id" sortable="custom" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="价格(分)" prop="id" sortable="custom" align="center" width="150">
        <template slot-scope="scope">
          <template v-if="scope.row.priceEdit">
            <el-input v-model="scope.row.price" class="edit-input" size="small"/>
            <el-button size="mini" type="info" @click="cancelEditPrice(scope.row)">取消</el-button>
            <el-button size="mini" type="success" @click="confirmEditPrice(scope.row)">确定</el-button>
          </template>
          <a v-else @click="editPrice(scope.row)" style="color: #1a0dab">{{ scope.row.price }} </a>
        </template>
      </el-table-column>

      <el-table-column label="预算(分)" prop="id" sortable="custom" align="center" width="150">
        <template slot-scope="scope">
          <template v-if="scope.row.budgetEdit">
            <el-input v-model="scope.row.budget" class="edit-input" size="small"/>
            <el-button size="mini" type="info" @click="cancelEditBudget(scope.row)">取消</el-button>
            <el-button size="mini" type="success" @click="confirmEditBudget(scope.row)">确定</el-button>
          </template>
          <a v-else @click="editBudget(scope.row)" style="color: #1a0dab">{{ scope.row.budget }} </a>
        </template>
      </el-table-column>

      <el-table-column label="当前消耗" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.cost }}</span>
        </template>
      </el-table-column>

      <el-table-column label="总消耗" prop="id" sortable="custom" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.total }}</span>
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

      <el-table-column label="媒体名称" prop="id" sortable="custom" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.medianame }}</span>
        </template>
      </el-table-column>

      <el-table-column label="素材名称" prop="id" sortable="custom" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.materialname }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" prop="id" sortable="custom" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.createTimeStr }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="success" size="mini" v-if="scope.row.status !== '1'" @click="enableStrategy(scope.row.id)">已暂停</el-button>
          <el-button type="info" size="mini" v-if="scope.row.status === '1'" @click="disableStrategy(scope.row.id)">已启用</el-button>
          <el-button type="warning" size="mini" @click="copyStrategy(scope.row.id)">复制</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.del === 1" @click="deleteStrategy(scope.row.id)">删除</el-button>
          <el-button type="success" size="mini" v-if="scope.row.del === 2" @click="recoveryStrategy(scope.row.id)">恢复</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
  import { fetchList, getStrategy, saveStrategy, disableStrategy, enableStrategy, copyStrategy, savePriceStrategy, deleteStrategy, recoveryStrategy, saveBudgetStrategy} from '@/api/dsp/strategy'
  import { fetchMediaList, clearMediaList } from '@/api/dsp/adplacement'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  const odsTypeOptions = [
    { key: 1, display_name: '平台媒体id' },
    { key: 2, display_name: '媒体id' },
    { key: 3, display_name: '广告位id' },
    { key: 4, display_name: '素材id' }
  ]

  const statusOptions = [
    { key: "1", display_name: '已启用' },
    { key: "2", display_name: '已暂停' }
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
          name_like: undefined,
          adplacementname_like: undefined,
          medianame_like: undefined,
          materialname_like: undefined,
          adplacementid: undefined,
          mediaid: undefined,
          materialid: undefined,
          del: 1,
          status: undefined,
        },
        importanceOptions: [1, 2, 3],
        odsTypeOptions,
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
      this.getMediaList()
    },
    methods: {
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
      }
      ,
      editPrice(row) {
        row.priceEdit = true;
      },
      cancelEditPrice(row) {
        row.priceEdit = false;
      },
      confirmEditPrice(row) {
        let query = {
          id: row.id,
          price: row.price
        }
        savePriceStrategy(query).then(response => {
          this.$message.success(`${response.data}`)
          this.getList()
        })
        row.priceEdit = false;
      },

      editBudget(row) {
        row.budgetEdit = true;
      },
      cancelEditBudget(row) {
        row.budgetEdit = false;
      },
      confirmEditBudget(row) {
        let query = {
          id: row.id,
          budget: row.budget
        }
        saveBudgetStrategy(query).then(response => {
          this.$message.success(`${response.data}`)
          this.getList()
        })
        row.budgetEdit = false;
      },


      handleInsert() {
        this.$router.push({path: '/strategy/edit'})
      },
      copyStrategy(id) {
        let query = {
          "id": id
        };
        copyStrategy(query).then(response => {
          this.$message.success(`${response.data}`)
          this.getList()
        })
      },
      deleteStrategy(id) {
        let query = {
          "id": id
        };
        deleteStrategy(query).then(response => {
          this.$message.success(`${response.data}`)
          this.getList()
        })
      },
      recoveryStrategy(id) {
        let query = {
          "id": id
        };
        recoveryStrategy(query).then(response => {
          this.$message.success(`${response.data}`)
          this.getList()
        })
      },
      disableStrategy(id) {
        let query = {
          "id": id
        };
        disableStrategy(query).then(response => {
          this.$message.success(`${response.data}`)
          this.getList()
        })
      },
      enableStrategy(id) {
        let query = {
          "id": id
        };
        enableStrategy(query).then(response => {
          this.$message.success(`${response.data}`)
          this.getList()
        })
      },

      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          console.log(this.list)

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.listQuery.del = 1;
        this.getList()
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
      handleFilterDelete() {
        this.listQuery.page = 1
        this.listQuery.del = 2;
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
        this.$router.push({path: '/strategy/edit', query: {id: row.id}})
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
