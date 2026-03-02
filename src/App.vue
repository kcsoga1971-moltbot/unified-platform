<template>
  <router-view />
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC',
    'Microsoft YaHei', sans-serif;
  background: #f0f2f5;
  color: #333;
}

:root {
  --primary: #1a73e8;
  --primary-light: #e8f0fe;
  --sidebar-bg: #1e293b;
  --sidebar-text: #94a3b8;
  --sidebar-active: #1a73e8;
  --sales-sidebar-bg: #1a237e;
  --status-green: #52c41a;
  --status-yellow: #faad14;
  --status-red: #f5222d;
  --border: #e5e7eb;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
</style>
