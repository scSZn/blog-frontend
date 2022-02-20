<template>
  <div>
    <el-tabs v-model="activeName" class="editor-tabs" @tab-click="handleClick">
      <el-form ref="blogBaseInfo" :model="base" label-width="100px" size="small">
        <el-form-item label="标题">
          <el-input v-model="base.title" maxlength="100" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属系列">
              <el-select v-model="base.series" placeholder="请选择文章系列（如有）" fit-input-width>
                <el-option
                  v-for="item in series"
                  :key="item.series_id"
                  :label="item.series_name"
                  :value="item.series_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签">
              <el-select v-model="base.tags" filterable placeholder="请选择标签" multiple>
                <el-option
                  v-for="item in tags"
                  :key="item.tag_id"
                  :label="item.tag_name"
                  :value="item.tag_id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="图片展示">
          <el-upload
            ref="background_image"
            class="background_image"
            :file-list="background_images"
            :auto-upload="false"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture"
            :limit="1"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
          >
            <template #trigger>
              <el-button type="primary">选取文件</el-button>
            </template>
            <el-button class="ml-3" type="success" style="margin: 0 10px;" @click="submitUpload">上传到服务器</el-button>
            <span slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-tab-pane label="MD编辑器" name="markdown">
        <mavon-editor v-model="markdown_content" class="editor" :xss-options="xssOptions" :tab-size="4" />
      </el-tab-pane>
      <el-tab-pane label="富文本编辑器" name="fulltext">
        <Tinymce v-model="fulltext_content" :height="height" />
      </el-tab-pane>
    </el-tabs>
    <router-view />
  </div>
</template>

<script>
// import Vditor from '@/components/Vditor'
import { mavonEditor } from 'mavon-editor'
import Tinymce from '@/components/Tinymce'
import { getAllSeries } from '@/api/admin/series'
import { getAllTags } from '@/api/admin/manage/tag'
import 'mavon-editor/dist/css/index.css'

export default {
  name: 'PublishBlog',
  components: {
    mavonEditor, Tinymce
  },
  data: function() {
    return {
      xssOptions: {
        whiteList: {
          span: ['style']
        }
      },
      activeName: 'markdown',
      base: {
        title: '',
        series: '',
        tags: []
      },
      series: [],
      tags: [],
      background_images: [],
      markdown_content: '',
      fulltext_content: ''
    }
  },
  mounted() {
    getAllSeries().then(response => {
      this.series = response.data
    })
    getAllTags().then(response => {
      this.tags = response.data
    })
    this.height = window.innerHeight
  },
  methods: {
    handleClick: function(tab, event) {
      this.activeName = tab.name
    },
    submitUpload() {
      this.$refs.background_image.submit()
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
    }

  }
}
</script>

<style>
.editor-tabs > .el-tabs__content {
  background-color: #f4f5f7;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.editor-tabs {
  margin: 0 20px 0;
}

.el-form {
  margin: 20px 50px 0;

}

.el-form-item {
  margin-bottom: 0;
}

.el-select {
  width: 100%;
}

.editor{
  height: calc(100vh);
}
</style>
