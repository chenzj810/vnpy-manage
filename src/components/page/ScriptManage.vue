<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-document"></i> 脚本管理</el-breadcrumb-item>
                <el-breadcrumb-item>脚本列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="dialogFormVisible=true">上传脚本</el-button>
        </div>
        <el-table :data="listData" border style="width: 100%" ref="multipleTable" v-loading="loading">
            <el-table-column prop="script_name" label="脚本名称" width="380"></el-table-column>
            <!--<el-table-column prop="script_version" label="版本号" width="150"></el-table-column>-->
            <el-table-column prop="script_developer" label="开发者" width="110"></el-table-column>
            <el-table-column prop="script_create_time" label="上传时间" width="150"></el-table-column>
            <el-table-column prop="script_info" label="脚本说明" width="110"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="downloadScript(scope.row.script_name,scope.row.script_status)">下载</el-button>
                    <el-button type="text" size="small" @click="delScript(scope.row.script_name)">删除</el-button>
                    <el-button type="danger" size="small" v-if="scope.row.script_status =='0'" @click="revokeScript(scope.row.script_name)">下架</el-button>
                    <el-button type="success" size="small" v-else @click="releaseScript(scope.row.script_name)">上架</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                @current-change ="handleCurrentChange"
                :current-page="currentPage"
                layout="prev, pager, next"
                :total="pageTotal">
            </el-pagination>
        </div>

        <el-dialog title="添加脚本文件" :visible.sync="dialogFormVisible" class="digcont">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="上传脚本" :label-width="formLabelWidth">
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        name="file_name"
                        :action="uploadUrl"
                        with-credentials="true"
                        :data="form"
                        :beforeUpload="beforeUpload"
                        :on-change="handleChange"
                        :on-success="handleSuccess"
                        :file-list="fileList"
                        :auto-upload="false">
                        <el-button size="small" type="primary">选择文件</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="脚本名称" :label-width="formLabelWidth">
                    <el-input v-model="form.script_name" class="diainp" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="MD5串码" prop="script_md5" :label-width="formLabelWidth">
                    <el-input v-model="form.script_md5" class="diainp" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="开发者" :label-width="formLabelWidth">
                    <el-input v-model="form.script_developer" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="脚本说明" :label-width="formLabelWidth">
                    <el-input v-model="form.script_info" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd('form')" v-loading.fullscreen.lock="fullscreenLoading">添 加</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import global_ from 'components/common/Global';
    var crypto = require('crypto');
    export default {
        data: function() {
            return {
                uploadUrl:global_.baseUrl+'/script/upload',
                currentPage: 1,
                pageTotal:0,
                dialogFormVisible: false,
                form: {
                    file_name:'',
                    script_name:'',
                    script_developer:'',
                    script_info:'',
                    script_md5:''
                },
                rules: {
                    script_name:[
                        {required: true, message: '请选择脚本', trigger: 'blur'}
                    ],
                    script_version:[
                        {required: true, message: '请输入脚本版本', trigger: 'blur'},
                    ],
                    script_info:[
                        {required: true, message: '请输入脚本相关信息', trigger: 'blur'},
                    ]
                },
                formLabelWidth: '120px',
                showDialog:false,
                radiotoRout:'文件上传',
                fileList:[],
                fullscreenLoading:false,
                listData:[],
                loading:false
            }
        },
        created: function(){
            this.getData({});
        },
        methods: {
            getData: function(params){//获取rom列表
                var self = this;
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/script/list',params).then(function(res){
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        if(JSON.stringify(params) == '{}'){
                            self.pageTotal = res.data.data.length;
                            self.listData = res.data.data.slice(0,10);
                        }else{
                            self.listData = res.data.data;
                        }

                    }
                })
            },
            handlePreview:function(file) {
                console.log(file);
            },
            beforeUpload: function(file){
                // this.form.script_name = file.name;
                // this.form.file_name = file.name;
                return true;
            },
            handleSuccess: function(response,file,fileList){
                // console.log(response);
                this.fullscreenLoading  = false;
                this.dialogFormVisible = false;
                if(response.ret_code == 0){
                    this.$message({message:'创建成功',type:'success'});
                    this.getData({});
                }else{
                    this.$message.error('创建失败');
                }

            },
            handleError: function(response,file,fileList){
                this.$message('操作失败');
                this.fullscreenLoading  = false;
            },
            handleChange:function(file, fileList) {
                var self = this;
                console.log(file);
                this.form.script_name = file.name;
                var reader=new FileReader();
                reader.onload=function(f){
                    var md5sum = crypto.createHash('md5');
                    //md5sum.update(String.fromCharCode.apply(null, this.result));
                    md5sum.update(this.result, 'binary');
                    //console.log('dd:', this.result);
                    var str = md5sum.digest('hex');
                    self.form.script_md5 = str;
                }
                //reader.readAsBinaryString(fileList[0]);
                reader.readAsBinaryString(file.raw);
            },
            saveAdd: function(formName){
                var self = this;
                self.$refs[formName].validate(function(valid){
                    if(valid){
                        // console.log('验证成功')
                    }else{
                        return false;
                        console.log('验证失败');
                    }
                });
                // self.fullscreenLoading  = true;
                self.$refs.upload.submit();
            },
            downloadScript: function(fileName,status){//下载
                var self = this;
                if(status != '0'){
                    self.$message({message:'脚本已下架',type:'warning'});
                    return false;
                }
                var params = {
                    script_name:fileName
                };
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/script/download',params).then(function(res){
                    self.loading = false;
                    var blob = new Blob([res.data]);
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);  // 转换为base64，可以直接放入a表情href
                    reader.onload = function (e) {
                        // 转换完成，创建一个a标签用于下载
                        var a = document.createElement('a');
                        a.download = fileName;
                        a.href = e.target.result;
//                        $("body").append(a);  // 修复firefox中无法触发click
                        a.click();
//                        $(a).remove();
                    }

                    if(res.data.ret_code == 0){
                        self.$message({message:'下载成功',type:'success'});
                        self.getData();
                    }

                },function(err){
                    self.$message.error('下载失败');
                    self.loading = false;
                    console.log(err);
                })
            },
            delScript: function(fileName){//删除
                var self = this;
                var params = {
                    script_name:fileName
                };
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/script/del',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message({message:'删除成功',type:'success'});
                        self.getData({});
                    }else{
                        self.$message.error('删除失败');
                    }

                },function(err){
                    self.$message.error('删除失败');
                    self.loading = false;
                    // console.log(err);
                })
            },
            releaseScript: function(fileName){//上架操作
                var self = this;
                var params = {
                    script_name:fileName
                };
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/script/release',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message({message:'操作成功',type:'success'});
                        self.getData({});
                    }

                },function(err){
                    self.$message.error('操作失败');
                    self.loading = false;
                    console.log(err);
                })
            },
            revokeScript: function(fileName){//下架操作
                var self = this;
                var params = {
                    script_name:fileName
                };
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/script/revoke',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message({message:'操作成功',type:'success'});
                        self.getData({});
                    }else{
                        self.$message.error('操作失败')
                    }

                },function(err){
                    self.$message.error('操作失败');
                    self.loading = false;
                    console.log(err);
                })
            },
            handleCurrentChange:function(val){
                this.currentPage = val;
                this.getData({page_size:10,current_page:this.currentPage});
            }
        }
    }
</script>

<style scoped>
    .handle-box{
        margin-bottom: 20px;
    }
    .handle-select{
        width: 120px;
    }
    .handle-input{
        width: 300px;
        display: inline-block;
    }

    .rad-group{margin-bottom:20px;}
    .btn1{margin-bottom:5px;margin-top:5px;margin-left:0;}
    /*.digcont{width:600px;}*/
    .diainp{width:217px;}
    .diainp2{width:400px;}
    .upload-demo{}
</style>

