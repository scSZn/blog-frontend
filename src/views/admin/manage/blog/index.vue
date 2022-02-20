<template>
  <div class="blog-container">
    <el-form class="filter-container" size="small" label-width="100px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="文章ID">
            <el-input v-model="search_param.article_id" placeholder="文章ID" class="filter-item" @keyup.enter.native="refreshList" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="标题">
            <el-input v-model="search_param.title" placeholder="标题" class="filter-item" @keyup.enter.native="refreshList" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文章系列">
            <el-select v-model="search_param.series" placeholder="文章系列" clearable class="filter-item" style="display: block" @change="refreshList">
              <el-option v-for="item in series" :key="item.series_id" :label="item.series_name" :value="item.series_id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="标签">
            <el-select v-model="search_param.tags" placeholder="标签" multiple clearable class="filter-item" style="display: block" @change="refreshList">
              <el-option v-for="item in tags" :key="item.tag_id" :label="item.tag_name" :value="item.tag_id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="状态">
            <el-select v-model="search_param.status" style="display: block" class="filter-item" @change="refreshList">
              <el-option v-for="item in statusOptions" :key="item.name" :label="item.display" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <!--        <el-col :span="4" :offset="1">-->
        <!--          <el-form-item label="排序">-->
        <!--            <el-select v-model="search_param.sort" style="display: block" class="filter-item" @change="handleFilter">-->
        <!--              <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />-->
        <!--            </el-select>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
      </el-row>
      <el-row>
        <el-col>
          <el-form-item>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              搜索
            </el-button>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
              导出
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <el-table
      :key="tableKey"
      v-loading="blogLoading"
      :data="blogs"
      border
      fit
      stripe
      highlight-current-row
      style="width: 95%; margin: 0 auto;"
      @sort-change="sortChange"
    >
      <el-table-column label="文章ID" prop="article_id" sortable="custom" fixed align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" prop="create_time" width="160px" align="center" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.publish_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="150px" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="阅读数" prop="view_count" align="center" width="95" sortable="custom">
        <template slot-scope="{row}">
          <span v-if="row.view_count" class="link-type">{{ row.view_count }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="点赞数" prop="like_count" align="center" width="95" sortable="custom">
        <template slot-scope="{row}">
          <span v-if="row.like_count" class="link-type">{{ row.view_count }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="75">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusTypeFilter" :effect="row.status | statusEffectFilter" size="small">
            {{ row.status | statusDisplayFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.status===0" size="mini" @click="handleUpdate(row)">
            提交
          </el-button>
          <el-button v-if="row.status!==40" type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status===10" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            发布
          </el-button>
          <el-button v-if="row.status===20" size="mini" type="info" @click="handleModifyStatus(row,'published')">
            禁用
          </el-button>
          <el-button v-if="row.status===20" size="mini" @click="handleModifyStatus(row,'draft')">
            撤回
          </el-button>
          <el-button v-if="row.status!==50" size="mini" type="danger" @click="handleDelete(row,$index)">
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
        @pagination="getBlogList"
      />
    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/admin/manage/blogs'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getAllTags } from '@/api/admin/manage/tag'
import { getAllSeries } from '@/api/admin/series'
import { getArticleStatusConfig } from '@/api/admin/manage/blogs'

export default {
  name: 'BlogManage',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusTypeFilter(status) {
      const statusMap = {
        0: 'info',
        10: 'info',
        20: 'success',
        30: 'warning',
        40: 'danger',
        50: 'danger'
      }
      return statusMap[status]
    },
    statusEffectFilter(status) {
      const statusMap = {
        0: 'plain',
        10: 'light',
        20: 'light',
        30: 'plain',
        40: 'plain',
        50: 'light'
      }
      return statusMap[status]
    },
    statusDisplayFilter(status) {
      const statusMap = {
        0: '草稿',
        10: '待审核',
        20: '发布',
        30: '拒绝',
        40: '禁用',
        50: '删除'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      blogs: null,
      total: 0,
      blogLoading: true,
      search_param: {
        page: 1,
        limit: 20,
        article_id: '',
        title: undefined,
        tags: undefined,
        status: null,
        sort: '+id'
      },
      series: null,
      tags: null,
      statusOptions: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      this.getBlogList()
      getAllTags().then(response => {
        this.tags = response.data
        console.log('tags is ' + this.tags)
      })
      getAllSeries().then(response => {
        this.series = response.data
        console.log('series is ' + this.series)
      })
      getArticleStatusConfig().then(response => {
        this.statusOptions = response.data
      })
    },
    getBlogList() {
      this.blogLoading = true
      fetchList(this.search_param).then(response => {
        this.blogs = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.blogLoading = false
        }, 1.5 * 1000)
      })
    },
    refreshList() {
      this.search_param.page = 1
      this.getBlogList()
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

      // if (prop === 'id') {
      //   this.sortByID(order)
      // }
      // todo: 排序改变的回调
    },
    handleUpdate(row) {
    // todo: 编辑按钮的回调
    },
    handleDelete(row, index) {
      // this.$notify({
      //   title: 'Success',
      //   message: 'Delete Successfully',
      //   type: 'success',
      //   duration: 2000
      // })
      // this.list.splice(index, 1)
      // todo: 删除按钮的回调
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
    }
  }
}
</script>

<style scoped>
.el-form{
  margin: 10px;
}
</style>
