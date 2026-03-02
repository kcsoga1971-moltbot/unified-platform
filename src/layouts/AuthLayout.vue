<template>
  <div class="auth-layout">
    <div class="auth-sidebar">
      <div class="auth-brand">
        <div class="brand-icon">UNI</div>
        <h1 class="brand-name">{{ $t('unified.systemName') }}</h1>
        <p class="brand-tagline">{{ $t('unified.systemSubtitle') }}</p>
      </div>
      <div class="auth-features">
        <div class="feature-item">
          <el-icon size="22"><TrendCharts /></el-icon>
          <div>
            <strong>{{ $t('unified.rdCenter') }}</strong>
            <p>{{ $t('nav.projects') }} · {{ $t('nav.testData') }} · {{ $t('nav.ecn') }}</p>
          </div>
        </div>
        <div class="feature-item">
          <el-icon size="22"><Goods /></el-icon>
          <div>
            <strong>{{ $t('unified.opsCenter') }}</strong>
            <p>{{ $t('nav.sales') }} · {{ $t('nav.inventory') }} · {{ $t('nav.finance') }}</p>
          </div>
        </div>
        <div class="feature-item">
          <el-icon size="22"><Connection /></el-icon>
          <div>
            <strong>{{ $t('unified.integrationCenter') }}</strong>
            <p>{{ $t('unified.integrationEvents') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="auth-content">
      <div class="auth-content-inner">
        <div class="auth-lang">
          <LanguageSwitcher />
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import LanguageSwitcher from '../components/common/LanguageSwitcher.vue'
</script>

<style scoped>
.auth-layout {
  display: flex;
  min-height: 100vh;
}

.auth-sidebar {
  width: 400px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 60px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.auth-brand {
  margin-bottom: 60px;
}

.brand-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #1a73e8, #0d47a1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  color: white;
  margin-bottom: 20px;
}

.brand-name {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1.3;
}

.brand-tagline {
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.6;
}

.auth-features {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  color: #94a3b8;
}

.feature-item .el-icon {
  color: #1a73e8;
  flex-shrink: 0;
  margin-top: 2px;
}

.feature-item strong {
  display: block;
  color: white;
  font-size: 14px;
  margin-bottom: 4px;
}

.feature-item p {
  font-size: 12px;
  color: #64748b;
}

.auth-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 40px;
}

.auth-content-inner {
  width: 100%;
  max-width: 420px;
  position: relative;
}

.auth-lang {
  position: absolute;
  top: -56px;
  right: 0;
}

@media (max-width: 768px) {
  .auth-sidebar { display: none; }
  .auth-lang { top: -40px; }
}
</style>
