import { describe, it, expect } from 'vitest'

// Test utility functions
describe('Basic functionality tests', () => {
  it('should calculate percentage correctly', () => {
    const calculatePercentage = (correct: number, total: number) => {
      if (total === 0) return 0
      return Math.round((correct / total) * 100)
    }

    expect(calculatePercentage(5, 10)).toBe(50)
    expect(calculatePercentage(3, 3)).toBe(100)
    expect(calculatePercentage(0, 10)).toBe(0)
    expect(calculatePercentage(0, 0)).toBe(0)
    expect(calculatePercentage(7, 10)).toBe(70)
  })

  it('should validate quiz progress data structure', () => {
    const createQuizProgress = (id: string, correct: number, total: number) => ({
      id,
      writingSystem: `System ${id}`,
      totalQuestions: total,
      correctAnswers: correct,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
      lastPlayed: new Date().toISOString(),
      bestAccuracy: 100,
      streak: correct,
      totalSessions: 1
    })

    const progress = createQuizProgress('hiragana', 8, 10)
    
    expect(progress.id).toBe('hiragana')
    expect(progress.accuracy).toBe(80)
    expect(progress.streak).toBe(8)
    expect(progress.totalQuestions).toBe(10)
    expect(progress.correctAnswers).toBe(8)
  })

  it('should handle streak calculation', () => {
    const updateStreak = (currentStreak: number, isCorrect: boolean) => {
      return isCorrect ? currentStreak + 1 : 0
    }

    expect(updateStreak(0, true)).toBe(1)
    expect(updateStreak(5, true)).toBe(6)
    expect(updateStreak(10, false)).toBe(0)
    expect(updateStreak(0, false)).toBe(0)
  })
})