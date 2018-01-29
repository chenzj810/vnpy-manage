<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-star-on"></i> ROM管理</el-breadcrumb-item>
                <el-breadcrumb-item>ROM列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box rad-group">
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="dialogFormVisible=true">创建版本</el-button>
        </div>
        <el-table :data="listData" border style="width: 100%" ref="multipleTable" v-loading="loading">
            <!--<el-table-column label="状态" width="100":filters="[{ text: '离线', value: '离线' }, { text: '未激活', value: '未激活' }]" :filter-method="filterTag">-->
                <!--<template slot-scope="scope">-->
                    <!--<el-tag :type="scope.row.zt == '离线' ? 'warning' : 'success'" close-transition>{{scope.row.zt}}</el-tag>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column prop="create_date" label="创建时间" width="170"></el-table-column>
            <el-table-column prop="rom_version" label="版本号" width="170"></el-table-column>
            <!--<el-table-column prop="oem" label="OEM" width="70"></el-table-column>-->
            <el-table-column prop="ver_type" label="版本类型" width="160" :filters="[{ text: '测试版本', value: '测试版本' }, { text: '正式版本', value: '正式版本' }]" :filter-method="filterTag">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.ver_type == '测试版本' ? 'warning' : 'success'"  size="small" close-transition>{{scope.row.ver_type}}</el-tag>
                </template>
            </el-table-column>
            <!--<el-table-column label="51盒子状态" width="150">-->
                <!--<template scope="scope">-->
                    <!--<el-tag type="warning">{{scope.row.hzzt}}</el-tag>-->
                <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column prop="dev_type" label="设备型号" width="160"></el-table-column>
            <el-table-column prop="comment" label="更新说明" width="160"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button class="btn1" type="text" size="small" @click="downloadRom(scope.row._id,scope.row.file_name,scope.row.rom_status)">下载</el-button>
                    <el-button class="btn1" type="text" size="small" @click="delRom(scope.row._id,scope.row.file_name)">删除</el-button>
                    <el-button class="btn1" type="danger" size="small" v-if="scope.row.rom_status =='normal'" @click="revokeRom(scope.row._id,scope.row.file_name)">下架</el-button>
                    <el-button class="btn1" type="success" size="small" v-else @click="releaseRom(scope.row._id,scope.row.file_name)">上架</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                @current-change ="handleCurrentChange"
                layout="prev, pager, next"
                :total="1000">
            </el-pagination>
        </div>

        <el-dialog title="添加ROM版本" :visible.sync="dialogFormVisible" class="digcont">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="上传" :label-width="formLabelWidth">
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        name="file_name"
                        action="http://api.rom.kunteng.org/rom/upload"
                        :data="form"
                        :beforeUpload="beforeUpload"
                        :on-success="handleSuccess"
                        :file-list="fileList3"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="ROM版本号" prop=rom_version :label-width="formLabelWidth">
                    <el-input v-model="form.rom_version" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="设备类型" prop="dev_type" :label-width="formLabelWidth">
                    <el-select v-model="form.dev_type" placeholder="请选择对应设备型号">
                        <el-option
                            v-for="item in typeListData"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="版本类型" prop="ver_type" :label-width="formLabelWidth">
                    <el-select v-model="form.ver_type" placeholder="请选择版本类型">
                        <el-option label="正式版本" value="正式版本"></el-option>
                        <el-option label="测试版本" value="测试版本"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="MD5串码" prop="md5_value" :label-width="formLabelWidth">
                    <el-input v-model="form.md5_value" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注说明" prop="comment" :label-width="formLabelWidth">
                    <el-input v-model="form.comment" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd('form')"v-loading.fullscreen.lock="fullscreenLoading">添 加</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import global_ from 'components/common/Global';
    export default {
        data: function(){
            return {
                url: './static/datasource.json',
                information: {
                    pagination:{},
                    data:[]
                },

                dialogFormVisible:false,
                radio3:'全部',
                tableData2:[
                    {
                        "cjsj":"2017-11-17 14:05:58",
                        "bbh":"2.11.2514",
                        "oem":"LD",
                        "bblx":"test",
                        "sbxh":"zc9525a",
                        "xpxh":"MT7628AN",
                        "gxsm":"企业智能中枢测试"
                    },
                    {
                        "cjsj":"2017-11-17 14:05:58",
                        "bbh":"2.11.2514",
                        "oem":"LD",
                        "bblx":"official",
                        "sbxh":"zc9525a",
                        "xpxh":"MT7628AN+MT7610E",
                        "gxsm":"LD"
                    },
                    {
                        "cjsj":"2017-11-17 14:05:58",
                        "bbh":"2.11.2514",
                        "oem":"ZC",
                        "bblx":"official",
                        "sbxh":"zc9525a",
                        "xpxh":"MT7628AN",
                        "gxsm":"航信打印版本"
                    },
                    {
                        "cjsj":"2017-11-17 14:05:58",
                        "bbh":"2.11.2514",
                        "oem":"LD",
                        "bblx":"test",
                        "sbxh":"zc9525a",
                        "xpxh":"MT7628AN",
                        "gxsm":"企业智能中枢测试"
                    }


                ],

                form: {
                    file_name:'',
                    rom_version:'',
                    dev_type:'',
                    ver_type: '',
                    md5_value:'',
                    comment:''
                },
                rules: {
                    rom_version:[
                        {required: true, message: '请输入ROM版本号', trigger: 'blur'}
                    ],
                    dev_type:[
                        {required: true, message: '请输入设备类型', trigger: 'blur'},
                    ],
                    ver_type:[
                        {required: true, message: '请输入版本类型', trigger: 'blur'}
                    ],
                    md5_value:[
                        {required: true, message: '请输入MD5串码', trigger: 'blur'}
                    ]
                },
                formLabelWidth: '120px',
                fileList3: [],
                loading:false,
                fullscreenLoading: false,
                listData:[],
                typeListData:[]

            }
        },
        created: function(){
            this.getData();
            this.getTypes();
        },
        methods: {
            getTypes: function(){//获取设备类型
                var self = this;
                self.$axios.post(global_.baseUrl+'/devtype/types').then(function(res){
                    if(res.data.ret_code == 0){
                        self.typeListData = res.data.extra;
                    }
                })
            },
            getData: function(){//获取rom列表
                var self = this;
                self.loading = true;
                var params = {
//                    page_size:10,
//                    current_page:1,
//                    sort:'asc'
                };
                self.$axios.post(global_.baseUrl+'/rom/list').then(function(res){
//                    console.log(res);
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.listData = res.data.extra;
                    }
                })
            },
            beforeUpload: function(file){
                console.log(file);
                this.form.file_name = file.name;
                return true;
            },
            handleSuccess: function(response,file,fileList){
                console.log(response);
                this.fullscreenLoading  = false;
                this.$message('创建成功');
                this.dialogFormVisible = false;
                this.getData();
            },
            handleError: function(response,file,fileList){
                this.$message('操作失败');
                self.fullscreenLoading  = false;
            },
            saveAdd: function(formName){
                var self = this;
                self.$refs[formName].validate(function(valid){
                    if(valid){
                        console.log('验证成功')
                    }else{
                        return false;
                        console.log('验证失败');
                    }
                });
                self.fullscreenLoading  = true;
                self.$refs.upload.submit();
            },
            downloadRom: function(id,fileName,status){//下载
                var self = this;
                if(status == 'revoke'){
                    self.$message('固件已下架');
                    return false;
                }
                var params = {
                    _id: id,
                    file_name:fileName
                };
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/rom/download',params).then(function(res){
                    self.loading = false;
                    console.log(res);
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
                        self.$message('删除成功');
                        self.getData();
                    }

                },function(err){
                    self.$message('删除失败');
                    self.loading = false;
                    console.log(err);
                })
            },
            delRom: function(id,fileName){//删除
                var self = this;
                var params = {
                    _id: id,
                    file_name:fileName
                };
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/rom/del',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message('删除成功');
                        self.getData();
                    }

                },function(err){
                    self.$message('删除失败');
                    self.loading = false;
                    console.log(err);
                })
            },
            releaseRom: function(id,fileName){//上架操作
                var self = this;
                var params = {
                    _id: id,
                    file_name:fileName
                };
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/rom/release',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message('操作成功');
                        self.getData();
                    }

                },function(err){
                    self.$message('操作失败');
                    self.loading = false;
                    console.log(err);
                })
            },
            revokeRom: function(id,fileName){//下架操作
                var self = this;
                var params = {
                    _id: id,
                    file_name:fileName
                };
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/rom/revoke',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message('操作成功');
                        self.getData();
                    }

                },function(err){
                    self.$message('操作失败');
                    self.loading = false;
                    console.log(err);
                })
            },
            handleChange:function(file, fileList) {
//                console.log(file,fileList);
                this.form.file_name = file.name;
            },
            handleCurrentChange:function(val){
                this.cur_page = val;
                this.getData();
            },
            filterTag:function(value, row) {
                return row.tag === value;
            },
            changePage:function(values) {
                this.information.pagination.per_page = values.perpage;
                this.information.data = this.information.data;
            },
        },
        computed:{

        }
    }
</script>

<style src="../../../static/css/datasource.css"></style>
<style>
    .rad-group{margin-bottom:20px;}
    .handle-input{  width: 300px;  display: inline-block;  }
    .handle-box2{display:inline-block;float:right;}
    /*.el-table_1_column_5{color:#eb9e05;}*/
    .orange{color:#eb9e05;background-color:none;}
    .btn2{margin-bottom:5px;margin-left:0;}
    .diainp{width:217px;}
    .diainp2{width:400px;}
    .upload-demo .el-upload {
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .upload-demo .el-upload:hover {
        border-color: #409EFF;
    }
</style>
