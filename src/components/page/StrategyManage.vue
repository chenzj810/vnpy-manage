<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-star-on"></i> 策略管理</el-breadcrumb-item>
                <el-breadcrumb-item>策略列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box rad-group">
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="dialogFormVisible=true">创建版本</el-button>
        </div>
        <el-table :data="strategy_list" border style="width: 100%" ref="multipleTable" v-loading="loading">
            <el-table-column prop="appName" label="策略名称" width="170"></el-table-column>
            <el-table-column prop="appDisplayName" label="策略中文名称" width="170"></el-table-column>
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
                strategy_list:[]

            }
        },
        created: function(){
            this.getStrategyList();
        },
        methods: {
            getStrategyList: function(){//获取task列表
                var self = this;
                self.loading = true;
                self.$axios.post('/api/strategy/list').then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.pageTotal = res.data.extra.length;
                        self.strategy_list = res.data.extra.slice(0,10);
                    }
                    else{
                        self.strategy_list = []
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
                this.getStrategyList();
            },
            handleError: function(response,file,fileList){
                this.$message('操作失败');
                self.fullscreenLoading  = false;
            },
            handleChange:function(file, fileList) {
//                console.log(file,fileList);
                this.form.file_name = file.name;
            },
            handleCurrentChange:function(val){
                this.cur_page = val;
                this.getStrategyList();
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
