// ================ Common Start ================
/**
 * GET 请求
 * @param url 请求地址
 * @returns {Promise<*>} JSON数据
 */
const get = (url) => {
    return fetch(url).then(res => res.json());
};

/**
 * POST 请求
 * @param url 请求地址
 * @param body 请求参数
 * @returns {Promise<*>} JSON数据
 */
const post = (url, body) => {
    return fetch(url, {
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(body),
        method: "POST"
    }).then(res => res.json());
};

/**
 * Graphql 请求
 * @param body 请求参数
 * @returns {Promise<*>} JSON数据
 */
const graphql = (body) => {
    return post("https://leetcode.cn/graphql/", body);
};
// ================ Common End ================

/**
 * 获取每日一题的数据
 * @returns {Promise<any>} JSON数据
 */
const getQuestionOfToday = () => {
    return graphql({
        query: "query questionOfToday {\n  todayRecord {\n    date\n    userStatus\n    question {\n      questionId\n      frontendQuestionId: questionFrontendId\n      difficulty\n      title\n      titleCn: translatedTitle\n      titleSlug\n      paidOnly: isPaidOnly\n      freqBar\n      isFavor\n      acRate\n      status\n      solutionNum\n      hasVideoSolution\n      topicTags {\n        name\n        nameTranslated: translatedName\n        id\n      }\n      extra {\n        topCompanyTags {\n          imgUrl\n          slug\n          numSubscribed\n        }\n      }\n    }\n    lastSubmission {\n      id\n    }\n  }\n}\n    ",
        variables: {},
    });
};

/**
 * 获取题目的详细数据
 * @param variables
 * @returns {Promise<*>} JSON数据
 */
const getQuestionData = (variables) => {
    return graphql({
        operationName: "questionData",
        query: "query questionData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n    categoryTitle\n    boundTopicId\n    title\n    titleSlug\n    content\n    translatedTitle\n    translatedContent\n    isPaidOnly\n    difficulty\n    likes\n    dislikes\n    isLiked\n    similarQuestions\n    contributors {\n      username\n      profileUrl\n      avatarUrl\n      __typename\n    }\n    langToValidPlayground\n    topicTags {\n      name\n      slug\n      translatedName\n      __typename\n    }\n    companyTagStats\n    codeSnippets {\n      lang\n      langSlug\n      code\n      __typename\n    }\n    stats\n    hints\n    solution {\n      id\n      canSeeDetail\n      __typename\n    }\n    status\n    sampleTestCase\n    metaData\n    judgerAvailable\n    judgeType\n    mysqlSchemas\n    enableRunCode\n    envInfo\n    book {\n      id\n      bookName\n      pressName\n      source\n      shortDescription\n      fullDescription\n      bookImgUrl\n      pressImgUrl\n      productUrl\n      __typename\n    }\n    isSubscribed\n    isDailyQuestion\n    dailyRecordStatus\n    editorType\n    ugcQuestionId\n    style\n    exampleTestcases\n    jsonExampleTestcases\n    __typename\n  }\n}\n",
        variables
    });
};

/**
 * 获取题目列表
 * @param variables
 * @returns {Promise<*>} JSON数据
 */
const getQuestionList = (variables) => {
    return graphql({
        query: "query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {\n  problemsetQuestionList(\n    categorySlug: $categorySlug\n    limit: $limit\n    skip: $skip\n    filters: $filters\n  ) {\n    hasMore\n    total\n    questions {\n      acRate\n      difficulty\n      freqBar\n      frontendQuestionId\n      isFavor\n      paidOnly\n      solutionNum\n      status\n      title\n      titleCn\n      titleSlug\n      topicTags {\n        name\n        nameTranslated\n        id\n        slug\n      }\n      extra {\n        hasVideoSolution\n        topCompanyTags {\n          imgUrl\n          slug\n          numSubscribed\n        }\n      }\n    }\n  }\n}\n    ",
        variables
    });
};

/**
 * 执行测试
 * @param {{titleSlug: string, question_id: number, lang: string, typed_code: string, data_input: string, test_mode: boolean, judge_type: string, test_judge: string}} variables
 * @returns {Promise<*>}
 */
const interpretSolution = (variables) => {
    const {titleSlug} = variables;
    delete variables.titleSlug;
    return post(`https://leetcode.cn/problems/${titleSlug}/interpret_solution/`, variables);
};

/**
 * 检查测试
 * @param {{id: string}} variables
 * @returns {Promise<*>}
 */
const interpretCheck = (variables) => {
    const {id} = variables;
    return get(`https://leetcode.cn/submissions/detail/${id}/check/`);
};

/**
 * 提交解决方案
 * @param {{questionSlug: string, question_id: number, lang: string, typed_code: string, test_mode: boolean, test_judge: string}} variables
 * @returns {Promise<{submission_id: number}>}
 */
const submitSolution = (variables) => {
    const {questionSlug} = variables;
    return post(`https://leetcode.cn/problems/${questionSlug}/submit/`, variables);
};

/**
 * 检查提交
 * @param {{id: string}} variables
 * @returns {Promise<*>}
 */
const submitCheck = (variables) => {
    const {id} = variables;
    return get(`https://leetcode.cn/submissions/detail/${id}/check/`);
};

const commandsMap = {
    getQuestionOfToday,
    getQuestionData,
    getQuestionList,
    interpretSolution,
    interpretCheck,
    submitSolution,
    submitCheck
};