import Mock from 'mockjs'

// Mock.setup({
//     timeout: '200-600', // 默认 `10-100`
// })

let resArr = []
let files = require.context('.', true, /\.js$/)

files.keys().map(key => { 
    if(key === './index.js') return;

    resArr = resArr.concat(files(key).default)
})

resArr.map(item => {
    // console.log(item)

    for(let [path, target] of Object.entries(item)) {
        let _protocol = path.split('|')

        console.log(JSON.stringify(target, null, 4))

        Mock.mock(new RegExp('^' + _protocol[1]), _protocol[0], target)
    }
})