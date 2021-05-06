import Mock from 'mockjs'

const Random = Mock.Random

export default {

    'get|/approve-apply': {
        'list|3': [
            {
                "groupName": "分组@cword(2)",
                "processRespVOList|5": [
                    {
                        "id": "@id",
                        "processIconUrl": Random.image('200*200'),
                        "processName": "流程@cword(2)"
                    }
                ]
            }
        ]
    }

}