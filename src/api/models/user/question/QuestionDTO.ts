import type { QueryUserDetailRespDTO } from '@/api/models/user/user/QueryUserDetailRespDTO'

/**
 * 通用模型
 */
export type QuestionOptionDTO = {
  /**
   * 结果
   */
  result?: string,
  /**
   * 得分
   */
  score?: number,
  /**
   * 选项值：
   */
  value?: string,
  /**
   * 选项key：A，B，C，D
   */
  key?: string,
}
export type QuestionContentDTO = {
  /**
   * 题目标题
   */
  title?: string,
  /**
   * 题目选项列表
   */
  options?: QuestionOptionDTO[]
}

/**
 * 业务模型
 */
export type AddQuestionReqDTO = {
  appId?: string,
  questionContent?: QuestionContentDTO[]
}
export type UpdateQuestionReqDTO = {
  questionId?: string,
  questionContent?: QuestionContentDTO[]
}
export type QueryQuestionPageReqDTO = {
  appId?: string,
  pageNum?: number,
  pageSize?: number,
}
export type QueryQuestionPageRespDTO = {
  questionId?: string,
  questionContent?: QuestionContentDTO[],
  appId?: string,
  userId?: string,
  createTime?: Date,
  updateTime?: Date,
  userInfo?: QueryUserDetailRespDTO
}
export type AiGenerateQuestionReqDTO = {
  appId?: string,
  questionNumber?: number,
  optionNumber?: number,
  aiGenerateQuestionId?: string
}
export type AiGenerateQuestionRespDTO = {
  aiGenerateQuestionId?: string,
  questionContent?: QuestionContentDTO[]
}