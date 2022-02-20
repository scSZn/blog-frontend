<template>
  <div class="tag-container">
    <el-form class="filter-container" size="small" label-width="100px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="标签名称">
            <el-input v-model="param.search.name" placeholder="标签名称" class="filter-item" @keyup.enter.native="handleFilter" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label-width="10px">
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              搜索
            </el-button>
            <el-button v-waves class="filter-item" type="success" icon="el-icon-plus" @click="createDialogVisible = true">
              创建新标签
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
      :header-cell-style="{'text-align': 'center'}"
      @sort-change="sortChange"
    >
      <el-table-column label="标签ID" prop="id" sortable="custom" align="center" width="150px" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.tag_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.tag_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文章数量" align="center" width="150px">
        <template slot-scope="{row}">
          <span v-if="row.article_count" class="link-type">{{ row.article_count }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100px">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusTypeFilter">
            {{ row.status | statusDisplayFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button :disabled="row.status===20" size="mini" @click="handleModifyStatus(row,'draft')">
            禁用
          </el-button>
          <el-button :disabled="row.status===50" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="text-align: center">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="param.search.page"
        :limit.sync="param.search.limit"
        @pagination="refreshTagList"
      />
    </div>

    <el-dialog :visible.sync="createDialogVisible" width="50%" title="创建新标签" @close="param.createTag.tag_name = ''">
      <el-form :model="param.createTag" :rules="rules.createTag">
        <el-form-item label="标签名称" prop="tag_name">
          <el-input v-model="param.createTag.tag_name" placeholder="标签名称" @keyup.enter.native="handleFilter" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="createTag">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { createTag, getTags, getTagStatusConfig } from '@/api/admin/tag'

export default {
  name: 'BlogManage',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusTypeFilter(status) {
      const statusMap = {
        20: 'success',
        40: 'info',
        50: 'danger'
      }
      return statusMap[status]
    },
    statusDisplayFilter(status) {
      const statusMap = {
        20: '生效中',
        40: '禁用',
        50: '已删除'
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
      param: {
        search: {
          page: 1,
          limit: 20,
          name: undefined
        },
        createTag: {
          tag_name: ''
        }
      },
      statusOptions: null,
      createDialogVisible: false,
      dialogStatus: '',
      rules: {
        createTag: {
          tag_name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        }
      }
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      this.refreshTagList()
      getTagStatusConfig().then(response => {
        this.statusOptions = response.data
      })
    },
    handleFilter() {
      this.param.search.page = 1
      this.refreshTagList()
    },
    refreshTagList() {
      this.listLoading = true
      getTags(this.param.search).then(response => {
        this.tags = response.data.list
        this.total = response.data.total
        console.log('this.tags is ' + this.tags)
      }).finally(() => {
        this.listLoading = false
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
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    createTag() {
      createTag(this.param.createTag).then(response => {
        this.createDialogVisible = false
        this.listLoading = true
        this.refreshTagList()
      }).catch(() => {
        this.createDialogVisible = false
      })
    }
  }
}
</script>

<style scoped>
.el-form{
  margin: 10px;
}
</style>
