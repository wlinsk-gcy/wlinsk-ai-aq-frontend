export enum ReviewStatusEnum {
  TO_BE_REVIEWED = 0,
  REVIEW_PASS = 1,
  REVIEW_FAIL = 2
}

export const ReviewStatusEnumMap: { [key: number]: string } = {
  0: '待审核',
  1: '审核通过',
  2: '审核不通过'
}
