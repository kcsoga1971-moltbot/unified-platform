import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadFromLocalStorage, saveToLocalStorage, deepClone } from '../utils/rdm-helpers.js'
import { DEMO_PROJECTS } from '../utils/rdm-demoData.js'
import { STAGE_DELIVERABLES } from '../utils/rdm-constants.js'

export const useProjectStore = defineStore('rdm_project', () => {
  const projects = ref(loadFromLocalStorage('rdm_projects', DEMO_PROJECTS))
  const activities = ref(loadFromLocalStorage('rdm_activities', []))

  function saveProjects() {
    saveToLocalStorage('rdm_projects', projects.value)
  }

  function saveActivities() {
    saveToLocalStorage('rdm_activities', activities.value)
  }

  function addActivity(activity) {
    activities.value.unshift({
      id: 'act_' + Date.now(),
      timestamp: new Date().toISOString(),
      ...activity,
    })
    if (activities.value.length > 50) {
      activities.value = activities.value.slice(0, 50)
    }
    saveActivities()
  }

  const activeProjects = computed(() =>
    projects.value.filter((p) => p.currentStage < 5),
  )

  function getProjectById(id) {
    return projects.value.find((p) => p.id === id) || null
  }

  function createProject(projectData) {
    const newProject = {
      id: 'p_' + Date.now(),
      ...projectData,
      currentStage: 0,
      progress: 0,
      status: 'on_track',
      gateReviews: [],
      stageNotes: {},
      deliverables: Object.fromEntries(
        [0, 1, 2, 3, 4, 5].map((stageId) => [
          stageId,
          (STAGE_DELIVERABLES[stageId] || []).map((d) => ({
            ...d,
            completed: false,
            documentId: null,
          })),
        ]),
      ),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    projects.value.unshift(newProject)
    saveProjects()
    addActivity({
      type: 'project_created',
      description: `创建了新项目「${newProject.name}」`,
      projectId: newProject.id,
      projectName: newProject.name,
    })
    return newProject
  }

  function updateProject(id, updates) {
    const idx = projects.value.findIndex((p) => p.id === id)
    if (idx !== -1) {
      projects.value[idx] = {
        ...projects.value[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      saveProjects()
      return projects.value[idx]
    }
    return null
  }

  function toggleDeliverable(projectId, stageId, deliverableId) {
    const project = projects.value.find((p) => p.id === projectId)
    if (!project) return

    const stageDeliverables = project.deliverables[stageId]
    if (!stageDeliverables) return

    const deliverable = stageDeliverables.find((d) => d.id === deliverableId)
    if (deliverable) {
      deliverable.completed = !deliverable.completed
      // Recalculate progress
      const allDeliverables = Object.values(project.deliverables).flat()
      const completed = allDeliverables.filter((d) => d.completed).length
      project.progress = Math.round((completed / allDeliverables.length) * 100)
      project.updatedAt = new Date().toISOString()
      saveProjects()
    }
  }

  function addGateReview(projectId, review) {
    const project = projects.value.find((p) => p.id === projectId)
    if (!project) return

    const newReview = {
      id: 'gr_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...review,
    }
    project.gateReviews.push(newReview)

    if (review.decision === 'pass' || review.decision === 'conditional') {
      if (project.currentStage < 5) {
        project.currentStage += 1
        addActivity({
          type: 'gate_review',
          description: `阶段评审通过，项目进入阶段 ${project.currentStage}`,
          projectId: project.id,
          projectName: project.name,
        })
      }
    }

    project.updatedAt = new Date().toISOString()
    saveProjects()
    return newReview
  }

  function updateStageNotes(projectId, stageId, notes) {
    const project = projects.value.find((p) => p.id === projectId)
    if (!project) return
    if (!project.stageNotes) project.stageNotes = {}
    project.stageNotes[stageId] = notes
    project.updatedAt = new Date().toISOString()
    saveProjects()
  }

  function getRecentActivities(limit = 10) {
    return activities.value.slice(0, limit)
  }

  return {
    projects,
    activities,
    activeProjects,
    getProjectById,
    createProject,
    updateProject,
    toggleDeliverable,
    addGateReview,
    updateStageNotes,
    addActivity,
    getRecentActivities,
  }
})
