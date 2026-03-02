<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">{{ $t('summary.inbox') }}</h1>
    </div>

    <!-- Filters -->
    <el-card class="filter-card">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-select v-model="filterAuthor" :placeholder="$t('summary.allAuthors')" clearable style="width: 100%">
            <el-option v-for="u in authors" :key="u.id" :label="u.name" :value="u.id" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="filterPeriod" :placeholder="$t('summary.allPeriods')" clearable style="width: 100%">
            <el-option label="日报" value="daily" />
            <el-option label="周报" value="weekly" />
            <el-option label="月报" value="monthly" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="filterStatus" placeholder="全部状态" clearable style="width: 100%">
            <el-option :label="$t('summary.confirmed')" value="confirmed" />
            <el-option :label="$t('summary.published')" value="published" />
            <el-option :label="$t('summary.draft')" value="draft" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button @click="clearFilters">{{ $t('common.reset') }}</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- Stats -->
    <div class="stats-row">
      <el-card class="stat-item">
        <div class="stat-val">{{ filteredSummaries.length }}</div>
        <div class="stat-lbl">共计汇报</div>
      </el-card>
      <el-card class="stat-item">
        <div class="stat-val">{{ publishedCount }}</div>
        <div class="stat-lbl">已发布</div>
      </el-card>
      <el-card class="stat-item">
        <div class="stat-val">{{ pendingCount }}</div>
        <div class="stat-lbl">待确认</div>
      </el-card>
    </div>

    <!-- Summary list -->
    <div v-if="filteredSummaries.length" class="summaries-grid">
      <div v-for="s in filteredSummaries" :key="s.id" class="summary-item">
        <div class="item-header">
          <div class="author-info">
            <div class="avatar">{{ s.userName?.slice(0, 2) }}</div>
            <div>
              <div class="author-name">{{ s.userName }}</div>
              <div class="item-date">{{ displayDate(s) }}</div>
            </div>
          </div>
          <div class="item-tags">
            <el-tag size="small" type="info">{{ $t(`summary.${s.type}`) }}</el-tag>
            <el-tag :type="statusTagType(s.status)" size="small">{{ $t(`summary.${s.status}`) }}</el-tag>
          </div>
        </div>

        <!-- Preview -->
        <div class="preview-text">{{ previewText(s) }}</div>

        <!-- Expand button -->
        <el-button size="small" text @click="expandSummary(s)">
          {{ expanded === s.id ? '收起' : '展开' }}
        </el-button>

        <!-- Expanded content -->
        <div v-if="expanded === s.id" class="expanded-content">
          <template v-if="s.type === 'daily'">
            <div class="exp-section">
              <strong>{{ $t('summary.tasksCompleted') }}</strong>
              <ul><li v-for="(t, i) in s.tasksCompleted" :key="i">{{ t }}</li></ul>
            </div>
            <div class="exp-section">
              <strong>{{ $t('summary.issues') }}</strong>
              <ul><li v-for="(t, i) in s.issues" :key="i">{{ t }}</li></ul>
            </div>
            <div class="exp-section">
              <strong>{{ $t('summary.notes') }}</strong>
              <p>{{ s.notes }}</p>
            </div>
          </template>
          <template v-else-if="s.type === 'weekly'">
            <div class="exp-section">
              <strong>{{ $t('summary.weekOverview') }}</strong>
              <p>{{ s.weekOverview }}</p>
            </div>
          </template>
          <template v-else>
            <div class="exp-section">
              <strong>{{ $t('summary.monthlyOverview') }}</strong>
              <p>{{ s.monthlyOverview }}</p>
            </div>
          </template>

          <!-- Comment -->
          <div class="comment-area">
            <el-input
              v-model="commentText"
              :placeholder="$t('summary.addComment')"
              size="small"
              style="margin-bottom: 8px"
            />
            <el-button size="small" type="primary" @click="addComment(s.id)">
              {{ $t('summary.addComment') }}
            </el-button>
          </div>

          <div v-if="s.comments?.length" class="comments-list">
            <div v-for="c in s.comments" :key="c.id" class="comment-item">
              <span class="comment-text">{{ c.text }}</span>
              <span class="comment-time">{{ c.createdAt?.slice(0, 16).replace('T', ' ') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-empty v-else :description="$t('summary.noSummaries')" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useSummaryStore } from '../../../stores/rdm-summary.js'
import { DEMO_USERS } from '../../../utils/rdm-demoData.js'

const { t } = useI18n()
const summaryStore = useSummaryStore()

const filterAuthor = ref('')
const filterPeriod = ref('')
const filterStatus = ref('')
const expanded = ref(null)
const commentText = ref('')

const authors = DEMO_USERS

const allSummaries = computed(() => summaryStore.getSummariesForBoss())

const filteredSummaries = computed(() => {
  let list = allSummaries.value
  if (filterAuthor.value) list = list.filter(s => s.userId === filterAuthor.value)
  if (filterPeriod.value) list = list.filter(s => s.type === filterPeriod.value)
  if (filterStatus.value) list = list.filter(s => s.status === filterStatus.value)
  return list.sort((a, b) => b.createdAt?.localeCompare(a.createdAt))
})

const publishedCount = computed(() => filteredSummaries.value.filter(s => s.status === 'published').length)
const pendingCount = computed(() => filteredSummaries.value.filter(s => s.status === 'draft').length)

function displayDate(s) {
  if (s.type === 'daily') return s.date
  if (s.type === 'weekly') return `${s.weekStart} ~ ${s.weekEnd}`
  return s.month
}

function previewText(s) {
  const text = s.notes || s.weekOverview || s.monthlyOverview || ''
  return text.slice(0, 100) + (text.length > 100 ? '...' : '')
}

function statusTagType(status) {
  const m = { draft: '', confirmed: 'warning', published: 'success' }
  return m[status] || ''
}

function expandSummary(s) {
  expanded.value = expanded.value === s.id ? null : s.id
  commentText.value = ''
}

function addComment(summaryId) {
  if (!commentText.value.trim()) return
  summaryStore.addComment(summaryId, commentText.value)
  commentText.value = ''
  ElMessage.success('评论已添加')
}

function clearFilters() {
  filterAuthor.value = ''
  filterPeriod.value = ''
  filterStatus.value = ''
}
</script>

<style scoped>
.page-container { max-width: 1000px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-title { font-size: 22px; font-weight: 700; color: #111827; margin: 0; }
.filter-card { margin-bottom: 16px; }
.stats-row { display: flex; gap: 12px; margin-bottom: 16px; }
.stat-item { flex: 1; text-align: center; }
.stat-val { font-size: 28px; font-weight: 700; color: #1a73e8; }
.stat-lbl { font-size: 12px; color: #6b7280; }
.summaries-grid { display: flex; flex-direction: column; gap: 12px; }
.summary-item { background: white; border-radius: 10px; padding: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.author-info { display: flex; gap: 10px; align-items: center; }
.avatar { width: 32px; height: 32px; border-radius: 50%; background: #1a73e8; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }
.author-name { font-size: 14px; font-weight: 500; color: #111827; }
.item-date { font-size: 12px; color: #9ca3af; }
.item-tags { display: flex; gap: 6px; }
.preview-text { font-size: 13px; color: #6b7280; margin-bottom: 8px; line-height: 1.5; }
.expanded-content { margin-top: 12px; padding-top: 12px; border-top: 1px solid #f0f0f0; }
.exp-section { margin-bottom: 12px; }
.exp-section strong { font-size: 13px; color: #374151; }
.exp-section ul { padding-left: 20px; margin: 4px 0 0; }
.exp-section li { font-size: 13px; color: #6b7280; }
.exp-section p { font-size: 13px; color: #6b7280; margin: 4px 0 0; }
.comment-area { margin-top: 12px; }
.comments-list { margin-top: 8px; }
.comment-item { display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; padding: 4px 0; border-bottom: 1px solid #f5f5f5; }
.comment-time { color: #9ca3af; }
</style>
