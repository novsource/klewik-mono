import type { ClassValue } from 'class-variance-authority/dist/types'

export type CvaClassValue = Omit<ClassValue, 'bigint'>
