<template>
    <div class="tinymce-editor">
        <editor
            id="tinymce"
            @onClick="onClick"
            v-model="useContent"
            ref="tinymce"
            :init="editorInit"
        ></editor>
    </div>
</template>

<script>
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/silver';
import Editor from '@tinymce/tinymce-vue';
import '@/assets/tinymce/zh_CN.js';
import '@/assets/tinymce/skins/ui/oxide/skin.min.css';
import '@/assets/tinymce/skins/ui/oxide/content.min.css';
import '@/assets/tinymce/skins/content/default/content.css';
import 'tinymce/plugins/image'; // 插入上传图片插件
import 'tinymce/plugins/media'; // 插入视频插件
import 'tinymce/plugins/table'; // 插入表格插件
import 'tinymce/plugins/lists'; // 列表插件
import 'tinymce/plugins/link'; // 链接插件
import 'tinymce/plugins/wordcount'; // 字数统计插件
import 'tinymce/plugins/fullscreen'; // 全屏
import 'tinymce/plugins/insertdatetime'; // 插入时间
import 'tinymce/plugins/code'; // 显示源代码
import 'tinymce/plugins/print'; // 插入打印
import 'tinymce/plugins/searchreplace'; // 插入查找替換
export default {
    components: {
        Editor
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        serverUrl: {
            // 上传地址
            type: String,
            default: ''
        },
        viewUrl: {
            // 预览地址
            type: String,
            default: ''
        },
        picData: {
            // 其它参数
            type: Object,
            default() {
                return {};
            }
        },
        plugins: {
            type: [String, Array],
            default:
                'lists image media table wordcount link fullscreen insertdatetime code print searchreplace'
        },
        toolbar: {
            type: [String, Array],
            default:
                'undo redo searchreplace | bold italic underline strikethrough forecolor backcolor | fontsizeselect | formatselect | alignleft aligncenter alignright alignjustify | bullist numlist | lists table | insertdatetime removeformat wordcount code'
        }
    },
    data() {
        return {
            useContent: this.value,
            editorInit: {
                // language_url: "/tinymce/zh_CN.js",
                // skin_url: "/tinymce/skins/ui/oxide",
                height: 600,
                toolbar: this.toolbar,
                plugins: this.plugins,
                toolbar: this.toolbar,
                menubar: false, // 隐藏菜单栏
                // menubar: 'file edit view format table', // 菜单栏配置
                // menu: {
                //     insert: {title: 'Insert', items: 'link media template hr'}, // 插入项配置
                // },
                branding: false,
                // 自定义前端上传逻辑
                images_upload_handler: (blobInfo, succFun, failFun) => {
                    // this.handleImageUpload(blobInfo, success, failure);

                    var xhr, formData;
                    var file = blobInfo.blob(); // 转化为易于理解的file对象
                    xhr = new XMLHttpRequest();
                    xhr.withCredentials = false;
                    xhr.open('POST', '/demo/upimg.php');
                    xhr.onload = function() {
                        var json;
                        if (xhr.status != 200) {
                            failFun('HTTP Error: ' + xhr.status);
                            return;
                        }
                        json = JSON.parse(xhr.responseText);
                        if (!json || typeof json.location != 'string') {
                            failFun('Invalid JSON: ' + xhr.responseText);
                            return;
                        }
                        succFun(json.location);
                    };
                    formData = new FormData();
                    formData.append('file', file, file.name);
                    xhr.send(formData);
                }
            }
        };
    },
    created() {},
    mounted() {
        tinymce.init({
            selector: '#tinymce',
            plugins: 'image',
            toolbar: 'image',
            image_prepend_url: 'http://localhost:8001/'
        });
    },
    watch: {
        $route: {
            handler(to, from) {
                if (to.name === 'natifiAdd') {
                    this.show = true;
                } else {
                    this.show = false;
                }
            }
        },
        value(val) {
            this.useContent = val;
        },
        useContent(useContentVal) {
            this.$emit('input', useContentVal);
        }
    },
    computed: {},
    methods: {
        clear() {
            this.useContent = '';
        },
        onClick(e) {
            this.$emit('onClick', e, tinymce);
        },
        handleImageUpload(blobInfo, success, failure) {
            let formData = new FormData();
            formData.set('file', blobInfo.blob());
            formData.set('userId', this.picData.userId);
            this.$api('upload')
                .post('postFormData', formData)
                .then((res) => {
                    let picUrl = this.viewUrl + res.data.data;
                    success(picUrl);
                    if (!res) {
                        failure('上传图片失败!');
                    } else {
                        console.log('success');
                    }
                });
        }
    }
};
</script>
