//! DO NOT MODIFY
export const testCreateConversation = (apiSchema) => {
  let hasDoubleHsm = false;
  let targetHSM = null;
  let hsmCount = 0;
  apiSchema.forEach((question) => {
    if (question.hsm_id) {
      hsmCount++;
      if (question.question_not_answer_timeout) {
        if (
          question.question_not_answer_timeout.seconds > 1 &&
          question.question_not_answer_timeout.to_question_id
        ) {
          hasDoubleHsm = true;
          targetHSM = question.question_not_answer_timeout.to_question_id;
        }
      }
    }
  });

  return (
    hsmCount > 0 &&
    hasDoubleHsm &&
    apiSchema.some((question) => question.id === targetHSM)
  );
};
