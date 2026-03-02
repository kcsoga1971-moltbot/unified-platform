<template>
  <span class="status-badge" :class="`status-${status}`">
    <span class="status-dot"></span>
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  status: {
    type: String,
    required: true,
    // on_track | at_risk | off_track
  },
})

const { t } = useI18n()

const label = computed(() => {
  const map = {
    on_track: t('project.statusOptions.on_track'),
    at_risk: t('project.statusOptions.at_risk'),
    off_track: t('project.statusOptions.off_track'),
  }
  return map[props.status] || props.status
})
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.status-on_track {
  background: #f0fdf4;
  color: #15803d;
}
.status-on_track .status-dot {
  background: #52c41a;
}

.status-at_risk {
  background: #fffbeb;
  color: #b45309;
}
.status-at_risk .status-dot {
  background: #faad14;
}

.status-off_track {
  background: #fef2f2;
  color: #b91c1c;
}
.status-off_track .status-dot {
  background: #f5222d;
}
</style>
