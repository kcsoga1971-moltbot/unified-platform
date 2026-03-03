<template>
  <div class="education-detail">
    <div class="page-header">
      <el-button @click="$router.back()"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
      <h1 class="page-title">{{ education.title }}</h1>
    </div>

    <el-card>
      <el-tag :type="education.completed ? 'success' : 'warning'" style="margin-bottom: 16px">
        {{ education.completed ? '已完成' : '進行中' }}
      </el-tag>

      <div class="edu-section" v-for="section in education.sections" :key="section.id">
        <h3>{{ section.title }}</h3>
        <p>{{ section.content }}</p>
        <el-checkbox v-model="section.read">我已閱讀此段內容</el-checkbox>
      </div>

      <el-divider />

      <el-button type="primary" :disabled="!allRead" @click="markComplete">
        {{ education.completed ? '已完成' : '確認完成閱讀' }}
      </el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({ id: String })

const education = ref({
  id: props.id || '1',
  title: '術後傷口照護',
  completed: false,
  sections: [
    { id: 1, title: '傷口觀察重點', content: '每日觀察傷口是否有紅腫、滲液、異味等感染跡象。如果發現異常請立即通知護理站。', read: false },
    { id: 2, title: '換藥注意事項', content: '保持傷口周圍清潔乾燥。洗澡時避免直接沖洗傷口。按照醫囑使用換藥材料。', read: false },
    { id: 3, title: '日常生活注意', content: '避免劇烈運動和提重物。保持均衡飲食促進傷口癒合。如有疼痛加劇請告知護理師。', read: false },
  ],
})

const allRead = computed(() => education.value.sections.every(s => s.read))

function markComplete() {
  education.value.completed = true
  ElMessage.success('恭喜您完成此衛教教材！')
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0; }
.edu-section { padding: 16px; margin-bottom: 12px; background: #fafafa; border-radius: 8px; }
.edu-section h3 { font-size: 16px; margin: 0 0 8px; color: #1a1a2e; }
.edu-section p { font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 8px; }
</style>
