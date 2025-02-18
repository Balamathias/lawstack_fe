'use server'

import { Question } from '@/@types/db'
import { PaginatedStackResponse, StackResponse } from '@/@types/generics'
import { stackbase } from '../server.entry'

interface QuestionPayload {
    params?: Record<string, string | number | boolean>
}

export const getQuestions = async (payload?: QuestionPayload): Promise<PaginatedStackResponse<Question[]>> => {
    try {
        const { data } = await stackbase.get('/past-questions/', { ...payload })
        return data
    } catch (error: any) {
        return {
            message: error?.response?.data?.message || error.response?.data?.detail,
            error: error?.response?.data,
            data: [],
            status: error?.response?.status,
            count: 0,
            next: '',
            previous: ''
        }
    }
}

export const getQuestion = async (id: string): Promise<StackResponse<Question | null>> => {
    try {
        const { data } = await stackbase.get(`/past-questions/${id}`)
        return data
    } catch (error: any) {
        return {
            message: error?.response?.data?.message || error.response?.data?.detail,
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

export const createQuestion = async (payload: Question): Promise<StackResponse<Question | null>> => {
    try {
        const { data } = await stackbase.post('/past-questions', payload)
        return data
    } catch (error: any) {
        return {
            message: error?.response?.data?.message || error.response?.data?.detail,
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

export const updateQuestion = async (id: string, payload: Partial<Question>): Promise<StackResponse<Question | null>> => {
    try {
        const { data } = await stackbase.put(`/past-questions/${id}`, payload)
        return data
    } catch (error: any) {
        return {
            message: error?.response?.data?.message || error.response?.data?.detail,
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}

export const deleteQuestion = async (id: string): Promise<StackResponse<Question | null>> => {
    try {
        const { data } = await stackbase.delete(`/past-questions/${id}`)
        return data
    } catch (error: any) {
        return {
            message: error?.response?.data?.message || error.response?.data?.detail,
            error: error?.response?.data,
            data: null,
            status: error?.response?.status
        }
    }
}