import type { ClassValue } from 'class-variance-authority/types'

export type CvaClassValue = Omit<ClassValue, 'bigint'>
