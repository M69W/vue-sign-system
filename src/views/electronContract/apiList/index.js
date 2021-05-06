// API文档数据
const menu = [
    {
        title: '一、引言',
        disabled: true,
        subTitle: 'API 文档'
    },
    {
        title: '1.1编写目的',
        disabled: false,
        subTitle: '1.1	编写目的',
        content: `本文档将对前端与服务器之间的交互进行详细定义，以便前端开发人员与服务器开发人员有章可循。相关人员在开发过程中，请仔细阅读本文档，
涉及到的交互及数据请照上执行。`
    },
    {
        title: '1.2使用对象',
        disabled: false,
        subTitle: '1.2	使用对象',
        content: `项目管理人员、IOS开发人员、android开发人员、H5开发人员、小程序开发人员、服务器开发人员、web开发人员、测试人员等。`
    },
    {
        title: '1.3参考资料',
        disabled: false,
        subTitle: '1.3参考资料',
        content: `云签系统技术文档、sass系统技术说明文档、合同平台技术说明文档。`
    },
    {
        title: '二、一些规定',
        disabled: true
    },
    {
        title: '2.1一般要求',
        disabled: false,
        subTitle: '2.1一般要求',
        content: `本系统当前采用HTTP请求，之后可能会增加对HTTPS的支持；数据主要采用JSON格式，如果采用特殊格式（如：XML）会特别标出来`
    },
    {
        title: '2.2安全机制',
        disabled: false,
        subTitle: '2.2安全机制',
        content: `为了防止不正当的访问请求或恶意攻击，本系统对所有api请求进去请求头api_token的检验
        1、	用户登陆成功，服务器利用用户ID，采用OAuthToken方式生成用户api_token。
        2、	前端所有请求，请求头添加api_token，服务器进行有效性效验
        `
    },
    {
        title: '三、获取token',
        disabled: true
    },
    {
        title: '3.1获取令牌',
        disabled: false,
        subTitle: '3.1	获取令牌',
        portDesTitle: '接口描述：',
        portDes: '该接口提供所有合法的第三方获取调用业务接口所需的凭证',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/auth/createToken',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json',
        paramsTitle: '请求参数：',
        thead: ['序号','参数','必须','类型','备注'],
        tbody: [
            ['1','client_id','是','String','AppID'],
            ['2','client_secret','是','String','AppSecret'],
            ['3','grant_type','是','String','默认client_credentials'],
            ['4','scope','是','String','默认read'],
            ['5','refresh_token','否','String','默认refresh_token']
        ],
        egTitle: '请求示例：',
        eg:`
        {
            "client_id":"395CB6F10C13461FBD683EF51E62D5C5",
            "client_secret":"4372C1C1DADE4FBAA97274810C1248D5",
            "grant_type":"client_credentials",
            "scope":"read",
            "refresh_token":"refresh_token"
        }    
        `,
        backParams: '返回参数',
        thead2: ['序号','参数','类型','备注'],
        tbody2: [
            ['1','code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['2','msg','String','请求提示信息'],
            ['3','data','Object','数据对象']
        ],
        dataTips: 'data',
        thead3: ['序号','参数','必须','备注'],
        tbody3: [
            ['1','access_token','String','调用应用token'],
            ['2','refresh_token','String','更新令牌'],
            ['3','token_type','String','令牌类型'],
            ['4','expires_in','String','有效时间（秒）']
        ],
        backEgTitle: '返回示例：',
        backEg:`
        {
            "code": "0",
            "msg": "请求成功",
            "data": {
                "access_token": "QXBwbGljYXRpb25JZD0xMTIwMTcxMDE4MjIyNDAxMjMzJk5vbmNlPTg2JlNlY3JldElkPTQ5OTcx%0AYTA3Mzg5ZDNmNzM2YzU5NWMzZWU4M",
                "refresh_token": "%0AYTA3Mzg5ZDNmNzM2YzU5NWMzZWU4M2FhNGI3JlRpbWVzdGFtcD0xNTA5MzQ2MDI2NzE3",
                "token_type": "Bearer",
                "expires_in": "43199999"
                }
            }
        `
    },
    {
        title: '四、文档API',
        disabled: true
    },
    {
        title: '4.1上传文档',
        disabled: false,
        subTitle: '4.1	上传文档',
        portDesTitle: '接口描述：',
        portDes: '上传文档至文档管理，并完成PDF的转换',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/document/api/conversionDocument',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type:multipart/form-data | api_token: token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['file','是','MultipartFile','上传文档',''],
            ['userId','是','String','用户ID','']
        ],
        egTitle: '请求示例：',
        eg:`
        {
            "file": "文件.pdf"
            "userId": "3256985242698"            
        }    
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','文档编码']
        ],
        backEgTitle: '返回示例：',
        backEg:`
            { "code": 0, "msg": "请求成功", "data": "8fb67beb-26a3-48d5-8e57-6be68910b5d9" }
        `
    },
    {
        title: '4.2文档详情查询',
        disabled: false,
        subTitle: '4.2文档详情查询',
        portDesTitle: '接口描述：',
        portDes: '根据文档编码查询文档详情（文件大小、HASH、签署次数、创建时间、最后签署时间、打印次数）',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/document/api/queryDocumentDetail',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/x-www-form-urlencoded  |  api_token: token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [['fileCode','是','String','文档编码','']],
        egTitle: '请求示例：',
        eg:`
        {
            "fileCode": "8fb67beb-26a3-48d5-8e57-6be68910b5d9"
        }    
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            [ 'code', 'Integer', '0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg', 'String', '请求提示信息'],
            [ 'data', 'String', '文档详情']
        ],
        backEgTitle: '返回示例：',
        backEg:`
            {
                "code": 0,
                "msg": "请求成功",
                "data": {
                    "id": "598103506435440640",
                    "userId": "591606514456723456",
                    "fileCode": "900b250c-a7b4-4c99-8dfc-35811de56804",
                    "fileName": "测试.pdf",
                    "filePath": "group2/M00/0A/0E/wKgz5l0kA0WANH7iAAgsKGlHVbM674.pdf",
                    "printNum": 0,
                    "fileSize": "535592",
                    "fileHash": "28EA61354418C903281B73B108E3EC55",
                    "fileType": "application/pdf",
                    "signCount": 5,
                    "downCount": 0,
                    "isDeleted": 0,
                    "gmtCreate": "2019-07-09T10:49:48",
                    "gmtModified": "2019-07-09T11:00:22"
                }
            }            
        `,
        jsonStr: 'data',
        thead4: ['参数','类型','说明'],
        tbody4: [
            ['id','String','snowflake'],
            ['userId','String','上传资源用户Id'],
            ['fileCode','String','文件资源编码UUID'],
            ['fileName','String','文件资源名称'],
            ['filePath','String','文件资源路径'],
            ['printNum','Long','打印次数'],
            ['fileSize','String','文件大小(字节)'],
            ['fileHash','String','文件HASH'],
            ['fileType','String','文件类型'],
            ['signCount','Long','签署次数'],
            ['downCount','Long','下载次数'],
            ['isDeleted','Integer','是否删除（0：未删除；1：删除）'],
            ['gmtCreate','LocalDateTime','创建时间'],
            ['gmtModified','LocalDateTime','修改时间']
        ]
    },
    {
        title: '4.3查询文档签署日志',
        disabled: false,
        subTitle: '4.3查询文档签署日志',
        portDesTitle: '接口描述：',
        portDes: '根据文档编码查询文档签署日志',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/document/api/querySignLog',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json  |  api_token: token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['currPage','是','Integer','页码',''],
            ['pageSize','是','Integer','页数',''],
            ['fileCode','是','String','文档编码','']
        ],
        egTitle: '请求示例',
        eg: `
            {
                "currentPage": 1,
                "fileCode": "900b250c-a7b4-4c99-8dfc-35811de56804",
                "pageSize": 10
            }            
        `,
        backEgTitle: '返回示例',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": {
                    "records": [
                        {
                            "logId": "61",
                            "userName": "13798374338",
                            "orgName": "深圳安印科技",
                            "personalName": null,
                            "sealName": "cesss",
                            "sealType": "01",
                            "sealCode": "44030133347652",
                            "mediumType": "01",
                            "signFileHash": "28EA61354418C903281B73B108E3EC55",
                            "createDate": "2019-07-09 11:00"
                        }
                    ],
                    "total": 5,
                    "size": 10,
                    "current": 1,
                    "ascs": null,
                    "descs": null,
                    "optimizeCountSql": true,
                    "pages": 1
                }
            }            
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码,对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','文档签署日志']
        ],
        dataTips: 'data参数',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['records','Array','日志集'],
            ['total','Integer','总数'],
            ['size','Integer','每页显示条数'],
            ['current','Integer','当前页'],
            ['ascs','String[]','SQL 排序 ASC 数组'],
            ['descs','String[]','SQL 排序 DESC 数组'],
            ['optimizeCountSql','Boolean','自动优化 COUNT SQL'],
            ['pages','Integer','总页数']
        ],
        jsonStr: 'Records',
        thead4: ['参数','类型','说明'],
        tbody4: [
            ['logId','String','日志ID'],
            ['userName','String','签章人用户名'],
            ['orgName','String','所属单位'],
            ['personalName','String','所属个人'],
            ['sealName','String','印章名称'],
            ['sealType','String','印章类型'],
            ['sealCode','String','印章编码'],
            ['mediumType','String','介质类型  云印章  UKEY印章'],
            ['signFileHash','String','签署文件 hash值'],
            ['createDate','Date','签章时间'],
        ]
    },
    {
        title: '4.4文档下载',
        disabled: false,
        subTitle: '4.4文档下载',
        portDesTitle: '接口描述：',
        portDes: '根据文档编码下载文档',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/document/api/downloadDocument',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/x-www-form-urlencoded  |  api_token: token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['fileCode','是','String','文档编码','']
        ],
        egTitle: '请求示例',
        eg: `
            {
                "fileCode": "8fb67beb-26a3-48d5-8e57-6be68910b5d9"
            }
            
        `,
        backEgTitle: '返回示例',
        backEg: `
            该接口正常返回文件流
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','']
        ]
    },
    {
        title: '4.5查询文档列表',
        disabled: false,
        subTitle: '4.5查询文档列表',
        portDesTitle: '接口描述：',
        portDes: '根据文档编码下载文档',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/document/api/queryDocumentList',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/x-www-form-urlencoded  |  api_token: token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['fileName','否','String','文档名称',''],
            ['pageSize','是','Integer','页数',''],
            ['pageNum','是','Integer','页码','']
        ],
        egTitle: '请求示例',
        eg: `
            {
                "fileCode": "8fb67beb-26a3-48d5-8e57-6be68910b5d9"
                "pageSize": 10
                "pageNum": 1
            }
        `,
        backEgTitle: '返回示例',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": {
                    "records": [
                        {
                            "id": "598220505786351616",
                            "userId": "591606514456723456",
                            "fileCode": "66167230-8545-4074-a181-c2311a39fc5f",
                            "fileName": "459099.pfx",
                            "filePath": "group2/M00/0A/15/wKgz5l0kZxGADBk_AAAK70iz-w4665.pfx",
                            "printNum": 0,
                            "fileSize": "2799",
                            "fileHash": "AD19CA6F8CC2F0447117673F66E82189",
                            "fileType": "application/x-pkcs12",
                            "signCount": 0,
                            "downCount": 0,
                            "isDeleted": 0,
                            "gmtCreate": "2019-07-09T18:34:43",
                            "gmtModified": "2019-07-09T18:34:43"
                        }
                    ],
                    "total": 46,
                    "size": 1,
                    "current": 10,
                    "ascs": null,
                    "descs": null,
                    "optimizeCountSql": true,
                    "pages": 46
                }
            }            
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','文档签署日志']
        ],
        dataTips: 'data',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['records','Array','文档集'],
            ['total','Integer','总数'],
            ['size','Integer','每页显示条数'],
            ['current','Integer','当前页'],
            ['ascs','String[]','SQL 排序 ASC 数组'],
            ['descs','String[]','SQL 排序 DESC 数组'],
            ['optimizeCountSql','Boolean','自动优化 COUNT SQL'],
            ['pages','Integer','总页数']
        ],
        jsonStr: 'records',
        thead4: ['参数','类型','说明'],
        tbody4: [
            ['id','String','snowflake'],
            ['userId','String','上传资源用户Id'],
            ['fileCode','String','文件资源编码UUID'],
            ['fileName','String','文件资源名称'],
            ['filePath','String','文件资源路径'],
            ['printNum','Long','打印次数'],
            ['fileSize','String','文件大小(字节)'],
            ['fileHash','String','文件HASH'],
            ['fileType','String','文件类型'],
            ['signCount','Long','签署次数'],
            ['downCount','Long','下载次数'],
            ['isDeleted','Integer','是否删除（0：未删除；1：删除）'],
            ['gmtCreate','LocalDateTime','创建时间'],
            ['gmtModified','LocalDateTime','修改时间']
        ]
    },
    {
        title: '4.6文档浏览(雾化、脱密)',
        disabled: false,
        subTitle: '4.6文档浏览(雾化、脱密)',
        portDesTitle: '接口描述：',
        portDes: '对某文档进行浏览，支持雾化、脱密效果',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/document/fetch/{fileCode}',
        methodTitle: '请求方式：',
        method: 'get',
        headersTitle: '请求头：',
        headers: 'api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['fileCode','是','String','Pdf文件编码','']
        ],
        egTitle: '请求示例',
        eg: `
            http://ip:port/document/fetch/516d4e8d-c892-40f5-bb62-9bc23db9a757
        `,
        backEgTitle: '返回示例',
        backEg: `
            文件字节流
        `
    },
    {
        title: '五、文件管理',
        disabled: true
    },
    {
        title: '5.1上传签发文件',
        disabled: false,
        subTitle: '5.1上传签发文件',
        portDesTitle: '接口描述：',
        portDes: '上传文档至全部文件，并完成PDF的转换',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/file/upload',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type:multipart/form-data  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['file','是','MultipartFile','上传文档','']
        ],
        egTitle: '请求示例',
        eg: `
            "file": "文件.pdf"
        `,
        backEgTitle: '返回示例',
        backEg: `
            { "code": 0, "msg": "请求成功", "data": "8fb67beb-26a3-48d5-8e57-6be68910b5d9" }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Object','文档信息']
        ],
        dataTips: 'data',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['fileCode','String','合同文件编码'],
            ['fileName','String','合同文件名称'],
            ['homePageImagePath','String','合同文件首页图片路径'],
            ['filePage','Integer','合同文件页数']
        ]
    },
    {
        title: '5.2删除签发文件',
        disabled: false,
        subTitle: '5.2删除签发文件',
        portDesTitle: '接口描述：',
        portDes: '根据文档编码删除签发文件',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/file/delete',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/x-www-form-urlencoded  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['fileCode','是','String','文档编码','']
        ],
        egTitle: '请求示例',
        eg: `
            "fileCode": "8fb67beb-26a3-48d5-8e57-6be68910b5d9"
        `,
        backEgTitle: '返回示例',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": true
            }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Boolean', 'true']
        ]
    },
    {
        title: '5.3签发文件详情查询',
        disabled: false,
        subTitle: '5.3签发文件详情查询',
        portDesTitle: '接口描述：',
        portDes: '根据文档编码查询文档详情',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/file/viewFile',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/x-www-form-urlencoded  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['fileCode','是','String','文档编码',''],
        ],
        egTitle: '请求示例',
        eg: `
            "fileCode": "8fb67beb-26a3-48d5-8e57-6be68910b5d9"
        `,
        backEgTitle: '返回示例',
        backEg: `
        {
            "code": 0,
            "msg": "请求成功",
            "data": {
                "id": "621012960705249280",
                "userId": "616002034771951616",
                "fileCode": "6a1d089a-dc90-4974-a140-3a6b4e9fd8a1",
                "fileName": "demo.pdf",
                "filePath": "group1/M00/00/23/wKgz1F13WOyAayBgAAJOLbILZW0049.pdf",
                "atomizationFilePath": null,
                "printNum": 0,
                "fileSize": "151085",
                "fileHash": "474AC2293FAB48E27010900A9B4B062A",
                "fileType": "application/pdf",
                "signCount": 1,
                "downCount": 0,
                "verificationCode": "474AC2293FAB48E27010900A9B4B062A",
                "gmtVerification": "2021-06-03",
                "qrCode": 1,
                "printDisNum": null,
                "isDeleted": 0,
                "gmtCreate": "2019-09-10 16:03:48",
                "gmtModified": "2019-09-10 16:03:56",
                "gmtMod": "2019-09-10 16:03:56",
                "compactStatus": "04",
                "compactId": "621012990501584896",
                "signStatus": "03",
                "carbonCopy": null,
                "sponsor": "616002034771951616",
                "signatoryId": "616002034771951616"
            }
        }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','文档详情']
        ],
        dataTips: 'data',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['id','String','snowflake'],
            ['userId','String','上传资源用户Id'],
            ['fileCode','String','文件资源编码UUID'],
            ['fileName','String','文件资源名称'],
            ['filePath','String','文件资源路径'],
            ['atomizationFilePath','String','雾化文件资源路径'],
            ['printNum','Long','打印次数'],
            ['fileSize','String','文件大小(字节)'],
            ['fileHash','String','文件HASH'],
            ['fileType','String','文件类型'],
            ['signCount','Long','签署次数'],
            ['downCount','Long','下载次数'],
            ['verificationCode','String','验证码'],
            ['gmtVerification','String','验证有效时间 0为永久有效'],
            ['qrCode','Integer','二维码'],
            ['printDisNum','Long','最后一次打印分配次数'],
            ['isDeleted','Integer','是否删除（0：未删除；1：删除）'],
            ['gmtCreate','LocalDateTime','创建时间'],
            ['gmtModified','LocalDateTime','签署时间'],
            ['gmtMod','LocalDateTime','修改时间'],
            ['compactStatus','String','文件状态（01：草稿；02：已撤销；03：已拒签；04：签署中；05：签署完成；）'],
            ['compactId','String','文件ID'],
            ['signStatus','String','签署状态（01：待我签署；02：待他人签；03：签署通过；04签署不通过）'],
            ['carbonCopy','String','抄送人'],
            ['sponsor','String','合同发起人'],
            ['signatoryId','String','签署人ID']
        ]
    },
    {
        title: '5.4查询文档签署日志',
        disabled: false,
        subTitle: '5.4 查询文档签署日志',
        portDesTitle: '接口描述：',
        portDes: '根据文档编码查询文档签署日志',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/document/api/querySignLog',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/json  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['currentPage','是','Integer','页码',''],
            ['pageSize','是','Integer','页数',''],
            ['fileCode','是','Integer','文档编码','']
        ],
        egTitle: '请求示例',
        eg: `
        {
            "currentPage": 1,
            "fileCode": "900b250c-a7b4-4c99-8dfc-35811de56804",
            "pageSize": 10
          }
        `,
        backEgTitle: '返回示例',
        backEg: `
        {
            "code": 0,
            "msg": "请求成功",
            "data": {
                "records": [
                    {
                        "logId": "61",
                        "userName": "13798374338",
                        "orgName": "深圳安印科技",
                        "personalName": null,
                        "sealName": "cesss",
                        "sealType": "01",
                        "sealCode": "44030133347652",
                        "mediumType": "01",
                        "signFileHash": "28EA61354418C903281B73B108E3EC55",
                        "createDate": "2019-07-09 11:00"
                    }
                ],
                "total": 5,
                "size": 10,
                "current": 1,
                "ascs": null,
                "descs": null,
                "optimizeCountSql": true,
                "pages": 1,
                "searchCount": true
            }
        }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','文档签署日志']
        ],
        dataTips: 'data',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['records','Array','日志集'],
            ['total','Integer','总数'],
            ['size','Integer','每页显示条数'],
            ['current','Integer','当前页'],
            ['ascs','String[]','SQL 排序 ASC 数组'],
            ['descs','String[]','SQL 排序 DESC 数组'],
            ['optimizeCountSql','Boolean','自动优化 COUNT SQL'],
            ['pages','Integer','总页数'],
            ['searchCount','Boolean','查询总记录数，默认为 true']
        ],
        jsonStr: 'Records',
        thead4: ['参数','类型','说明'],
        tbody4: [
            ['logId','String','日志ID'],
            ['userName','String','签章人用户名'],
            ['orgName','String','所属单位'],
            ['personalName','String','所属个人'],
            ['sealName','String','印章名称'],
            ['sealType','String','印章类型'],
            ['sealCode','String','印章编码'],
            ['mediumType','String','介质类型  云印章  UKEY印章'],
            ['signFileHash','String','签署文件 hash值'],
            ['createDate','Date','签章时间']
        ]
    },
    {
        title: '5.5签发文件下载',
        disabled: false,
        subTitle: '5.5签发文件下载',
        portDesTitle: '接口描述：',
        portDes: '根据文档编码下载文档',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/fileDown/fetch',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/x-www-form-urlencoded  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['fileCode','是','String','文档编码','']
        ],
        egTitle: '请求示例',
        eg: `
        {
            "fileCode": "8fb67beb-26a3-48d5-8e57-6be68910b5d9"
        }
        `,
        backEgTitle: '返回示例',
        backEg: `
            该接口正常返回文件流
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','']
        ]
    },
    {
        title: '5.6获取签发文件属性信息',
        disabled: false,
        subTitle: '5.6 获取签发文件属性信息',
        portDesTitle: '接口描述：',
        portDes: '根据文档编码获取文件属性信息',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/document/fetch/getPicSize/{fileCode}',
        methodTitle: '请求方式：',
        method: 'GET',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/x-www-form-urlencoded  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['fileCode','是','String','文档编码','']
        ],
        egTitle: '请求示例',
        eg: `
            https://ip:port/document/fetch/getPicSize/8fb67beb-26a3-48d5-8e57-6be68910b5d9
        `,
        backEgTitle: '返回示例',
        backEg: `
        {
            "code": 0,
            "msg": "请求成功",
            "data": {
                "totalPageNo": 2,
                "height": 842,
                "width": 595
            }
        }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Object','文件信息']
        ],
        dataTips: 'data',
        thead3: ['参数','类型','说明'],
        tbody3: [
           ['totalPageNo','Integer','文件总页码'],
           ['height','Integer','文件高度'],
           ['width','Integer','文件宽度'],
        ]
    },
    {
        title: '5.7分页查看签发文件',
        disabled: false,
        subTitle: '5.7分页查看签发文件',
        portDesTitle: '接口描述：',
        portDes: '根据文档编码分页查看文档',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/document/scan/page/{fileCode}',
        methodTitle: '请求方式：',
        method: 'GET',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/x-www-form-urlencoded  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['fileCode','是','String','文档编码','']
        ],
        egTitle: '请求示例',
        eg: `
            https://ip:port/document/scan/page/8fb67beb-26a3-48d5-8e57-6be68910b5d9
        `,
        backEgTitle: '返回示例',
        backEg: `
            该接口正常返回文件图片流
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','']
        ],
    },
    {
        title: '5.8查询文档列表',
        disabled: false,
        subTitle: '5.8查询文档列表',
        portDesTitle: '接口描述：',
        portDes: '根据文档编码下载文档',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/file/query',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/x-www-form-urlencoded  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['fileName','否','String','文档名称',''],
            ['pageSize','是','Integer','页数',''],
            ['pageNum','是','Integer','页码',''],
            ['orgId','是','String','所属组织ID','']
        ],
        egTitle: '请求示例',
        eg: `
            https://ip:port/file/query?pageNum=1&pageSize=10&content=&orgId=616000932680826880
        `,
        backEgTitle: '返回示例',
        backEg: `
        {
            "code": 0,
            "msg": "请求成功",
            "data": {
                "records": [{
                    "id": "621012960705249280",
                    "userId": "616002034771951616",
                    "fileCode": "6a1d089a-dc90-4974-a140-3a6b4e9fd8a1",
                    "fileName": "demo.pdf",
                    "filePath": "group1/M00/00/23/wKgz1F13WOyAayBgAAJOLbILZW0049.pdf",
                    "printNum": 0,
                    "fileSize": "151085",
                    "fileHash": "474AC2293FAB48E27010900A9B4B062A",
                    "fileType": "application/pdf",
                    "signCount": 1,
                    "downCount": 1,
                    "verificationCode": "474AC2293FAB48E27010900A9B4B062A",
                    "gmtVerification": "2021-06-03",
                    "qrCode": 1,
                    "isDeleted": 0,
                    "gmtCreate": "2019-09-10 16:03:48",
                    "gmtModified": "2019-09-10 16:03:56",
                    "gmtMod": "2019-09-10 16:51:08",
                    "createUserName": null,
                    "compactTheme": "demo.pdf",
                    "creatUser": "angus"
                }],
                "total": 9,
                "size": 10,
                "current": 1,
                "ascs": null,
                "descs": null,
                "optimizeCountSql": true,
                "pages": 1,
                "searchCount": true
            }
        }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','文档签署日志']
        ],
        dataTips: 'data返回参数',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['records','Array','文档集'],
            ['total','Integer','总数'],
            ['size','Integer','每页显示条数'],
            ['current','Integer','当前页'],
            ['ascs','String[]','SQL 排序 ASC 数组'],
            ['descs','String[]','SQL 排序 DESC 数组'],
            ['optimizeCountSql','Boolean','自动优化 COUNT SQL'],
            ['pages','Integer','总页数'],
            ['searchCount','Boolean','查询总记录数，默认为 true']
        ],
        jsonStr: 'records返回参数',
        thead4: ['参数','类型','说明'],
        tbody4: [
            ['id','String','snowflake'],
            ['userId','String','上传资源用户Id'],
            ['fileCode','String','文件资源编码UUID'],
            ['fileName','String','文件资源名称'],
            ['filePath','String','文件资源路径'],
            ['printNum','Long','打印次数'],
            ['fileSize','String','文件大小(字节)'],
            ['fileHash','String','文件HASH'],
            ['fileType','String','文件类型'],
            ['signCount','Long','签署次数'],
            ['downCount','Long','下载次数'],
            ['verificationCode','String','验证码'],
            ['gmtVerification','String','验证有效时间 0为永久有效'],
            ['qrCode','Integer','二维码'],
            ['isDeleted','Integer','是否删除（0：未删除；1：删除）'],
            ['gmtCreate','LocalDateTime','创建时间'],
            ['gmtModified','LocalDateTime','签署时间'],
            ['gmtMod','LocalDateTime','修改时间'],
            ['compactId','String','文件ID'],
            ['createUserName','String','合同名称'],
            ['compactTheme','String','名称'],
            ['creatUser','String','添加用户名称'],
        ]
    },
    {
        title: '5.9查询文档打印日志',
        disabled: false,
        subTitle: '5.9查询文档打印日志',
        portDesTitle: '接口描述：',
        portDes: '根据文档编码查询文档打印日志',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/document/print/getFilePrintList',
        methodTitle: '请求方式：',
        method: 'GET',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/json  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['currentPage','是','Integer','页码',''],
            ['pageSize','是','Integer','页数',''],
            ['fileCode','是','Integer','文档编码','']
        ],
        egTitle: '请求示例',
        eg: `
        https://ip:port/document/print/getFilePrintList?currPage=1&pageSize=10&fileCode=6a1d089a-dc90-4974-a140-3a6b4e9fd8a1
        `,
        backEgTitle: '返回示例',
        backEg: `
        {
            "code": 0,
            "msg": "请求成功",
            "data": {
                "records": [{
                    "id": "621039409596203008",
                    "printUser": "616002034771951616",
                    "userEnterprise": "616000932680826880",
                    "userType": 1,
                    "userChannel": 2,
                    "fileCode": "6a1d089a-dc90-4974-a140-3a6b4e9fd8a1",
                    "gmtCreate": "2019-09-10 17:48:54",
                    "userName": "angus",
                    "enterpriseName": "Angustest"
                }],
                "total": 1,
                "size": 10,
                "current": 1,
                "ascs": null,
                "descs": null,
                "optimizeCountSql": true,
                "pages": 1,
                "searchCount": true
            }
        }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','文档签署日志']
        ],
        dataTips: 'data',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['records','Array','日志集'],
            ['total','Integer','总数'],
            ['size','Integer','每页显示条数'],
            ['current','Integer','当前页'],
            ['ascs','String[]','SQL 排序 ASC 数组'],
            ['descs','String[]','SQL 排序 DESC 数组'],
            ['optimizeCountSql','Boolean','自动优化 COUNT SQL'],
            ['pages','Integer','总页数'],
            ['searchCount','Boolean','查询总记录数，默认为 true']
        ],
        jsonStr: 'Records',
        thead4: ['参数','类型','说明'],
        tbody4: [
            ['id','String','打印ID'],
            ['printUser','String','打印用户ID'],
            ['userEnterprise','String','用户所属单位/个人ID'],
            ['userType','String','1单位2个人'],
            ['userChannel','String','1后台用户2前台用户'],
            ['fileCode','String','文件code'],
            ['gmtCreate','String','打印时间'],
            ['userName','String','用户名称'],
            ['enterpriseName','String','企业/个人名称']
        ]
    },
    {
        title: '六、合同管理',
        disabled: true
    },
    {
        title: '6.1.1发起合同(自己不用签署)',
        disabled: false,
        subTitle: '6.1.1发起合同(自己不用签署)',
        portDesTitle: '接口描述：',
        portDes: '发起合同',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/contract/initiateContract',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/json  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['compactTheme','是','String','主题',''],
            ['isSiteSign','是','String','是否指定签署位置','（0：未指定签署位置；1：指定签署位置；）'],
            ['orgId ','是','String','所属组织ID',''],
            ['remark','否','String','备注',''],
            ['signDeadline','否','Date','签署截止日期','格式为“yyyy/MM/dd”'],
            ['signWay','是','String','签署方式','01：无序签；02：顺序签署；03：每人单独签署；'],
            ['signatoryWay','是','String','签署对象','01：我需要签署；02：仅需他人签署；'],
            ['type','是','String','类型','01:文件管理，02:合同'],
            ['validityEndDate','否','String','合同有效期','格式为“yyyy/MM/dd”'],
            ['compactFieldInfoReqVOList','否','Array','签名域信息集',''],
            ['contractFileList ','是','Array','合同文件',''],
            ['signInfos','是','Array','签署信息','']
        ],
        egTitle: '请求示例',
        eg: `
        {
            "compactFieldInfoReqVOList": [
              {
                "compactFileCode": "string",
                "signName": "string",
                "signType": "01",
                "signatoryId": "string",
                "signatureCoordinateX": 0,
                "signatureCoordinateY": 0,
                "signatureEndPage": 0,
                "signatureMethod": "01",
                "signatureStartPage": 0
              }
            ],
            "compactTheme": "string",
            "contractFileList": [
              {
                "fileCode": "string",
                "fileName": "string",
                "fileType": "01",
                "pageTotal": 0
              }
            ],
            "isSiteSign": "0",
            "orgId": "string",
            "remark": "string",
            "signDeadline": "2019/09/10",
            "signInfos": [
              {
                "signContact": "string",
                "signName": "string",
                "signatoryId": "string",
                "type": "01"
              }
            ],
            "signWay": "01",
            "signatoryWay": "01",
            "type": "01",
            "validityEndDate": "2019/09/10"
          }
        `,
        backEgTitle: '返回示例',
        backEg: `
        { "code": 0, "msg": "请求成功", "data": "621022834335940608" }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','合同ID']
        ],
        dataTips: 'compactFieldInfoReqVOList',
        thead3: ['参数','必须','类型','说明','备注'],
        tbody3: [
            ['compactFileCode','是','String','合同文件编码',''],
            ['signName','是','String','签署人名称',''],
            ['signType','是','String','位置类型','(01:印章；02:签名；03:日期)'],
            ['signatoryId','是','String','签署人ID',''],
            ['signatureCoordinateX','是','number','签署坐标X轴',''],
            ['signatureCoordinateY','是','number','签署坐标Y轴',''],
            ['signatureEndPage','是','Integer','签署结束页数','单页签署传0'],
            ['signatureMethod','是','String','签章方式','01：单页签章；02：多页签章；03：骑缝签章；04:连页签章'],
            ['signatureStartPage','是','String','签署开始页数','']
        ],
        jsonStr: 'contractFileList',
        thead4: ['参数','必须','类型','说明','备注'],
        tbody4: [
            ['fileCode ','是','String','合同文件编码',''],
            ['fileName','是','String','文件名称',''],
            ['fileType','是','String','合同文档类型','（01：合同文件；02：合同附件；）'],
            ['pageTotal','是','String','合同文件页数',''],
        ],
        errCode: 'signInfos',
        thead5: ['参数','必须','类型','说明','备注'],
        tbody5: [
            ['signContact','是','String','签署人的联系方式(手机/邮箱)',''],
            ['signName','是','String','签署人名称',''],
            ['signatoryId','否','String','签署人Id',''],
            ['type','是','String','签署方式：01:签署；02：抄送','']
        ]
    },
    {
        title: '6.1.2发起合同(自己需签署)',
        disabled: false,
        subTitle: '6.1.2发起合同(自己需签署)',
        portDesTitle: '接口描述：',
        portDes: '发起合同',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/contract/initiateSignContract',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['compactTheme','是','String','主题',''],
            ['isSiteSign','是','String','是否指定签署位置','（0：未指定签署位置；1：指定签署位置；）'],
            ['orgId ','是','String','所属组织ID',''],
            ['remark','否','String','备注',''],
            ['signDeadline','否','Date','签署截止日期','格式为“yyyy/MM/dd”'],
            ['signWay','是','String','签署方式','01：无序签；02：顺序签署；03：每人单独签署；'],
            ['signatoryWay','是','String','签署对象','01：我需要签署；02：仅需他人签署；'],
            ['type','是','String','类型','01:文件管理，02:合同'],
            ['validityEndDate','否','String','合同有效期','格式为“yyyy/MM/dd”'],
            ['compactFieldInfoReqVOList','否','Array','签名域信息集',''],
            ['contractFileList ','是','Array','合同文件',''],
            ['signInfos','是','Array','签署信息',''],
            ['fileManageSignReqVOS','是','Array','签章信息',''],
            ['ukeySignReqVOS','是','Array','UKEY签章信息','']
        ],
        dataTips: 'compactFieldInfoReqVOList',
        thead3: ['参数','必须','类型','说明','备注'],
        tbody3: [
            ['compactFileCode','是','String','合同文件编码',''],
            ['signName','是','String','签署人名称',''],
            ['signType','是','String','位置类型','(01:印章；02:签名；03:日期)'],
            ['signatoryId','是','String','签署人ID',''],
            ['signatureCoordinateX','是','number','签署坐标X轴',''],
            ['signatureCoordinateY','是','number','签署坐标Y轴',''],
            ['signatureEndPage','是','Integer','签署结束页数','单页签署传0'],
            ['signatureMethod','是','String','签章方式','01：单页签章；02：多页签章；03：骑缝签章；04:连页签章'],
            ['signatureStartPage','是','String','签署开始页数','']
        ],
        jsonStr: 'contractFileList',
        thead4: ['参数','必须','类型','说明','备注'],
        tbody4: [
            ['fileCode ','是','String','合同文件编码',''],
            ['fileName','是','String','文件名称',''],
            ['fileType','是','String','合同文档类型','（01：合同文件；02：合同附件；）'],
            ['pageTotal','是','String','合同文件页数',''],
        ],
        errCode: 'signInfos',
        thead5: ['参数','必须','类型','说明','备注'],
        tbody5: [
            ['signContact','是','String','签署人的联系方式(手机/邮箱)',''],
            ['signName','是','String','签署人名称',''],
            ['signatoryId','否','String','签署人Id',''],
            ['type','是','String','签署方式：01:签署；02：抄送','']
        ],
        title6: 'FileManageSignReqVOS',
        thead6: ['参数','必须','类型','说明','备注'],
        tbody6: [
            ['compactFileCode','是','String','合同文件编码',''],
            ['compactId','是','String','合同文件ID',''],
            ['foggy','是','Boolean','是否雾化',''],
            ['grey','是','Boolean','是否脱密',''],
            ['originalFileName','是','String','原文件名称',''],
            ['pageSize','否','String','骑缝签时每枚章的覆盖页数',''],
            ['sealCode','是','String','章模编码',''],
            ['signName','是','String','签署人名称',''],
            ['signType','是','String','位置类型','(01:印章；02:签名；03:日期)'],
            ['signatoryId','是','String','签署人Id',''],
            ['signatureCoordinateX','是','number','签署坐标X轴',''],
            ['signatureCoordinateY','是','number','签署坐标Y轴',''],
            ['signatureEndPage','是','Integer','签署结束页数',''],
            ['signatureMethod','是','String','签章方式','01：单页签章；02：多页签章；03：骑缝签章；04:连页签章'],
            ['signatureStartPage','是','String','签署开始页数','']
        ],
        title7: 'ukeySignReqVOS',
        thead7: ['参数','必须','类型','说明','备注'],
        tbody7: [
            ['fileCode','是','String',' 签章文件编码',''],
            ['fileName ','是','String','fileCode',''],
            ['list','是','Array','签章参数',''],
            ['ukeySignPdfBase64','是','String','Ukey签署完成的文件base64',''],
            ['userId','是','String','uKey签章的用户','']
        ],
        title8: 'list',
        thead8: ['参数','必须','类型','说明','备注'],
        tbody8: [
            ['foggy','是','Boolean','是否雾化',''],
            ['grey','是','Boolean','是否脱密',''],
            ['llx','是','number','章模中心位置x座标',''],
            ['lly','是','number','章模中心位置y座标',''],
            ['pageNum','是','Integer','开始页',''],
            ['pageNumEnd','是','Integer','结束页',''],
            ['pdfWidth','是','number','文件宽度',''],
            ['sealCode','是','String','印章编码',''],
            ['sealName','是','String','印章名称',''],
            ['urx','是','number','章模宽度',''],
            ['ury','是','number','章模高度','']
        ],
        egTitle: '请求示例',
        eg: `
        {
            "compactFieldInfoReqVOList": [
              {
                "compactFileCode": "string",
                "pageSize": "2",
                "signName": "string",
                "signType": "01",
                "signatoryId": "string",
                "signatureCoordinateX": 0,
                "signatureCoordinateY": 0,
                "signatureEndPage": 0,
                "signatureMethod": "01",
                "signatureStartPage": 0
              }
            ],
            "compactTheme": "string",
            "contractFileList": [
              {
                "fileCode": "string",
                "fileName": "string",
                "fileType": "01",
                "pageTotal": 0
              }
            ],
            "contractId": "string",
            "fileManageSignReqVOS": [
              {
                "compactFileCode": "string",
                "compactId": "string",
                "coverPageNum": 0,
                "foggy": false,
                "grey": false,
                "originalFileName": "string",
                "pageSize": "3",
                "sealCode": "string",
                "signName": "string",
                "signType": "01",
                "signatoryId": "string",
                "signatureCoordinateX": 0,
                "signatureCoordinateY": 0,
                "signatureEndPage": 0,
                "signatureMethod": "01",
                "signatureStartPage": 0
              }
            ],
            "isSiteSign": "0",
            "orgId": "string",
            "remark": "string",
            "signDeadline": "2019/09/10",
            "signInfos": [
              {
                "signContact": "string",
                "signName": "string",
                "signatoryId": "string",
                "type": "01"
              }
            ],
            "signWay": "01",
            "signatoryWay": "01",
            "type": "01",
            "ukeySignReqVOS": [
              {
                "fileCode": "string",
                "fileName": "string",
                "list": [
                  {
                    "foggy": false,
                    "grey": false,
                    "llx": 0,
                    "lly": 0,
                    "pageNum": 0,
                    "pageNumEnd": 0,
                    "pdfWidth": 0,
                    "sealCode": "string",
                    "sealName": "string",
                    "urx": 0,
                    "ury": 0
                  }
                ],
                "ukeySignPdfBase64": "string",
                "userId": "string"
              }
            ],
            "validityEndDate": "2019/09/10"
          }
        `,
        backEgTitle: '返回示例',
        backEg: `
        { "code": 0, "msg": "请求成功", "data": "621022834335940608" }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','合同ID']
        ]
    },
    {
        title: '6.2删除合同',
        disabled: false,
        subTitle: '6.2删除合同',
        portDesTitle: '接口描述：',
        portDes: '根据合同id删除合同',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/contract/delContract',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/x-www-form-urlencoded  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody:[
            ['contractId','是','String','合同ID','']
        ],
        egTitle: '请求示例',
        eg: `
            "contractId": "621022834335940608"
        `,
        backEgTitle: '返回示例',
        backEg: `
            {"code":0,"msg":"请求成功","data":true}
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Boolean','删除成功与否']
        ]
    },
    {
        title: '6.3查看合同',
        disabled: false,
        subTitle: '6.3查看合同',
        portDesTitle: '接口描述：',
        portDes: '根据合同id查看合同',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/contract/viewContract',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/x-www-form-urlencoded  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody:[
            ['contractId','是','String','合同ID','']
        ],
        egTitle: '请求示例',
        eg: `
            "contractId": "621022834335940608"
        `,
        backEgTitle: '返回示例',
        backEg: `
        {
            "code": 0,
            "msg": "请求成功",
            "data": {
                "contractId": "621009861110398976",
                "contractTheme": "demo.pdf",
                "compactFiles": [
                    {
                        "id": "621009861164924928",
                        "compactId": "621009861110398976",
                        "fileCode": "235e147d-e932-46ea-a1f0-a490fcb81acc",
                        "fileCodeOrigin": "0f708a59-a995-4745-bcbb-375222c48866",
                        "fileName": "demo.pdf",
                        "fileType": "01",
                        "isDeleted": 0,
                        "gmtCreate": "2019-09-10 15:51:29",
                        "creatUser": "615971303567917056",
                        "gmtModified": "2019-09-10 15:54:13",
                        "modifyUser": "615971303567917056",
                        "pageTotal": 3
                    }
                ],
                "compactAttachments": [],
                "contractStatus": "05",
                "compactStartDate": "2019-09-10 15:51:29",
                "signDeadline": null,
                "remark": null,
                "revocationRemake": null,
                "refuseSignRemake": null,
                "signStatusInfo": [
                    {
                        "id": "621009861185896448",
                        "compactId": "621009861110398976",
                        "signatoryId": "615971303567917056",
                        "nextSignatoryId": null,
                        "signStatus": "03",
                        "signContact": "13111111111",
                        "signName": "cs",
                        "serialNumber": 0,
                        "isKeySignature": 0,
                        "isDeleted": 0,
                        "turnSignFlag": 0,
                        "turnToId": null,
                        "turnDate": null,
                        "gmtCreate": "2019-09-10 15:51:29",
                        "creatUser": "615971303567917056",
                        "gmtModified": "2019-09-10 15:54:13",
                        "modifyUser": "615971303567917056",
                        "signDate": "2019-09-10 15:54:13"
                    }
                ],
                "signSysCompactLogs": [
                    {
                        "name": "cs",
                        "phoneOrMail": "13111111111",
                        "type": "0",
                        "operaDate": "2019-09-10 18:14:36"
                    },
                    {
                        "name": "cs",
                        "phoneOrMail": "13111111111",
                        "type": "0",
                        "operaDate": "2019-09-10 15:51:34"
                    },
                    {
                        "name": "cs",
                        "phoneOrMail": "13111111111",
                        "type": "1",
                        "operaDate": "2019-09-10 15:51:32"
                    }
                ],
                "deleteOrRevoke": null,
                "sponsorId": "615971303567917056"
            }
        }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','ContractDetailRespDTO','合同详情']
        ],
        dataTips: 'ContractDetailRespDTO',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['contractId','String','合同ID'],
            ['compactStartDate','String','发起时间'],
            ['contractStatus','String','合同状态 01：草稿；02：已撤销；03：已拒签；0401：待我签署 0402 待他人签；05：签署完成；06:已过期'],
            ['contractTheme','String','合同主题'],
            ['deleteOrRevoke','boolean','是否删除或撤销'],
            ['refuseSignRemake','String','拒签原因'],
            ['remark','String','备注'],
            ['revocationRemake','String','撤销原因'],
            ['signDeadline','String','截止时间'],
            ['sponsorId','String','合同发起人ID'],
            ['compactAttachments','Array','合同附件'],
            ['compactFiles','Array','合同文件'],
            ['signStatusInfo','Array','签署状态'],
            ['signSysCompactLogs','Array','操作记录']
        ],
        jsonStr: 'compactAttachments',
        thead4: ['参数','类型','说明'],
        tbody4: [
            ['contractId','String','合同ID'],
            ['creatUser','String','创建者'],
            ['fileCode','String','资源文件编码'],
            ['fileName','String','文件名'],
            ['fileType','String','合同文档类型（01：合同文件；02：合同附件；）'],
            ['gmtCreate','String','创建时间'],
            ['gmtModified','String','修改时间'],
            ['pageTotal','Integer','总页数']
        ],
        errCode: 'compactFiles',
        thead5: ['参数','类型','说明'],
        tbody5: [
            ['contractId','String','合同ID'],
            ['creatUser','String','创建者'],
            ['fileCode','String','资源文件编码'],
            ['fileName','String','文件名'],
            ['fileType','String','合同文档类型（01：合同文件；02：合同附件；）'],
            ['gmtCreate','String','创建时间'],
            ['gmtModified','String','修改时间'],
            ['pageTotal','Integer','总页数']
        ],
        title6: 'signStatusInfo',
        thead6: ['参数','类型','说明'],
        tbody6: [
            ['contractId','String','合同ID'],
            ['signContact','String','签署人的联系方式(手机/邮箱)'],
            ['signDate','String','签署时间'],
            ['signName','String','签署人名称'],
            ['signStatus','String','签署状态（01：待我签署；02：待他人签；03：签署通过；04签署不通过）'],
            ['signatoryId','String','签署人Id'],
            ['gmtModified','String','修改时间'],
            ['pageTotal','Integer','总页数']
        ],
        title7: 'signSysCompactLogs',
        thead7: ['参数','类型','说明'],
        tbody7: [
           ['name','String','姓名'],
           ['operaDate','String','操作时间'],
           ['phoneOrMail','String','联系方式'],
           ['type','String','操作类型（0查看 1签署 2打印 3下载 4拒签）']
        ]
    },
    {
        title: '6.4下载合同',
        disabled: false,
        subTitle: '6.4下载合同',
        portDesTitle: '接口描述：',
        portDes: '根据合同id下载合同',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/contract/downloadContract',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/x-www-form-urlencoded  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody:[
            ['contractId','是','String','合同ID','']
        ],
        egTitle: '请求示例',
        eg: `
            "contractId": "621022834335940608"
        `,
        backEgTitle: '返回示例',
        backEg: `
            返回合同文件压缩包
        `
    },
    {
        title: '6.5合同列表',
        disabled: false,
        subTitle: '6.5合同列表',
        portDesTitle: '接口描述：',
        portDes: '合同列表查询',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/contract/queryContract',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/json  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody:[
            ['content','否','String','搜索词',''],
            ['orgId','是','String','所属组织ID',''],
            ['pageNum','是','Integer','当前页',''],
            ['pageSize','是','Integer','页数',''],
            ['status','否','String','合同状态 01：草稿；02：已撤销；03：已拒签；0401：待我签署 0402 待他人签；05：签署完成；06:已过期',''],
            ['timeAfter','否','String','结束时间','格式“yyyy/MM/dd”'],
            ['timeBefore','否','String','开始时间','格式“yyyy/MM/dd”'],
        ],
        egTitle: '请求示例',
        eg: `
        {
            "status": "",
            "content": "",
            "timeBefore": "",
            "timeAfter": "",
            "pageNum": 1,
            "pageSize": 10,
            "orgId": "613800912485351424"
        }
        `,
        backEgTitle: '返回示例',
        backEg: `
        {
            "code": 0,
            "msg": "请求成功",
            "data": {
                "records": [
                    {
                        "compactTheme": "demo.pdf",
                        "compactId": "621009861110398976",
                        "sponsor": "cs",
                        "sponsorId": "615971303567917056",
                        "signer": "cs",
                        "startingTime": "2019-09-10 15:51:29",
                        "contractStatus": "05",
                        "verificationCode": "f49b58df876a9b6dc06fe00df2a3d9a7",
                        "qrCode": "/sign/verify/qrCode/621009861110398976",
                        "verificationDate": null
                    }
                ],
                "total": 12,
                "size": 10,
                "current": 1,
                "ascs": null,
                "descs": null,
                "optimizeCountSql": true,
                "pages": 2,
                "searchCount": true
            }
        }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','object','合同列表详情']
        ],
        dataTips: 'object',
        thead3: ['参数','类型','说明'],
        tbody3:[
            ['compactTheme','String','合同主题'],
            ['compactId','String','合同主键'],
            ['contractStatus','String','合同状态 01：草稿；02：已撤销；03：已拒签；0401：待我签署 0402 待他人签；05：签署完成；06:已过期'],
            ['qrCode','String','二维码'],
            ['signer','String','签署人'],
            ['sponsor','String','发起方'],
            ['sponsorId','String','发起方用户ID'],
            ['startingTime','String','发起时间'],
            ['verificationCode','String','验证码'],
            ['verificationDate','String','验证码有效期']
        ]
    },
    {
        title: '6.6合同签署日志',
        disabled: false,
        subTitle: '6.6合同签署日志',
        portDesTitle: '接口描述：',
        portDes: '根据合同ID查询签署日志',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/contract/contractSignLog',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/json  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody:[
            ['contractId','是','String','合同ID',''],
            ['pageNum','是','Integer','页码',''],
            ['pageSize','是','Integer','页数','']
        ],
        egTitle: '请求示例',
        eg: `
        {
            "contractId": "621022834335940608",
            "pageNum": 1,
            "pageSize": 10
        }
        `,
        backEgTitle: '返回示例',
        backEg: `
        { 
            "code": 0,
            "msg": "请求成功",
            "data": {
                "records": [
                    {
                        "name": "cs",
                        "phoneOrMail": "13111111111",
                        "type": "1",
                        "operaDate": "2019-09-10 15:51:32"
                    }
                ],
                "total": 1,
                "size": 10,
                "current": 1,
                "ascs": null,
                "descs": null,
                "optimizeCountSql": true,
                "pages": 1,
                "searchCount": true
            }
        }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','object','合同签署日志']
        ],
        dataTips: 'object',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['name','String','操作人'],
            ['dataTips','String','联系方式'],
            ['dataTips','String','操作时间'],
            ['type','String','操作类型（0查看 1签署 2打印 3下载 4拒签）']
        ]
    },
    {
        title: '6.7合同打印日志',
        disabled: false,
        subTitle: '6.7合同打印日志',
        portDesTitle: '接口描述：',
        portDes: '根据合同ID查询打印日志',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/contract/contractPrintLog',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/json  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody:[
            ['contractId','是','String','合同ID',''],
            ['pageNum','是','Integer','页码',''],
            ['pageSize','是','Integer','页数','']
        ],
        egTitle: '请求示例',
        eg: `
        {
            "contractId": "621022834335940608",
            "pageNum": 1,
            "pageSize": 10
        }
        `,
        backEgTitle: '返回示例',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": {
                    "records": [
                        {
                            "name": "cs",
                            "phoneOrMail": "13111111111",
                            "type": "2",
                            "operaDate": "2019-09-10 15:51:32"
                        }
                    ],
                    "total": 1,
                    "size": 10,
                    "current": 1,
                    "ascs": null,
                    "descs": null,
                    "optimizeCountSql": true,
                    "pages": 1,
                    "searchCount": true
                }
            }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','object','合同签署日志']
        ],
        dataTips: 'object',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['name','String','操作人'],
            ['dataTips','String','联系方式'],
            ['dataTips','String','操作时间'],
            ['type','String','操作类型（0查看 1签署 2打印 3下载 4拒签）']
        ]
    },
    {
        title: '6.8合同签署',
        disabled: false,
        subTitle: '6.8合同签署',
        portDesTitle: '接口描述：',
        portDes: '签署合同',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/contract/signContract',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/json  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody:[
            ['contractId','是','String','合同ID',''],
            ['signReqVOS','是','Array','签署信息',''],
            ['ukeySignReqVOS','是','Array','UKEY签署信息','']
        ],
        egTitle: '请求示例',
        eg: `
        {
            {
                "contractId": "621022834335940608",
                "signReqVOS": [
                  {
                    "compactFileCode": "string",
                    "compactId": "621022834335940608",
                    "foggy": false,
                    "grey": false,
                    "originalFileName": "string",
                    "pageSize": "2",
                    "sealCode": "string",
                    "signName": "string",
                    "signType": "01",
                    "signatoryId": "string",
                    "signatureCoordinateX": 0,
                    "signatureCoordinateY": 0,
                    "signatureEndPage": 0,
                    "signatureMethod": "01",
                    "signatureStartPage": 0
                  }
                ],
                "ukeySignReqVOS": [
                  {
                    "fileCode": "string",
                    "fileName": "string",
                    "list": [
                      {
                        "foggy": false,
                        "grey": false,
                        "llx": 0,
                        "lly": 0,
                        "pageNum": 0,
                        "pageNumEnd": 0,
                        "pdfWidth": 0,
                        "sealCode": "string",
                        "sealName": "string",
                        "urx": 0,
                        "ury": 0
                      }
                    ],
                    "ukeySignPdfBase64": "string",
                    "userId": "string"
                  }
                ]
            }
        }
        `,
        backEgTitle: '返回示例',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data":{
                    "records": [
                        {
                            "name": "cs",
                            "phoneOrMail": "13111111111",
                            "type": "2",
                            "operaDate": "2019-09-10 15:51:32"
                        }
                    ],
                    "total": 1,
                    "size": 10,
                    "current": 1,
                    "ascs": null,
                    "descs": null,
                    "optimizeCountSql": true,
                    "pages": 1,
                    "searchCount": true
                }
            }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','object','合同签署日志']
        ],
        dataTips: 'object',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['name','String','操作人'],
            ['dataTips','String','联系方式'],
            ['dataTips','String','操作时间'],
            ['type','String','操作类型（0查看 1签署 2打印 3下载 4拒签）']
        ],
        jsonStr: 'signReqVOS',
        thead4: ['参数','必须','类型','说明','备注'],
        tbody4: [
            ['compactFileCode','是','String','合同文件编码',''],
            ['compactId','是','String','合同文件ID',''],
            ['foggy','是','Boolean','是否雾化',''],
            ['grey','是','Boolean','是否脱密',''],
            ['originalFileName','是','String','原文件名称',''],
            ['pageSize','否','String','骑缝签时每枚章的覆盖页数',''],
            ['sealCode','是','String','章模编码',''],
            ['signName','是','String','签署人名称',''],
            ['signType','是','String','位置类型','(01:印章；02:签名；03:日期)'],
            ['signatoryId','是','String','签署人Id',''],
            ['signatureCoordinateX','是','number','签署坐标X轴',''],
            ['signatureCoordinateY','是','number','签署坐标Y轴',''],
            ['signatureEndPage','是','Integer','签署结束页数',''],
            ['signatureMethod','是','String','签章方式','01：单页签章；02：多页签章；03：骑缝签章；04:连页签章'],
            ['signatureStartPage','是','String','签署开始页数',''],
        ],
        title7: 'ukeySignReqVOS',
        thead7: ['参数','必须','类型','说明','备注'],
        tbody7: [
            ['fileCode','是','String','签章文件编码',''],
            ['fileName','是','String','签章文件名称',''],
            ['list','是','Array','签章参数',''],
            ['ukeySignPdfBase64','是','String','Ukey签署完成的文件base64',''],
            ['userId','是','String','uKey签章的用户','']
        ],
        title8: 'list',
        thead8: ['参数','必须','类型','说明','备注'],
        tbody8: [
            ['foggy','是','Boolean','是否雾化',''],
            ['grey','是','Boolean','是否脱密',''],
            ['llx','是','number','章模中心位置x座标',''],
            ['lly','是','number','章模中心位置y座标',''],
            ['pageNum','是','Integer','开始页',''],
            ['pageNumEnd','是','Integer','结束页',''],
            ['pdfWidth','是','number','文件宽度',''],
            ['sealCode','是','String','印章编码',''],
            ['sealName','是','String','印章名称',''],
            ['urx','是','number','章模宽度',''],
            ['ury','是','number','章模高度','']
        ]
    },
    {
        title: '七、快捷签署',
        disabled: true
    },
    {
        title: '7.1关键字单页签章',
        disabled: false,
        subTitle: '7.1关键字单页签章',
        portDesTitle: '接口描述：',
        portDes: '对某文档发起快捷签署，指定某用户某一印章，并根据关键字完成单页签章（常规签章、签章雾化、签章脱密）',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/fast/singleSign',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/json  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['fileCode','是','String','签章文档编码',''],
            ['originalFileName','是','String','原文件名称',''],
            ['sealCode','是','String','章模编码',''],
            ['signatureMethod','是','String','签章方式 1：关键字签章',''],
            ['userId','是','String','用户ID',''],
            ['list','是','List','签章参数','']
        ],
        egTitle: '请求示例',
        eg: `
            {
                "fileCode": "9081e7d7-40c8-4d60-ada7-7084b4dd6851",
                "originalFileName": "测试文件",
                "signatureMethod": "1",
                "userId": "591606514456723456",
                "list": [
                    {
                        "sealCode": "44030118721368",
                        "foggy": true,
                        "grey": true,
                        "keyword": "签章",
                        "keywordIndex": "1",
                        "keywordOffsetX": "100",
                        "keywordOffsetY": "100"
                    }
                ]
            }            
        `,
        backEgTitle: '返回示例',
        backEg: `
            { "code": 0, "msg": "请求成功", "data": { "fileCode": "9081e7d7-40c8-4d60-ada7-7084b4dd6851" } }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','']
        ],
        dataTips: 'data',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['fileCode','Integer','文档编码']
        ],
        jsonStr: 'list参数',
        thead4: ['参数','必须','类型','说明','备注'],
        tbody4: [
            ['foggy','是','Boolean','雾化',''],
            ['grey','是','Boolean','脱密',''],
            ['keyword','是','String','关键字',''],
            ['keywordIndex','是','String','关键字索引号',''],
            ['keywordOffsetX','是','String','关键字x轴偏移量',''],
            ['keywordOffsetY','是','String','关键字y轴偏移量',''],
            ['sealCode','是','String','章模编码','']
        ]
    },
    {
        title: '7.2坐标单页签章',
        disabled: false,
        subTitle: '7.2坐标单页签章',
        portDesTitle: '接口描述：',
        portDes: '对某文档发起快捷签署，指定某用户某一印章，并根据关键字完成单页签章（常规签章、签章雾化、签章脱密）',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/fast/singleSign',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/json  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['fileCode','是','String','签章文档编码',''],
            ['originalFileName','是','String','原文件名称',''],
            ['sealCode','是','String','章模编码',''],
            ['signatureMethod','是','String','签章方式 1：关键字签章',''],
            ['userId','是','String','用户ID',''],
            ['list','是','List','签章参数','']
        ],
        egTitle: '请求示例',
        eg: `
            {
                "fileCode": "9081e7d7-40c8-4d60-ada7-7084b4dd6851",
                "originalFileName": "测试文件",
                "signatureMethod": "2",
                "userId": "591606514456723456",
                "list": [
                    {
                        "foggy": true,
                        "grey": true,
                        "coordinateY": "100",
                        "coordinateX": "100",
                        "sealCode": "44030118721368",
                        "pageNo": "2"
                    }
                ]
            }
        `,
        backEgTitle: '返回示例',
        backEg: `
            { "code": 0, "msg": "请求成功", "data": { "fileCode": "9081e7d7-40c8-4d60-ada7-7084b4dd6851" } }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','']
        ],
        dataTips: 'data',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['fileCode','Integer','文档编码']
        ],
        jsonStr: 'list参数',
        thead4: ['参数','必须','类型','说明','备注'],
        tbody4: [
            ['foggy','是','Boolean','雾化',''],
            ['grey','是','Boolean','脱密',''],
            ['keyword','是','String','关键字',''],
            ['keywordIndex','是','String','关键字索引号',''],
            ['keywordOffsetX','是','String','关键字x轴偏移量',''],
            ['keywordOffsetY','是','String','关键字y轴偏移量',''],
            ['sealCode','是','String','章模编码','']
        ]
    },
    {
        title: '7.3坐标多页签章',
        disabled: false,
        subTitle: '7.3坐标多页签章',
        portDesTitle: '接口描述：',
        portDes: '对某文档发起快捷签署，指定某用户某一印章，并根据坐标、签章页数范围完成多页签章（常规签章、签章雾化、签章脱密）',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/fast/singleCoordBatchSign',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/json  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['fileCode','是','String','签章文档编码',''],
            ['originalFileName','是','String','原文件名称',''],
            ['userId','是','String','用户ID',''],
            ['list','是','List','签章参数','']
        ],
        egTitle: '请求示例',
        eg: `
            {
                "fileCode": "9081e7d7-40c8-4d60-ada7-7084b4dd6851",
                "originalFileName": "测试多页",
                "userId": "591606514456723456",
                "list": [
                    {
                        "foggy": true,
                        "grey": true,
                        "coordinateY": "100",
                        "coordinateX": "100",
                        "sealCode": "44030118721368",
                        "startPageNo": "2",
                        "endPageNo": "2"
                    }
                ]
            }
        `,
        backEgTitle: '返回示例',
        backEg: `
            { "code": 0, "msg": "请求成功", "data": { "fileCode": "9081e7d7-40c8-4d60-ada7-7084b4dd6851" } }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','']
        ],
        dataTips: 'data',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['fileCode','Integer','文档编码']
        ],
        jsonStr: 'list参数',
        thead4: ['参数','必须','类型','说明','备注'],
        tbody4: [
            ['foggy','是','Boolean','雾化',''],
            ['grey','是','Boolean','脱密',''],
            ['keywordOffsetX','是','String','关键字X轴偏移量',''],
            ['keywordOffsetY','是','String','关键字Y轴偏移量',''],
            ['endPageNo','是','String','结束签章页数',''],
            ['sealCode','是','String','章模编码',''],
            ['startPageNo','是','String','起始签章页数','']
        ]
    },
    {
        title: '7.4骑缝签章',
        disabled: false,
        subTitle: '7.4骑缝签章',
        portDesTitle: '接口描述：',
        portDes: '对某文档发起快捷签署，指定某用户某一印章，完成骑缝签章（常规签章、签章雾化、签章脱密）',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/fast/singlePerforationCoordSign',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/json  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['fileCode','是','String','签章文档编码',''],
            ['originalFileName','是','String','原文件名称',''],
            ['userId','是','String','用户ID',''],
            ['list','是','List','签章参数','']
        ],
        egTitle: '请求示例',
        eg: `
            {
                "fileCode": "9081e7d7-40c8-4d60-ada7-7084b4dd6851",
                "originalFileName": "骑缝签",
                "userId": "591606514456723456",
                "list": [
                    {
                        "foggy": true,
                        "grey": true,
                        "coordinateY": "100",
                        "signatureDirection": "1",
                        "sealCode": "44030118721368",
                        "startPageNo": "2",
                        "endPageNo": "2"
                    }
                ]
            }
        `,
        backEgTitle: '返回示例',
        backEg: `
            { "code": 0, "msg": "请求成功", "data": { "fileCode": "9081e7d7-40c8-4d60-ada7-7084b4dd6851" } }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','']
        ],
        dataTips: 'data',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['fileCode','Integer','文档编码']
        ],
        jsonStr: 'list参数',
        thead4: ['参数','必须','类型','说明','备注'],
        tbody4: [
            ['foggy','是','Boolean','雾化',''],
            ['grey','是','Boolean','脱密',''],
            ['coordinateY','是','String','签章Y坐标轴',''],
            ['endPageNo','是','String','结束签章页数',''],
            ['sealCode','是','String','章模编码',''],
            ['startPageNo','是','String','起始签章页数',''],
            ['signatureDirection','是','String','签章方向0：表示左 1：表示右',''],
            ['pageSize','否','String','一个印章覆盖页面','']
        ]
    },
    {
        title: '7.5连页签章',
        disabled: false,
        subTitle: '7.5连页签章',
        portDesTitle: '接口描述：',
        portDes: '对某文档发起快捷签署，指定某用户某一印章，完成骑缝签章（常规签章、签章雾化、签章脱密）',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/fast/singlePerforationCoordHalfSign',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/json  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['fileCode','是','String','签章文档编码',''],
            ['originalFileName','是','String','原文件名称',''],
            ['userId','是','String','用户ID',''],
            ['list','是','List','签章参数','']
        ],
        egTitle: '请求示例',
        eg: `
            {
                "fileCode": "9081e7d7-40c8-4d60-ada7-7084b4dd6851",
                "originalFileName": "骑缝签",
                "userId": "591606514456723456",
                "list": [
                    {
                        "foggy": true,
                        "grey": true,
                        "coordinateY": "100",
                        "signatureDirection": "1",
                        "sealCode": "44030118721368",
                        "startPageNo": "2",
                        "endPageNo": "2"
                    }
                ]
            }
        `,
        backEgTitle: '返回示例',
        backEg: `
            { "code": 0, "msg": "请求成功", "data": { "fileCode": "9081e7d7-40c8-4d60-ada7-7084b4dd6851" } }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','']
        ],
        dataTips: 'data',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['fileCode','String','文档编码']
        ],
        jsonStr: 'list参数',
        thead4: ['参数','必须','类型','说明','备注'],
        tbody4: [
            ['foggy','是','Boolean','雾化',''],
            ['grey','是','Boolean','脱密',''],
            ['coordinateY','是','String','签章Y坐标轴',''],
            ['endPageNo','是','String','结束签章页数',''],
            ['sealCode','是','String','章模编码',''],
            ['startPageNo','是','String','起始签章页数',''],
            ['signatureDirection','是','String','签章方向0：表示左 1：表示右','']
        ]
    },
    {
        title: '八、工具包',
        disabled: true
    },
    {
        title: '8.1上传文档并转换输出PDF',
        disabled: false,
        subTitle: '8.1上传文档并转换输出PDF',
        portDesTitle: '接口描述：',
        portDes: '上传文档，并完成PDF的转换与流输出',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/document/download/uploadCovertPdf',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type:multipart/form-data | api_token: token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['file','是','MultipartFile','上传文档','']
        ],
        egTitle: '请求示例：',
        eg:`
        {
            "file": "文件.doc"
        }    
        `,
        backParams: '失败返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','msg','请求提示信息']
        ],
        backEgTitle: '返回示例：',
        backEg:`
            转换后的文件流
        `
    },
    {
        title: '8.2关键字单页签章',
        disabled: false,
        subTitle: '8.2关键字单页签章',
        portDesTitle: '接口描述：',
        portDes: '对某文档发起快捷签署，并根据关键字完成单页签章（常规签章、签章雾化、签章脱密）',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/file/fast/singleSign',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type: multipart/form-data  |  api_token: token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['signFile','否','MultipartFile','待签章文件','pdf,doc,docx(inType为0必传)'],
            ['sealFile','否','MultipartFile','章模文件','png,bmp,jpg(inType为0必传)'],
            ['certFile','否','MultipartFile','证书文件','pfx(inType为0必传)'],
            ['jsonStr','是','String','签章相关信息','']
        ],
        egTitle: '请求示例：',
        eg:`
        {
            "signFile": (待签章文档)
            "sealFile": (章模文件)
            "certFile": (证书文件)
            "jsonStr":{
            "certFileName": "demo.pfx",   
            "certPassword": "12345678",
            "keywordIndex": "1",
            "userId": "1",
            "keyword": "订单列表",
            "keywordOffsetX": "100",
            "keywordOffsetY": "100",
            "foggy": true,
            "grey": true,
            "sealType":"01",
            "mediumType":"01",
            "inType": 0,
            "originalFileName": "demo.pdf",
            "outType": 0,
            "sealFileName": "seal.bmp",
            "signatureMethod": "1",
        }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','']
        ],
        dataTips: 'data',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['fileCode','String','文档编码']
        ],
        jsonStr: 'jsonStr参数说明',
        thead4: ['参数','必须','类型','说明','备注'],
        tbody4: [
            ['signatureFileStr','否','String','签章BASE64源文件','PDF文件的base64(inType为1必传)'],
            ['sealBase64Str','否','String','章模BASE64源文件','inType为1必传'],
            ['certBase64Str','否','String','证书BASE64源文件','inType为1必传'],
            ['certPassword','是','String','证书密钥',''],
            ['userId','是','String','签章用户标识',''],
            ['foggy','是','Boolena','雾化',''],
            ['grey','是','Boolean','脱密',''],
            ['inType','否','Integer','入参文件类型设置',' 0文件,1 base64(默认为0)'],
            ['outType','否','Integer','出参文件类型设置',' 0文件code,1 base64(默认为0)'],
            ['sealType','是','String','印章类型','01 行政章、02 财务章等 03 业务专用章 04 法定代表人名章 05 报关专用章 06 合同专用章 07 其他公章 08 电子杂章： 09 电子私章'],
            ['mediumType','是','String','介质类型','01 云印章  02ukey印章'],
            ['keyword','是','String','关键字',''],
            ['keywordIndex','是','String','关键字索引号',''],
            ['keywordOffsetX','是','String','关键字x轴偏移量',''],
            ['keywordOffsetY','是','String','关键字y轴偏移量',''],
            ['originalFileName','否','String','原文件名称','原文件名必须有后缀,inType为1必传'],
            ['sealFileName','否','String','章模原文件名称','原文件名必须有后缀,inType为1必传'],
            ['certFileName','否','String','证书原文件名称','原文件名必须有后缀,inType为1必传'],
            ['signatureMethod','是','String','签章方式 1：关键字签章','']
        ],
        backEgTitle: '返回示例：',
        backEg:`
            { "code": 0, "msg": "请求成功", "data": { "fileCode": "9081e7d7-40c8-4d60-ada7-7084b4dd6851" } }
        `
    },
    {
        title: '8.3坐标单页签章',
        disabled: false,
        subTitle: '8.3坐标单页签章',
        portDesTitle: '接口描述：',
        portDes: '对某文档发起快捷签署，并根据关键字完成单页签章（常规签章、签章雾化、签章脱密）',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/file/fast/singleSign',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type: multipart/form-data  |  api_token: token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['signFile','否','MultipartFile','待签章文件','pdf,doc,docx(inType为0必传)'],
            ['sealFile','否','MultipartFile','章模文件','png,bmp,jpg(inType为0必传)'],
            ['certFile','否','MultipartFile','证书文件','pfx(inType为0必传)'],
            ['jsonStr','是','String','签章相关信息','']
        ],
        jsonStr: 'jsonStr参数说明',
        thead4: ['参数','必须','类型','说明','备注'],
        tbody4: [
            ['signatureFileStr','否','String','签章BASE64源文件','PDF文件的base64(inType为1必传)'],
            ['sealBase64Str','否','String','章模BASE64源文件','inType为1必传'],
            ['certBase64Str','否','String','证书BASE64源文件','inType为1必传'],
            ['certPassword','是','String','证书密钥',''],
            ['userId','是','String','签章用户标识',''],
            ['foggy','是','Boolena','雾化',''],
            ['grey','是','Boolean','脱密',''],
            ['inType','否','Integer','入参文件类型设置',' 0文件,1 base64(默认为0)'],
            ['outType','否','Integer','出参文件类型设置',' 0文件code,1 base64(默认为0)'],
            ['sealType','是','String','印章类型','01 行政章、02 财务章等 03 业务专用章 04 法定代表人名章 05 报关专用章 06 合同专用章 07 其他公章 08 电子杂章： 09 电子私章'],
            ['mediumType','是','String','介质类型','01 云印章  02ukey印章'],
            ['coordinateX','是','String','签章X坐标轴',''],
            ['coordinateY','是','String','签章Y坐标轴',''],
            ['pageNo','是','String','签章页数',''],
            ['originalFileName','否','String','原文件名称','原文件名必须有后缀,inType为1必传'],
            ['sealFileName','否','String','章模原文件名称','原文件名必须有后缀,inType为1必传'],
            ['certFileName','否','String','证书原文件名称','原文件名必须有后缀,inType为1必传'],
            ['signatureMethod','是','String','签章方式 2：坐标签章','']
        ],
        egTitle: '请求示例：',
        eg:`
            {
                "signFile": (待签章文档)
                "sealFile": (章模文件)
                "certFile": (证书文件)
                "jsonStr":{
                "certFileName": "demo.pfx",
                "certPassword": "12345678",
                "userId": "1",
                "coordinateX": "100",
                "coordinateY": "100",
                "foggy": true,
                "grey": true,
                "sealType":"01",
                "mediumType":"01",
                "inType": 0,
                "originalFileName": "demo.pdf",
                "outType": 0,
                "pageNo": "1",
                "sealFileName": "seal.bmp",
                "signatureMethod": "2",
                }
            }
            `,
        backEgTitle: '返回示例：',
        backEg: `
            { "code": 0, "msg": "请求成功", "data": { "fileCode": "9081e7d7-40c8-4d60-ada7-7084b4dd6851" } }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','']
        ],
        dataTips: 'data',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['fileCode','String','文档编码']
        ]
    },
    {
        title: '8.4坐标多页签章',
        disabled: false,
        subTitle: '8.4坐标多页签章',
        portDesTitle: '接口描述：',
        portDes: '对某文档发起快捷签署，并根据坐标、签章页数范围完成多页签章（常规签章、签章雾化、签章脱密）',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/file/fast/singleCoordBatchSign',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type: multipart/form-data  |  api_token: token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['signFile','否','MultipartFile','待签章文件','pdf,doc,docx(inType为0必传)'],
            ['sealFile','否','MultipartFile','章模文件','png,bmp,jpg(inType为0必传)'],
            ['certFile','否','MultipartFile','证书文件','pfx(inType为0必传)'],
            ['jsonStr','是','String','签章相关信息','']
        ],
        jsonStr: 'jsonStr参数说明',
        thead4: ['参数','必须','类型','说明','备注'],
        tbody4: [
            ['signatureFileStr','否','String','签章BASE64源文件','PDF文件的base64(inType为1必传)'],
            ['sealBase64Str','否','String','章模BASE64源文件','inType为1必传'],
            ['certBase64Str','否','String','证书BASE64源文件','inType为1必传'],
            ['certPassword','是','String','证书密钥',''],
            ['userId','是','String','签章用户标识',''],
            ['foggy','是','Boolena','雾化',''],
            ['grey','是','Boolean','脱密',''],
            ['inType','否','Integer','入参文件类型设置',' 0文件,1 base64(默认为0)'],
            ['outType','否','Integer','出参文件类型设置',' 0文件code,1 base64(默认为0)'],
            ['sealType','是','String','印章类型','01 行政章、02 财务章等 03 业务专用章 04 法定代表人名章 05 报关专用章 06 合同专用章 07 其他公章 08 电子杂章： 09 电子私章'],
            ['mediumType','是','String','介质类型','01 云印章  02ukey印章'],
            ['coordinateX','是','String','签章X坐标轴',''],
            ['coordinateY','是','String','签章Y坐标轴',''],
            ['startPageNo','是','String','起始签章页数',''],
            ['endPageNo','是','String','结束签章页数',''],
            ['originalFileName','否','String','原文件名称','原文件名必须有后缀,inType为1必传'],
            ['sealFileName','否','String','章模原文件名称','原文件名必须有后缀,inType为1必传'],
            ['certFileName','否','String','证书原文件名称','原文件名必须有后缀,inType为1必传']
        ],
        egTitle: '请求示例：',
        eg:`
        {
            "signFile": (待签章文档)
            "sealFile": (章模文件)
            "certFile": (证书文件)
            "jsonStr":{
                "certFileName": "demo.pfx",
                "certPassword": "12345678",
                "userId": "1",
                "coordinateX": "100",
                "coordinateY": "100",
                "foggy": true,
                "grey": true,
                "sealType":"01",
                "mediumType":"01",
                "inType": 0,
                "originalFileName": "demo.pdf",
                "outType": 0,
                "startPageNo": "1",
                "endPageNo": "2",
                "sealFileName": "seal.bmp"
            }
        } 
        `,
        backEgTitle: '返回示例：',
        backEg: `
            { "code": 0, "msg": "请求成功", "data": { "fileCode": "9081e7d7-40c8-4d60-ada7-7084b4dd6851" } }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','']
        ],
        dataTips: 'data',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['fileCode','String','文档编码']
        ]

    },
    {
        title: '8.5骑缝签章',
        disabled: false,
        subTitle: '8.5骑缝签章',
        portDesTitle: '接口描述：',
        portDes: '对某文档发起快捷签署，完成骑缝签章（常规签章、签章雾化、签章脱密）',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/file/fast/singlePerforationCoordSign',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type: multipart/form-data  |  api_token: token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody:[
            ['signFile','否','MultipartFile','待签章文件','pdf,doc,docx(inType为0必传)'],
            ['sealFile','否','MultipartFile','章模文件','png,bmp,jpg(inType为0必传)'],
            ['certFile','否','MultipartFile','证书文件','pfx(inType为0必传)'],
            ['jsonStr','是','String','签章相关信息','']
        ],
        jsonStr: 'jsonStr参数说明',
        thead4: ['参数','必须','类型','说明','备注'],
        tbody4: [
            ['signatureFileStr','否','String','签章BASE64源文件','PDF文件的base64(inType为1必传)'],
            ['sealBase64Str','否','String','章模BASE64源文件','inType为1必传'],
            ['certBase64Str','否','String','证书BASE64源文件','inType为1必传'],
            ['certPassword','是','String','证书密钥',''],
            ['userId','是','String','签章用户标识',''],
            ['foggy','是','Boolena','雾化',''],
            ['grey','是','Boolean','脱密',''],
            ['inType','否','Integer','入参文件类型设置',' 0文件,1 base64(默认为0)'],
            ['outType','否','Integer','出参文件类型设置',' 0文件code,1 base64(默认为0)'],
            ['sealType','是','String','印章类型','01 行政章、02 财务章等 03 业务专用章 04 法定代表人名章 05 报关专用章 06 合同专用章 07 其他公章 08 电子杂章： 09 电子私章'],
            ['mediumType','是','String','介质类型','01 云印章  02ukey印章'],
            ['coordinateY','是','String','签章Y坐标轴',''],
            ['signatureDirection','是','String','签章方向0：表示左 1:表示右',''],
            ['startPageNo','是','String','起始签章页数',''],
            ['endPageNo','是','String','结束签章页数',''],
            ['originalFileName','否','String','原文件名称','原文件名必须有后缀,inType为1必传'],
            ['sealFileName','否','String','章模原文件名称','原文件名必须有后缀,inType为1必传'],
            ['certFileName','否','String','证书原文件名称','原文件名必须有后缀,inType为1必传']
        ],
        egTitle: '请求示例：',
        eg:`
        {
            "signFile": (待签章文档)
            "sealFile": (章模文件)
            "certFile": (证书文件)
            "jsonStr":{
                "certFileName": "demo.pfx",
                "certPassword": "12345678",
                "userId": "1",
                "signatureDirection": "0",
                "coordinateY": "100",
                "foggy": true,
                "grey": true,
                "sealType":"01",
                "mediumType":"01",
                "inType": 0,
                "originalFileName": "demo.pdf",
                "outType": 0,
                "startPageNo": "1",
                "endPageNo": "2",
                "sealFileName": "seal.bmp"
                }
            }
        `,
        backEgTitle: '返回示例：',
        backEg: `
            { "code": 0, "msg": "请求成功", "data": { "fileCode": "9081e7d7-40c8-4d60-ada7-7084b4dd6851" } }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','']
        ],
        dataTips: 'data',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['fileCode','String','文档编码']
        ]
    },
    {
        title: '8.6连页签章',
        disabled: false,
        subTitle: '8.6连页签章',
        portDesTitle: '接口描述：',
        portDes: '对某文档发起快捷签署，完成连页签章（常规签章、签章雾化、签章脱密）',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/file/fast/singlePerforationCoordHalfSign',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type: multipart/form-data  |  api_token: token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody:[
            ['signFile','否','MultipartFile','待签章文件','pdf,doc,docx(inType为0必传)'],
            ['sealFile','否','MultipartFile','章模文件','png,bmp,jpg(inType为0必传)'],
            ['certFile','否','MultipartFile','证书文件','pfx(inType为0必传)'],
            ['jsonStr','是','String','签章相关信息','']
        ],
        jsonStr: 'jsonStr参数说明',
        thead4: ['参数','必须','类型','说明','备注'],
        tbody4: [
            ['signatureFileStr','否','String','签章BASE64源文件','PDF文件的base64(inType为1必传)'],
            ['sealBase64Str','否','String','章模BASE64源文件','inType为1必传'],
            ['certBase64Str','否','String','证书BASE64源文件','inType为1必传'],
            ['certPassword','是','String','证书密钥',''],
            ['userId','是','String','签章用户标识',''],
            ['foggy','是','Boolena','雾化',''],
            ['grey','是','Boolean','脱密',''],
            ['inType','否','Integer','入参文件类型设置',' 0文件,1 base64(默认为0)'],
            ['outType','否','Integer','出参文件类型设置',' 0文件code,1 base64(默认为0)'],
            ['sealType','是','String','印章类型','01 行政章、02 财务章等 03 业务专用章 04 法定代表人名章 05 报关专用章 06 合同专用章 07 其他公章 08 电子杂章： 09 电子私章'],
            ['mediumType','是','String','介质类型','01 云印章  02ukey印章'],
            ['coordinateY','是','String','签章Y坐标轴',''],
            ['signatureDirection','是','String','签章方向0：表示左 1:表示右',''],
            ['startPageNo','是','String','起始签章页数',''],
            ['endPageNo','是','String','结束签章页数',''],
            ['originalFileName','否','String','原文件名称','原文件名必须有后缀,inType为1必传'],
            ['sealFileName','否','String','章模原文件名称','原文件名必须有后缀,inType为1必传'],
            ['certFileName','否','String','证书原文件名称','原文件名必须有后缀,inType为1必传']
        ],
        egTitle: '请求示例：',
        eg: `
        {
            "signFile": (待签章文档)
             "sealFile": (章模文件)
             "certFile": (证书文件)
            "jsonStr":{
              "certFileName": "demo.pfx",
              "certPassword": "12345678",
              "userId": "1",
              "signatureDirection": "0",
              "coordinateY": "100",
              "foggy": true,
              "grey": true,
              "sealType":"01",
              "mediumType":"01",
              "inType": 0,
              "originalFileName": "demo.pdf",
              "outType": 0,
               "startPageNo": "1",
              "endPageNo": "2",
              "sealFileName": "seal.bmp"
            }
        }
        `,
        backEgTitle: '返回示例：',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": {
                    "fileCode": "9081e7d7-40c8-4d60-ada7-7084b4dd6851"
                }
            }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','']
        ],
        dataTips: 'data',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['fileCode','String','文档编码']
        ]
    },
    {
        title: '8.7预盖章',
        disabled: false,
        subTitle: '8.7预盖章',
        portDesTitle: '接口描述：',
        portDes: '对某文档进行预盖章检测，判断是否有提前设置预盖章位置',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/file/signDomain',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/json  |  api_token: token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['fileCode','是','String','Pdf文件编码','']
        ],
        egTitle: '请求示例：',
        eg:`
            http://ip:port/file/signDomain?fileCode=123123
        `,
        backEgTitle: '返回示例：',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": [
                    {
                        "signatoryId": "1",
                        "signName": "admin",
                        "compactFileCode": "6c6daa98-ed7f-483e-ac1f-7d0c1993baea",
                        "signatureMethod": "01",
                        "signatureStartPage": 1,
                        "signatureEndPage": null,
                        "signatureCoordinateX": 252.125,
                        "signatureCoordinateY": 245
                    }
                ]
            } 
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Array','预盖章位置']
        ],
        jsonStr: 'Array',
        thead4: ['参数','类型','说明'],
        tbody4: [
            ['signatoryId','String','签署人id'],
            ['signName','String','签署人'],
            ['compactFileCode','String','合同文件编码'],
            ['signatureMethod','String','签章方式(01：单页签章；02：多页签章；03：骑缝签章；)'],
            ['signatureStartPage','integer','签署开始页数'],
            ['signatureEndPage','integer','签署结束页数'],
            ['signatureCoordinateX','number','签署坐标X轴'],
            ['signatureCoordinateY','number','签署坐标Y轴']
        ]
    },
    {
        title: '九、单位管理',
        disabled: true
    },
    {
        title: '9.1.1输入单位名称、统一社会信用代码、法人名称、自定义字段',
        disabled: false,
        subTitle: '9.1.1输入单位名称、统一社会信用代码、法人名称、自定义字段',
        portDesTitle: '接口描述：',
        portDes: '创建单位第一步，录入单位信息，服务器进行参数效验',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/enterprise/create/step/one',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['chineseName','是','String','单位名称','如：深圳市安印科技有效公司'],
            ['creditCode','是','String','企业信用代码',''],
            ['legalName','是','String','法人名称',''],
            ['extDefine','否','String','自定义字段',''],
        ],
        egTitle: '请求示例：',
        eg:`
            {
                "chineseName": "深圳市安印科技有限公司",
                "creditCode": "421083198805414267",
                "extDefine": "待定",
                "legalName": "杨瑞芳"
            }            
        `,
        backEgTitle: '返回示例：',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": "597822820864491520"
            }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','单位ID']
        ],
        errCode: 'code错误码',
        thead5: ['值','说明'],
        tbody5: [
            ['1019','单位名称已被注册请更换'],
            ['1020','企业信用代码已被注册请更换']
        ]
    },
    {
        title: '9.1.2创建单位下的账户信息',
        disabled: false,
        subTitle: '9.1.2创建单位下的账户信息',
        portDesTitle: '接口描述：',
        portDes: '创建单位第二步，创建账户信息',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/enterprise/create/step/two',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['enterpriseId','是','String','单位ID','如：421083198805414267'],
            ['userName','是','String','用户名',''],
            ['userNameType','是','String','用户名类型','01 手机号 02 邮箱'],
            ['password','是','String','密码','']
        ],
        egTitle: '请求示例：',
        eg:`
            {
                "enterpriseId": "421083198805414267",
                "password": "a123456",
                "userName": "张三",
                "userNameType": "01"
            }
        `,
        backEgTitle: '返回示例：',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": true
            }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Boolean','成功与否'],
        ],
        errCode: 'code错误码',
        thead5: ['值','说明'],
        tbody5: [
            ['1000','请求参数有误'],
            ['1023','手机号不合法'],
            ['1024','邮箱不合法']
        ]
    },
    {
        title: '9.2修改单位信息',
        disabled: false,
        subTitle: '9.2修改单位信息',
        portDesTitle: '接口描述：',
        portDes: '修改单位名称、法人、信用',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/file/signDomain',
        portLink: 'http://ip:port//enterprise/updateEnterprise',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['chineseName','是','String','单位名称','如：深圳市安印科技有效公司'],
            ['creditCode','是','String','企业信用代码',''],
            ['legalName','是','String','法人名称',''],
            ['extDefine','否','String','自定义字段',''],
            ['enterpriseId','是','String','企业主键ID','']
        ],
        egTitle: '请求示例：',
        eg:`
            {
                "chineseName": "深圳市安印科技有限公司",
                "creditCode": "421083198805414267",
                "extDefine": "待定",
                "legalName": "杨瑞芳"
                "enterpriseId": "47989877899"
            }
        `,
        backEgTitle: '返回示例：',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": "true"
            }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','boolean','成功与否']
        ],
        errCode: 'code错误码',
        thead5: ['值','说明'],
        tbody5: [
            ['1019','单位名称已被注册请更换'],
            ['1020','企业信用代码已被注册请更换'],
            ['1000','请求参数有误'],
            ['1029','更新单位信息失败']
        ]
    },
    {
        title: '9.3查询单位详细信息',
        disabled: false,
        subTitle: '9.3查询单位详细信息',
        portDesTitle: '接口描述：',
        portDes: '修改单位名称、法人、信用',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port//enterprise/getEnterpriseDetail/{id}',
        methodTitle: '请求方式：',
        method: 'get',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['id','是','String','单位ID','']
        ],
        egTitle: '请求示例：',
        eg:`
            http://ip:port// enterprise/ getEnterpriseDetail/458789789
        `,
        backEgTitle: '返回示例：',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": {
                    "id": "591635506115117056",
                    "chineseName": "深圳安印科技",
                    "creditCode": "421083198805414267",
                    "organizationCode": null,
                    "gmtCreate": "2019-06-20 14:28:18",
                    "gmtModified": "2019-07-04 14:33:51",
                    "isDeleted": 0,
                    "extDefine": "深圳市南山区深南大道",
                    "remark": "的范德萨发",
                    "legalName": "杨瑞芳"
                }
            }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','object','数据对象'],
            ['id','String','单位ID'],
            ['chineseName','String','单位名称'],
            ['creditCode','String','企业信用代码'],
            ['gmtCreate','Date','创建时间'],
            ['isDeleted','int','0:正常 1:禁用'],
            ['extDefine','String','自定义字段'],
            ['remark','String','备注'],
            ['legalName','String','法人名称']
        ]
    },
    {
        title: '9.4查询单位签署日志',
        disabled: false,
        subTitle: '9.4查询单位签署日志',
        portDesTitle: '接口描述：',
        portDes: '根据单位ID查询签章日志',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/enterprise/pageListSignLog',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['currentPage','是','Int','当前页',''],
            ['enterpriseId','是','String','单位ID',''],
            ['fileName','否','String','文件名','如果fileName不为空，则根据文件名过滤查询'],
            ['pageSize','是','String','每页显示的条数',''],
            ['sealCode','否','String','企业主键ID','如果sealCode不为空，则根据印章编码过滤查询']
        ],
        egTitle: '请求示例：',
        eg:`
            {
                "currentPage": 1,
                "enterpriseId": "591635506115117056",
                "fileName": "",
                "pageSize": 10,
                "sealCode": ""
            }
        `,
        backEgTitle: '返回示例：',
        backEg: `
        {
            "code": 0,
            "msg": "请求成功",
            "data": {
            "records": [
                {
                    "logId": "46",
                    "userNickName": "13798374338",
                    "fileName": "测试.doc",
                    "sealName": "测试",
                    "sealBusinessType": "03",
                    "sealCode": "44030109287749",
                    "mediumType": "03",
                    "signFileHash": null,
                    "createDate": "2019-07-08 15:01"
                },
                {
                    "logId": "49",
                    "userNickName": "13798374338",
                    "fileName": "测试.doc",
                    "sealName": "测试",
                    "sealBusinessType": "03",
                    "sealCode": "44030109287749",
                    "mediumType": "03",
                    "signFileHash": null,
                    "createDate": "2019-07-08 15:16"
                },
                {
                    "logId": "51",
                    "userNickName": "13798374338",
                    "fileName": "测试.doc",
                    "sealName": "测试",
                    "sealBusinessType": "03",
                    "sealCode": "44030109287749",
                    "mediumType": "03",
                    "signFileHash": null,
                    "createDate": "2019-07-08 15:46"
                }
            ],
            "total": 8,
            "size": 10,
            "current": 1,
            "ascs": null,
            "descs": null,
            "optimizeCountSql": true,
            "pages": 1
            }
        }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Object','数据结构体'],
        ],
        jsonStr: 'data中records的对象信息',
        thead4: ['参数','类型','说明'],
        tbody4: [
            ['logId','String','日志ID'],
            ['userNickName','String','用户昵称'],
            ['fileName','Object','文件名称'],
            ['sealName','array','印章名称'],
            ['sealBusinessType','String','印章业务类型'],
            ['sealCode','String','印章编码'],
            ['mediumType','String','介质类型 01：云印章 02：ukey印章'],
            ['signFileHash','String','签署文件HASH值'],
            ['createDate','date','签署日期 格式：2019-07-01 12:14'],
        ]
    },
    {
        title: '9.5查询单位下某用户签署日志',
        disabled: false,
        subTitle: '9.5查询单位下某用户签署日志',
        portDesTitle: '接口描述：',
        portDes: '根据用户ID查询签章日志',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/enterprise/userPageListSignLog',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['currentPage','是','Int','当前页',''],
            ['userId','是','String','用户ID',''],
            ['fileName','否','String','文件名','如果fileName不为空，则根据文件名过滤查询'],
            ['pageSize','是','String','每页显示的条数',''],
            ['sealCode','否','String','企业主键ID','如果sealCode不为空，则根据印章编码过滤查询']
        ],
        egTitle: '请求示例：',
        eg:`
            {
                "currentPage": 1,
                "userId": "591635506115117056",
                "fileName": "",
                "pageSize": 10,
                "sealCode": ""
            }
        `,
        backEgTitle: '返回示例：',
        backEg: `
        {
            "code": 0,
            "msg": "请求成功",
            "data": {
            "records": [
            {
                "logId": "49",
                "userNickName": "13798374338",
                "fileName": "测试.doc",
                "sealName": "测试",
                "sealBusinessType": "03",
                "sealCode": "44030109287749",
                "mediumType": "03",
                "signFileHash": null,
                "createDate": "2019-07-08 15:16"
            },
            {
                "logId": "50",
                "userNickName": "13798374338",
                "fileName": "测试.doc",
                "sealName": "测试",
                "sealBusinessType": "03",
                "sealCode": "44030109287749",
                "mediumType": "03",
                "signFileHash": null,
                "createDate": "2019-07-08 15:43"
            },
            {
                "logId": "51",
                "userNickName": "13798374338",
                "fileName": "测试.doc",
                "sealName": "测试",
                "sealBusinessType": "03",
                "sealCode": "44030109287749",
                "mediumType": "03",
                "signFileHash": null,
                "createDate": "2019-07-08 15:46"
            }
            ],
                "total": 8,
                "size": 10,
                "current": 1,
                "ascs": null,
                "descs": null,
                "optimizeCountSql": true,
                "pages": 1
            }
        }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Object','成功与否']
        ],
        dataTips: 'data中records的对象信息',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['logId','String','日志ID'],
            ['userNickName','String','用户昵称'],
            ['fileName','Object','文件名称'],
            ['sealName','array','印章名称'],
            ['sealBusinessType','String','印章业务类型'],
            ['sealCode','String','印章编码'],
            ['mediumType','String','介质类型 01：云印章 02：ukey印章'],
            ['signFileHash','String','签署文件HASH值'],
            ['createDate','date','签署日期 格式：2019-07-01 12:14'],
        ]
    },
    {
        title: '9.6查询单位列表',
        disabled: false,
        subTitle: '9.6查询单位列表',
        portDesTitle: '接口描述：',
        portDes: '分页查询单位列表',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/enterprise/pageListEnterprise',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type: application/json',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['currentPage','是','Int','当前页',''],
            ['chineseName','是','String','单位名称',''],
            ['isDeleted','是','String','是否禁用','0：正常 1：禁用'],
            ['pageSize','是','String','每页显示的条数','']
        ],
        egTitle: '请求示例：',
        eg:`
            {
                "chineseName": "安印",
                "currentPage": 1,
                "isDeleted": "",
                "pageSize": 10
            }
        `,
        backEgTitle: '返回示例：',
        backEg: `
        {
            "code": 0,
            "msg": "请求成功",
            "data": {
            "records": [
                {
                    "id": "591635506115117056",
                    "chineseName": "深圳安印科技",
                    "creditCode": "421083198805414267",
                    "organizationCode": null,
                    "gmtCreate": "2019-06-20 14:28:18",
                    "gmtModified": "2019-07-04 14:33:51",
                    "isDeleted": 0,
                    "extDefine": "深圳市南山区深南大道",
                    "remark": null,
                    "legalName": null
                }
            ],
                "total": 1,
                "size": 10,
                "current": 1,
                "ascs": null,
                "descs": null,
                "optimizeCountSql": true,
                "pages": 1
            }
        }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Object','返回的结果对象'],
            ['records','array','分页数据']
        ],
        dataTips: 'records中对象信息',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['id','String','单位ID'],
            ['chineseName','String','单位名称'],
            ['creditCode','String','企业信用代码'],
            ['organizationCode','String','组织机构代码'],
            ['gmtCreate','Date','创建时间'],
            ['gmtModified','Date','修改时间'],
            ['isDeleted','String','0 正常 1 禁用'],
            ['extDefine','String','自定义字段'],
            ['remark','String','备注'],
            ['legalName','String','法人名称']
        ]
    },
    {
        title: '十、印章接口',
        disabled: true
    },
    // {
    //     title: '8.1为某单位上传印章',
    //     disabled: false
    // },
    {
        title: '10.1.1上传云印章保存临时章模',
        disabled: false,
        subTitle: '10.1.1上传云印章保存临时章模',
        portDesTitle: '接口描述：',
        portDes: '第一步先上传章模图片',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/seal/defined/file',
        methodTitle: '请求方式：',
        method: 'get',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['width','否','String','设置印章宽',''],
            ['height','否','String','设置印章高',''],
            ['file','是','MutilFile','上传的章模文件',''],
        ],
        egTitle: '请求示例：',
        eg: `
            http://192.168.51.218:6335/seal/defined/file?width=40&height=40	
        `,
        backEgTitle: '返回示例：',
        backEg: `
        {
            "code": 0,
            "msg": "请求成功",
            "data": {
                "pictureWidth": 39,
                "pictureHeight": 39,
                "picturePath": "http://192.168.51.218:6065/group2/M00/0A/0C/wKgz5l0jMv-AfisXAAQSPrYlPAU439.png",
                "pictureDataTmpId": "597882008307236864"
              }
            }            
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码,对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Object','返回数据体'],
            ['pictureWidth','String','印章宽'],
            ['pictureHeight','String','印章高'],
            ['picturePath','String','Fastdfs返回的章模路径'],
            ['pictureDataTmpId','String','章模上传后生产的临时ID']
        ]
    },
    {
        title: '10.1.2设置章模名称、宽高提交保存章模信息',
        disabled: false,
        subTitle: '10.1.2设置章模名称、宽高提交保存章模信息',
        portDesTitle: '接口描述：',
        portDes: '第二步 基于第一步产生的临时数据，进行章模数据的保存提交',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/ seal/save',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['certificateId','否','String','证书ID','当certificateSource=01时不能为空'],
            ['certificateSource','是','String','证书来源','01 单位证书库关联  02 在线软证书 03 本地生成证书'],
            ['enterpriseOrPersonalId','是','String','企业表或个人表主键ID',''],
            ['pictureBusinessType','是','String','印章业务类型','01 行政章、02 财务章等 个人： 03 电子私章'],
            ['pictureDataTmpId','是','String','上传章模图片时返回的章模临时表主键ID',''],
            ['pictureHeight','是','String','设置章模高',''],
            ['pictureWidth','是','String','设置章模宽',''],
            ['pictureName','是','String','章模名称',''],
            ['picturePath','是','String','上传章模时返回的章模图片路径',''],
            ['pictureUserType','是','String','章模所属的用户类型','01 单位用户 02 个人用户']
        ],
        egTitle: '请求示例：',
        eg:`
            {
                "certificateId": "",
                "certificateSource": "02",
                "createMode": 0,
                "enterpriseOrPersonalId": "591635506115117056",
                "pictureBusinessType": "01",
                "pictureDataTmpId": "597832264662908928",
                "pictureHeight": "40",
                "pictureName": "cesss",
                "picturePath": "http://192.168.51.218:6065/group2/M00/0A/0C/wKgz5l0jBKuAZRhPAAQYIWygT1I105.png",
                "pictureUserType": "01",
                "pictureWidth": "40"
            }
        `,
        backEgTitle: '返回示例',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": true
            }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Boolean','成功与否']
        ]
    },
    {
        title: '10.2查询某单位下的印章',
        disabled: false,
        subTitle: '10.2查询某单位下的印章',
        portDesTitle: '接口描述：',
        portDes: '根据单位ID分页查询单位下的印章信息',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/seal/pageListSealInfo',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['currentPage','是','String','当前页',''],
            ['enterpriseOrPersonalId','是','String','企业或个人ID',''],
            ['pageSize','是','String','每页显示条数','']
        ],
        egTitle: '请求示例：',
        eg: `
            {
                "currentPage": 1,
                "enterpriseOrPersonalId": "591635506115117056",
                "pageSize": 10
            }
            
        `,
        backEgTitle: '返回示例',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": {
                "records": [
                    {
                        "id": "597832901689606144",
                        "pictureCode": "44030133347652",
                        "pictureName": "cesss",
                        "pictureBusinessType": "01",
                        "pictureWidth": "40",
                        "pictureHeight": "40",
                        "certificateSource": "02",
                        "certificateId": null,
                        "pictureUserType": "01",
                        "enterpriseOrPersonalId": "591635506115117056",
                        "picturePath": "http://192.168.51.218:6065/group2/M00/0A/0C/wKgz5l0jBKuAZRhPAAQYIWygT1I105.png",
                        "gmtCreate": "2019-07-08 16:54:31",
                        "isDeleted": 0,
                        "pictureStatus": "01",
                        "mediumType": "01"
                    },
                    {
                        "id": "597754155129372672",
                        "pictureCode": "44030109287749",
                        "pictureName": "测试",
                        "pictureBusinessType": "03",
                        "pictureWidth": "99",
                        "pictureHeight": "99",
                        "certificateSource": "01",
                        "certificateId": "12",
                        "pictureUserType": "01",
                        "enterpriseOrPersonalId": "591635506115117056",
                        "picturePath": "http://192.168.51.218:6065/group2/M00/09/A7/wKgz5l0iuJCAMWsAAA3tXhFDp38687.png",
                        "gmtCreate": "2019-07-08 11:41:36",
                        "isDeleted": 0,
                        "pictureStatus": "01",
                        "mediumType": "01"
                    },
                    {
                        "id": "597753926577553408",
                        "pictureCode": "44030178812900",
                        "pictureName": "陆文雄的章",
                        "pictureBusinessType": "01",
                        "pictureWidth": "44",
                        "pictureHeight": "40",
                        "certificateSource": "02",
                        "certificateId": null,
                        "pictureUserType": "01",
                        "enterpriseOrPersonalId": "591635506115117056",
                        "picturePath": "http://192.168.51.218:6065/gro",
                        "gmtCreate": "2019-07-08 11:40:43",
                        "isDeleted": 0,
                        "pictureStatus": "01",
                        "mediumType": "01"
                    }
                    ],
                    "total": 3,
                    "size": 10,
                    "current": 1,
                    "ascs": null,
                    "descs": null,
                    "optimizeCountSql": true,
                    "pages": 1
                }
            }            
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Object','返回数据体'],
            ['records','Array','分页数据']
        ],
        jsonStr: 'records中单个对象参数',
        thead4: ['参数','类型','说明'],
        tbody4: [
            ['id','String','印章主键id'],
            ['pictureCode','String','印章编码'],
            ['pictureName','String','印章名称'],
            ['pictureBusinessType','String','印章业务类型  01 行政章 02 财务章 03 电子私章'],
            ['pictureWidth','String','印章宽'],
            ['pictureHeight','String','印章高'],
            ['certificateSource','String','证书来源  01 单位证书库关联  02 在线软证书 03 本地生成证书'],
            ['certificateId','String','证书ID, 当certificateSource=01时，不能为空'],
            ['pictureUserType','String','印章用户类型 01 单位用户 02 个人用户 '],
            ['enterpriseOrPersonalId','String','单位或个人表主键ID'],
            ['picturePath','String','章模图片路径 如：http://192.168.51.218:6065/group/1.png'],
            ['gmtCreate','Date','创建时间 如：2019-07-08 11:40:43'],
            ['isDeleted','String','是否有效 01：有效 02 已删除或禁用'],
            ['pictureStatus','String','印章状态 01：正常'],
            ['mediumType','String','介质类型 01 云印章 02 ukey印章']
        ],
        errCode: 'code错误码',
        thead5: ['值','说明'],
        tbody5: [
            ['1000','请求参数有误']
        ]
    },
    {
        title: '10.3查询某用户下的印章',
        disabled: false,
        subTitle: '10.3根据用户ID查询用户所有的印章信息',
        portDesTitle: '接口描述：',
        portDes: '根据单位ID分页查询单位下的印章信息',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port// seal/userPageListSealInfo',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['currentPage','是','String','当前页',''],
            ['userId','是','String','用户ID',''],
            ['pageSize','是','String','每页显示条数','']
        ],
        egTitle: '请求示例：',
        eg: `
            {
                "currentPage": 1,
                "userId": "591635506115117056",
                "pageSize": 10
            }
        `,
        backEgTitle: '返回示例',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": {
                "records": [
                    {
                        "id": "597832901689606144",
                        "pictureCode": "44030133347652",
                        "pictureName": "cesss",
                        "pictureBusinessType": "01",
                        "pictureWidth": "40",
                        "pictureHeight": "40",
                        "certificateSource": "02",
                        "certificateId": null,
                        "pictureUserType": "01",
                        "enterpriseOrPersonalId": "591635506115117056",
                        "picturePath": "http://192.168.51.218:6065/group2/M00/0A/0C/wKgz5l0jBKuAZRhPAAQYIWygT1I105.png",
                        "gmtCreate": "2019-07-08 16:54:31",
                        "isDeleted": 0,
                        "pictureStatus": "01",
                        "mediumType": "01"
                    },
                    {
                        "id": "597754155129372672",
                        "pictureCode": "44030109287749",
                        "pictureName": "测试",
                        "pictureBusinessType": "03",
                        "pictureWidth": "99",
                        "pictureHeight": "99",
                        "certificateSource": "01",
                        "certificateId": "12",
                        "pictureUserType": "01",
                        "enterpriseOrPersonalId": "591635506115117056",
                        "picturePath": "http://192.168.51.218:6065/group2/M00/09/A7/wKgz5l0iuJCAMWsAAA3tXhFDp38687.png",
                        "gmtCreate": "2019-07-08 11:41:36",
                        "isDeleted": 0,
                        "pictureStatus": "01",
                        "mediumType": "01"
                    },
                    {
                        "id": "597753926577553408",
                        "pictureCode": "44030178812900",
                        "pictureName": "陆文雄的章",
                        "pictureBusinessType": "01",
                        "pictureWidth": "44",
                        "pictureHeight": "40",
                        "certificateSource": "02",
                        "certificateId": null,
                        "pictureUserType": "01",
                        "enterpriseOrPersonalId": "591635506115117056",
                        "picturePath": "http://192.168.51.218:6065/gro",
                        "gmtCreate": "2019-07-08 11:40:43",
                        "isDeleted": 0,
                        "pictureStatus": "01",
                        "mediumType": "01"
                    }
                ],
                "total": 3,
                "size": 10,
                "current": 1,
                "ascs": null,
                "descs": null,
                "optimizeCountSql": true,
                "pages": 1
                }
            }            
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
           ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
           ['msg','String','请求提示信息'],
           ['data','Object','返回数据体'],
           ['records','Array','分页数据']
        ],
        jsonStr: 'records中单个对象参数',
        thead4: ['参数','类型','说明'],
        tbody4: [
            ['id','String','印章主键ID'],
            ['印章主键id','String',''],
            ['pictureCode','String','印章编码'],
            ['pictureName','String','印章名称'],
            ['pictureBusinessType','String','印章业务类型  01 行政章 02 财务章 03 电子私章'],
            ['pictureWidth','String','印章宽'],
            ['pictureHeight','String','印章高'],
            ['certificateSource','String','证书来源  01 单位证书库关联  02 在线软证书 03 本地生成证书'],
            ['certificateId','String','证书ID, 当certificateSource=01时，不能为空'],
            ['pictureUserType','String','印章用户类型 01 单位用户 02 个人用户 '],
            ['enterpriseOrPersonalId','String','单位或个人表主键ID'],
            ['picturePath','String','章模图片路径如：http://192.168.51.218:6065/group/1.png'],
            ['gmtCreate','Date','创建时间如：2019-07-08 11:40:43'],
            ['isDeleted','String','是否有效 01：有效 02 已删除或禁用'],
            ['pictureStatus','String','印章状态 01：正常'],
            ['mediumType','String','介质类型 01 云印章 02 ukey印章']
        ],
        errCode: 'code错误码',
        thead5: ['值','说明'],
        tbody5: [
            ['1000','请求参数有误']
        ]
    },
    {
        title: '10.4查询印章详情信息',
        disabled: false,
        subTitle: '10.4查询印章详情信息',
        portDesTitle: '接口描述：',
        portDes: '根据印章编码查询印章详情',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port///seal/query/{pictureCode}',
        methodTitle: '请求方式：',
        method: 'get',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['pictureCode','是','String','印章编码','如：44030178812900']
        ],
        backEgTitle: '返回示例：',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": {
                    "id": "597753926577553408",
                    "pictureCode": "44030178812900",
                    "pictureName": "陆文雄的章",
                    "pictureBusinessType": "01",
                    "pictureWidth": "44",
                    "pictureHeight": "40",
                    "certificateSource": "02",
                    "certificateId": null,
                    "pictureUserType": "01",
                    "enterpriseOrPersonalId": "591635506115117056",
                    "picturePath": "http://192.168.51.218:6065/gro",
                    "gmtCreate": "2019-07-08 11:40:43",
                    "isDeleted": 0,
                    "pictureStatus": "01",
                    "mediumType": "01"
                }
            }            
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Object','数据对象'],
        ],
        jsonStr: 'data中数据对象属性',
        thead4: ['参数','类型','说明'],
        tbody4:[
            ['id','String','印章主键id'],
            ['pictureCode','String','印章编码'],
            ['pictureName','String','印章名称'],
            ['pictureBusinessType','String','印章业务类型  01 行政章 02 财务章 03 电子私章'],
            ['pictureWidth','String','印章宽'],
            ['pictureHeight','String','印章高'],
            ['certificateSource','String','证书来源  01 单位证书库关联  02 在线软证书 03 本地生成证书'],
            ['certificateId','String','证书ID, 当certificateSource=01时，不能为空'],
            ['pictureUserType','String','印章用户类型 01 单位用户 02 个人用户'],
            ['enterpriseOrPersonalId','String','单位或个人表主键ID'],
            ['picturePath','String','章模图片路径如：http://192.168.51.218:6065/group/1.png'],
            ['gmtCreate','Date','创建时间如：2019-07-08 11:40:43'],
            ['isDeleted','String','是否有效 01：有效 02 已删除或禁用'],
            ['pictureStatus','String','印章状态 01：正常'],
            ['mediumType','String','介质类型 01 云印章 02 ukey印章']
        ],
        errCode: 'code错误码',
        thead5: ['值','说明'],
        tbody5: [
            ['1000','请求参数有误']
        ]
    },
    {
        title: '10.5修改印章',
        disabled: false,
        subTitle: '10.5修改印章',
        portDesTitle: '接口描述：',
        portDes: '根据印章编码修改印章信息',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/seal/update',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['certificateId','否','String','证书ID','当certificateSource=01时不能为空'],
            ['certificateSource','是','String','证书来源','01 单位证书库关联  02 在线软证书 03 本地生成证书'],
            ['createMode','是','String','创建方式','1手绘签名，2本地上传'],
            ['mediumType','是','String','介质类型','01 云印章 02 ukey印章'],
            ['pictureBusinessType','是','String','印章业务类型','01 行政章、02 财务章等 个人： 03 电子私章'],
            ['pictureDataTmpId','否','String','上传章模图片时返回的章模临时表主键ID','如果有重新上传章模，pictureDataTmpid不能为空'],
            ['pictureHeight','是','String','设置章模高',''],
            ['pictureWidth','是','String','设置章模宽',''],
            ['pictureName','是','String','章模名称',''],
            ['picturePath','是','String','上传章模时返回的章模图片路径','如果有重新上传，则为最新上传返回的path，否则为原有path路径']
        ],
        egTitle: '请求示例：',
        eg: `
            {
                "certificateId": "",
                "certificateSource": "02",
                "createMode": 0,
                "enterpriseOrPersonalId": "591635506115117056",
                "mediumType": "01",
                "pictureBusinessType": "01",
                "pictureDataTmpId": "597832264662908928",
                "pictureHeight": "40",
                "pictureName": "cesss",
                "picturePath": "http://192.168.51.218:6065/group2/M00/0A/0C/wKgz5l0jBKuAZRhPAAQYIWygT1I105.png",
                "pictureUserType": "01",
                "pictureWidth": "40"
            }
        `,
        backEgTitle: '返回示例',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": true
            }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功,非0为其它异常错误码,对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Boolean','成功与否']
        ],
        errCode: 'code错误码',
        thead5: ['值', '说明'],
        tbody5: [
            ['1000','请求参数有误'],
            ['1013','编辑印章信息失败']
        ]
    },
    {
        title: '10.6删除某单位下的印章',
        disabled: false,
        subTitle: '10.6删除某单位下的印章',
        portDesTitle: '接口描述：',
        portDes: '删除某单位下的印章',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/seal/delete',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['enterpriseId','是','String','单位ID',''],
            ['pictureCodes','是','List','印章编码list','当list大小为1时删除单个，但list大于1时批量删除']
        ],
        egTitle: '请求示例',
        eg: `
            {
                "enterpriseId": "79898989",
                "pictureCodes": ["451465656","44030109287749"]
            }
        `,
        backEgTitle: '返回示例：',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": true
            }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功,非0为其它异常错误码,对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Boolean','成功与否']
        ],
        errCode: 'code错误码',
        thead5: ['值','说明'],
        tbody5: [
            ['1000','请求参数有误'],
            ['1014', '删除印章失败']
        ]
    },
    {
        title: '10.7印章权限分配',
        disabled: false,
        subTitle: '10.7印章权限分配',
        portDesTitle: '接口描述：',
        portDes: '接口可指定用户分配指定印章权限',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/userSeal/bind',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['sealId','是','String','印章ID',''],
            ['userId','是','Array','用户ID集合','']
        ],
        egTitle: '请求示例',
        eg: `
        {
            "sealId": "79898989",
            "userIds": [
              "451465656","44030109287749"
            ]
          }
        `,
        backEgTitle: '返回示例',
        backEg: `
        {
            "code": 0,
            "msg": "请求成功",
            "data": true
        }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功,非0为其它异常错误码,对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Boolean','成功与否']
        ]
    },
    {
        title: '10.8印章权限回收',
        disabled: false,
        subTitle: '10.8印章权限回收',
        portDesTitle: '接口描述：',
        portDes: '接口可指定用户回收指定印章权限',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/userSeal/unBind',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['sealId','是','String','印章ID',''],
            ['userId','是','Array','用户ID集合','']
        ],
        egTitle: '请求示例',
        eg: `
        {
            "sealId": "79898989",
            "userId": "44030109287749"
        }
        `,
        backEgTitle: '返回示例',
        backEg: `
        {
            "code": 0,
            "msg": "请求成功",
            "data": true
        }
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功,非0为其它异常错误码,对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Boolean','成功与否']
        ]
    },
    {
        title: '十一、打印',
        disabled: true
    },
    {
        title: '11.1打印日志',
        disabled: false,
        subTitle: '11.1打印日志',
        portDesTitle: '接口描述：',
        portDes: '输出文件打印日志',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/document/print/getFilePrintList',
        methodTitle: '请求方式：',
        method: 'get',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json  |  api_token: token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['currPage','是','Integer','当前页码',''],
            ['pageSize','是','Integer','每页行数',''],
            ['fileCode','是','String','文档编码','']
        ],
        egTitle: '请求示例',
        eg: 
        `
        http://ip:port/document/print/getFilePrintList?fileCode=9081e7d7-40c8-4d60-ada7-7084b4dd6851&currPage=1&pageSize=10
        `,
        backEgTitle: '返回示例',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": {
                    "records": [
                        {
                            "id": "606144638482382848",
                            "printUser": "2",
                            "userEnterprise": "591635506115117056",
                            "userType": 1,
                            "userChannel": 1,
                            "fileCode": "c7f996bf-9df8-4fa8-bfd1-9ef50b5c1248",
                            "gmtCreate": "2019-07-31 15:22:23",
                            "userName": "System",
                            "enterpriseName": "深圳安印科技"
                        }
                    ],
                    "total": 3,
                    "size": 10,
                    "current": 1,
                    "ascs": null,
                    "descs": null,
                    "optimizeCountSql": true,
                    "pages": 1
                }
            }            
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','']
        ],
        dataTips: 'data参数',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['records','List','数据集列表'],
            ['total','long','总行数'],
            ['size','long','每页数量'],
            ['current','long','当前页码'],
            ['pages','long','总页数']
        ],
        jsonStr: 'records',
        thead4: ['参数','类型','说明'],
        tbody4: [
            ['id','String','打印ID'],
            ['printUser','String','打印用户ID'],
            ['userEnterprise','String','用户所属单位/个人ID'],
            ['userType','Integer','1单位2个人'],
            ['userChannel','Integer','1后台用户2前台用户'],
            ['fileCode','String','文件code'],
            ['gmtCreate','Date','打印时间'],
            ['userName','String','用户名称'],
            ['enterpriseName','String','企业/个人名称']
        ]
    },
    {
        title: '十二、文档验证',
        disabled: true
    },
    {
        title: '12.1签章文件验证',
        disabled: false,
        subTitle: '12.1签章文件验证',
        portDesTitle: '接口描述：',
        portDes: '验证签章文件是否被篡改',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/verify/sign/file',
        methodTitle: '请求方式：',
        method: 'post',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['signFileStr','是','String','签章文件base64字符串','']
        ],
        egTitle: '请求示例',
        eg: `
            {
                "signFileStr": "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29
                kZT4+CnN0cmVhbQp4nJ1STUvDQBC976+Ys9DtvP3KLoRA07Sgt0DAg3jyC4Qq9uLfdzbVdmsbUS/DZGbe2/cmwxr0rt6Ii
                SXzyWtD0UFH2j6o6wt6kR5yl7ZPqh2UDDiqfNSehnuar0HgnD/WDDbN8KxWg+q"
            }
        `,
        backEgTitle: '返回示例',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": {
                    "signFileSignatureList": [
                        {
                            "isSignatureCertificate": true,
                            "isTimestampCertificate": true,
                            "signer": "华为技术有限公司",
                            "signDate": "2018-10-31 15:54:20",
                            "certificateAuthority": "天诚安信试用",
                            "timestamp": "2018-10-31 15:54:20",
                            "sealCode": null
                        }
                    ]
                }
            }            
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码,对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','String','请求提示信息'],
            ['signFileSignatureList','Array','单页签章时 array大小为1，多页签时array大于1']
        ],
        jsonStr: 'signFileSignatureList对象参数',
        thead4: ['参数','类型','说明'],
        tbody4: [
            ['isSignatureCertificate','Boolean','是否签名认证通过'],
            ['isTimestampCertificate','Boolean','是否时间戳认证通过'],
            ['signer','String','签约人'],
            ['signDate','Date','签署时间'],
            ['certificateAuthority','String','证书颁发机构'],
            ['timestamp','Date','时间戳'],
            ['sealCode','String','印章编码']
        ],
        errCode: 'code错误码',
        thead5: ['值','说明'],
        tbody5: [
            ['1000', '请求参数有误']
        ]
    },
    {
        title: '12.2二维码验证',
        disabled: false,
        subTitle: '12.2二维码验证',
        portDesTitle: '接口描述：',
        portDes: '验证签章文件是否被篡改',
        portLinkTitle: '接口链接：',
        portLink: 'http://ip:port/verify/sign/file/{fileCode}',
        methodTitle: '请求方式：',
        method: 'get',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/json  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['fileCode','是','String','文档编码','']
        ],
        egTitle: '请求示例：',
        eg: `
            http://ip:port/verify/sign/file/96cd1d19-0f07-4354-87a6-f111af744eb5
        `,
        backEgTitle: '返回示例：',
        backEg: `
            {
                "code": 0,
                "msg": "请求成功",
                "data": {
                    "signFileSignatureList": [
                        {
                            "signInfoRespDTO": {
                                "timestamp": "2019-07-30 19:18:35 000",
                                "effectiveDes": "签名有效",
                                "signTime": "2019-07-30 19:18:35",
                                "updateDes": "未被篡改"
                            },
                            "cerInfoRespDTO": {
                                "ownwer": "安印科技有限公司",
                                "certificateAuthority": "CCS NETCA L1 Sub1 CA",
                                "signAlgorithm": "SHA256WITHRSA",
                                "periodOfValidity": "2018-04-13 10:59:29 ~ 2023-04-13 10:59:29"
                            }
                        }
                    ]
                }
            }            
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Object','返回数据对象']
        ],
        dataTips: 'data参数',
        thead3: ['参数','类型','说明'],
        tbody3: [
            ['signFileSignatureList','Array','单页签章时 array大小为1，多页签时array大于1']
        ],
        jsonStr: 'signFileSignatureList对象参数',
        thead4: ['参数','类型','说明'],
        tbody4: [
            ['signInfoRespDTO','SignInfoRespDTO','签名信息'],
            ['cerInfoRespDTO','CerInfoRespDTO','证书信息']
        ],
        errCode: 'signInfoRespDTO 对象参数',
        thead5: ['参数','类型','说明'],
        tbody5: [
            ['timestamp','Date','时间戳'],
            ['effectiveDes','Date','签署时间'],
            ['signTime','String','证书颁发机构'],
            ['updateDes','Date','时间戳'],
            ['ownwer','String','拥有者'],
            ['certificateAuthority','String','颁发机构'],
            ['signAlgorithm','String','签名算法'],
            ['periodOfValidity','String','有限期']
        ],
    },
    {
        title: '12.3验证码验证',
        disabled: false,
        subTitle: '12.3验证码验证',
        portDesTitle: '接口描述：',
        portDes: '通过验证码查询对应的信息',
        portLinkTitle: '接口链接：',
        portLink: 'https://ip:port/verify/sign/verify/code/{code}',
        methodTitle: '请求方式：',
        method: 'POST',
        headersTitle: '请求头：',
        headers: 'Content-Type：application/x-www-form-urlencoded  |  api_token:  token令牌',
        paramsTitle: '参数说明：',
        thead: ['参数','必须','类型','说明','备注'],
        tbody: [
            ['code','是','String','验证码','']
        ],
        egTitle: '请求示例：',
        eg: `
            "code": "b1020bea1115ba88bd09b391aa718716"
        `,
        backParams: '返回参数',
        thead2: ['参数','类型','说明'],
        tbody2: [
            ['code','Integer','0：代表请求数据成功，非0为其它异常错误码，对应ErrorCode表'],
            ['msg','String','请求提示信息'],
            ['data','Object','返回数据对象']
        ]
    },
    {
        title: '十三、接口返回码说明',
        disabled: true
    },
    {
        title: '13.1系统级别错误',
        disabled: false,
        subTitle: '13.1	系统级别错误',
        thead6: ['序号','返回码','说明'],
        tbody6: [
            ['1','-1','系统繁忙，请稍候再试'],
            ['2','0','请求成功'],
            ['3','204','请求成功，无返回数据'],
            ['4','300','请求重定向'],
            ['5','400','请求参数异常'],
            ['6','500','服务器异常']
        ]
    },
    {
        title: '13.2前端请求异常',
        disabled: false,
        subTitle: '13.2	前端请求异常',
        thead6: ['序号','返回码','说明'],
        tbody6: [
            ['1','40001','请求参数异常，请检查后重试'],
            ['2','40002','请求的数字证书无效'],
            ['3','40003','验证签名失败'],
            ['4','40004','电子印章不存在'],
            ['5','40005','验证电子印章失败'],
            ['6','40006','电子印章已过期'],
            ['7','40007','请求方式不支持'],
            ['8','40100','应用名称已存在'],
            ['9','40101','签章页数无效'],
            ['10','40201','根证书不存在'],
            ['11','40202','创建用户证书失败'],
            ['12','40203','请求参数异常，企业不存在'],
            ['13','40204','请求参数异常，此印章已开通云签章'],
            ['14','40205','上传的文件超过最大值'],
            ['15','40301','token error'],
            ['16','40302','用户名或密码错误'],
            ['17','40303','无token或未开通对应服务'],
            ['18','40304','token过期']
        ]
    },
    {
        title: '13.3后端请求异常',
        disabled: false,
        subTitle: '13.3	后端请求异常',
        thead6: [],
        tbody6: [
            ['1','50001','服务器异常'],
            ['2','50002','请求基础服务失败'],
            ['3','50003','数码印章信息不完整'],
            ['4','50100','应用创建失败'],
            ['5','50101','应用修改失败'],
            ['6','50102','应用暂停失败'],
            ['7','50103','应用启动失败'],
            ['8','50104','应用删除失败'],
            ['9','50105','应用恢复失败'],
            ['10','50106','应用彻底删除失败'],
            ['11','50107','应用不存在，请刷新当前页'],
            ['12','50201','用户证书不合法，不能保持']
        ]
    }
]

export default menu