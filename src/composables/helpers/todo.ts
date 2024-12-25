// dummyData.ts


import { format, addDays } from 'date-fns'
import { KanbanBoard } from '../types'




const today = new Date()



export const dummyTasks = [
    {
      id: '1',
      title: 'Dedicate 2 hours to studying course materials',
      description: 'Focus on understanding key concepts, reviewing notes, and completing assigned readings.',
      priority: 'high',
      dueDate: 'Mon, August 19, 2024',
      estimatedDuration: '2 hours',
      isRecurring: true
    },
    {
      id: '2',
      title: 'Attend all scheduled classes',
      description: 'Engage actively in discussions, ask questions, and take detailed notes.',
      priority: 'high',
      dueDate: 'Mon, August 19, 2024',
      estimatedDuration: 'Varies based on class schedule',
      isRecurring: true
    },
    {
      id: '3',
      title: 'Review lecture notes and practice problems',
      description: 'Revisit key concepts, work through practice exercises, and identify areas needing further clarification.',
      priority: 'medium',
      dueDate: 'Mon, August 19, 2024',
      estimatedDuration: '1 hour',
      isRecurring: true
    },
    {
      id: '4',
      title: 'Identify challenging topics and seek help',
      description: 'Reach out to professors, classmates, or tutoring services for assistance with specific concepts or assignments.',
      priority: 'medium',
      dueDate: 'Mon, August 19, 2024',
      estimatedDuration: '30 minutes',
      isRecurring: true
    }
  ]
