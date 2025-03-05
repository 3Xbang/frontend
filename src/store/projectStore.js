/**
 * Project store for managing construction projects
 * Handles CRUD operations for projects and related data
 */

import { defineStore } from 'pinia'
import axios from 'axios'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    currentProject: null,
    isLoading: false,
    error: null
  }),
  
  getters: {
    completedProjects: (state) => state.projects.filter(p => p.status === 'completed'),
    ongoingProjects: (state) => state.projects.filter(p => p.status === 'in-progress'),
    upcomingProjects: (state) => state.projects.filter(p => p.status === 'planned')
  },
  
  actions: {
    async fetchProjects() {
      this.isLoading = true
      this.error = null
      
      try {
        // In a real app, this would call an API endpoint
        // For demo purposes, we're using mock data
        // const response = await axios.get('/projects')
        
        // Mock projects data
        const mockProjects = [
          {
            id: 1,
            title: 'Modern Office Building',
            description: 'A 10-story modern office building with glass facade and sustainable features.',
            location: 'Downtown Business District',
            client: 'TechCorp Inc.',
            startDate: '2023-01-15',
            endDate: '2024-06-30',
            status: 'in-progress',
            budget: 15000000,
            imageUrl: '/project1.jpg',
            features: ['LEED Certified', 'Smart Building Systems', 'Rooftop Garden']
          },
          {
            id: 2,
            title: 'Luxury Apartment Complex',
            description: 'High-end residential complex with 120 units and premium amenities.',
            location: 'Riverside District',
            client: 'Elite Properties',
            startDate: '2022-08-10',
            endDate: '2023-11-20',
            status: 'completed',
            budget: 22000000,
            imageUrl: '/project2.jpg',
            features: ['Swimming Pool', 'Fitness Center', 'Underground Parking']
          },
          {
            id: 3,
            title: 'Shopping Mall Expansion',
            description: 'Adding 30,000 sq ft to an existing shopping mall with new retail spaces.',
            location: 'Westside Mall',
            client: 'Retail Ventures LLC',
            startDate: '2024-03-01',
            endDate: '2025-02-28',
            status: 'planned',
            budget: 8500000,
            imageUrl: '/project3.jpg',
            features: ['Food Court', 'Entertainment Zone', 'Expanded Parking']
          }
        ]
        
        this.projects = mockProjects
        return { success: true }
      } catch (error) {
        this.error = 'Failed to fetch projects. Please try again.'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },
    
    async getProjectById(id) {
      this.isLoading = true
      this.error = null
      
      try {
        // In a real app, this would call an API endpoint
        // For demo purposes, we use the mock data
        const project = this.projects.find(p => p.id === parseInt(id))
        
        if (!project) {
          this.error = 'Project not found'
          return { success: false, error: this.error }
        }
        
        this.currentProject = project
        return { success: true, data: project }
      } catch (error) {
        this.error = 'Failed to fetch project details'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },
    
    async createProject(projectData) {
      // Implementation for creating new project
      // Would call API in real application
      const newProject = {
        id: this.projects.length + 1,
        ...projectData,
        status: 'planned'
      }
      
      this.projects.push(newProject)
      return { success: true, data: newProject }
    },
    
    async updateProject(id, projectData) {
      // Implementation for updating project
      // Would call API in real application
      const index = this.projects.findIndex(p => p.id === parseInt(id))
      
      if (index === -1) {
        return { success: false, error: 'Project not found' }
      }
      
      this.projects[index] = { ...this.projects[index], ...projectData }
      return { success: true, data: this.projects[index] }
    },
    
    async deleteProject(id) {
      // Implementation for deleting project
      // Would call API in real application
      const index = this.projects.findIndex(p => p.id === parseInt(id))
      
      if (index === -1) {
        return { success: false, error: 'Project not found' }
      }
      
      this.projects.splice(index, 1)
      return { success: true }
    }
  }
}) 