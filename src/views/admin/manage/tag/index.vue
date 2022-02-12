<template>
  <div class="tag-container">
    <el-form class="filter-container" size="small" label-width="100px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="标签名称">
            <el-input v-model="search_param.name" placeholder="标签名称" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label-width="10px">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              搜索
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tags"
      border
      fit
      stripe
      highlight-current-row
      style="width: 95%; margin: 0 auto;"
      @sort-change="sortChange"
    >
      <el-table-column label="标签ID" prop="id" sortable="custom" align="center" width="100px" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.tag_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.tag_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文章数量" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.blog_count" class="link-type" @click="handleFetchPv(row.blog_count)">{{ row.blog_count }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.status.name | statusFilter">
            {{ row.status.display }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button :disabled="row.status.name==='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            禁用
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="text-align: center">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="search_param.page"
        :limit.sync="search_param.limit"
        @pagination="getTagList"
      />
    </div>
  </div>
</template>

<script>
import { fetchPv } from '@/api/admin/manage/blogs'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getAllTags } from '@/api/admin/tag'
import { getAllStatus } from '@/api/admin/status'
import axios from 'axios'

export default {
  name: 'BlogManage',
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
    }
  },
  data() {
    return {
      tableKey: 0,
      tags: null,
      total: 0,
      listLoading: true,
      search_param: {
        page: 1,
        limit: 20,
        name: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      this.listLoading = true
      axios.all([
        getAllTags().then(response => {
          this.tags = response.data
          console.log('tags is ' + this.tags)

          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        }),
        getAllStatus().then(response => {
          this.statusOptions = response.data
        })
      ]).then(
        axios.spread(() => {
          this.listLoading = false
        })
      ).finally(() => {
        this.listLoading = false
      })
    },
    handleFilter() {
      this.search_param.page = 1
      this.getTagList()
    },
    getTagList() {
      getAllTags(this.search_param).then(response => {
        this.tags = response.data
        console.log('tags is ' + this.tags)

        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
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
        this.search_param.sort = '+id'
      } else {
        this.search_param.sort = '-id'
      }
      this.handleFilter()
    },
    handleUpdate(row) {

    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.search_param.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style scoped>
.el-form{
  margin: 10px;
}
</style>
