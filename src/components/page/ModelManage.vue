<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-share"></i> 设备型号管理</el-breadcrumb-item>
                <el-breadcrumb-item>设备型号列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="dialogFormVisible=true">添加型号</el-button>
        </div>
        <el-table :data="listData" border style="width: 100%" ref="multipleTable" v-loading="loading">
            <el-table-column prop="create_date" label="添加时间" width="170"></el-table-column>
            <el-table-column prop="dev_name" label="设备型号" width="150"></el-table-column>
            <el-table-column prop="dev_vendor" label="设备类型" width="130"></el-table-column>
            <el-table-column prop="chip_type" label="芯片型号" width="170"></el-table-column>
            <el-table-column prop="chip_vendor" label="芯片厂商" width="130"></el-table-column>
            <el-table-column prop="comment" label="更新说明" width="130"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button class="btn1" size="small" type="danger" @click="delDev(scope.row._id)">删除</el-button>
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

        <el-dialog title="添加型号" :visible.sync="dialogFormVisible" class="digcont" v-loading="loading">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="设备型号" prop="dev_name" :label-width="formLabelWidth">
                    <el-input v-model="form.dev_name" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <!--<el-form-item label="芯片型号" :label-width="formLabelWidth">-->
                    <!--<el-select v-model="form.region" placeholder="请选择芯片型号">-->
                        <!--<el-option label="区域一" value="shanghai"></el-option>-->
                        <!--<el-option label="区域二" value="beijing"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item label="设备厂商" prop="dev_vendor" :label-width="formLabelWidth">
                    <el-input v-model="form.dev_vendor" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="芯片类型" prop="chip_type" :label-width="formLabelWidth">
                    <el-input v-model="form.chip_type" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="芯片厂商" prop="chip_vendor" :label-width="formLabelWidth">
                    <el-input v-model="form.chip_vendor" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="comment" :label-width="formLabelWidth">
                    <el-input v-model="form.comment" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd('form')">添 加</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import global_ from 'components/common/Global';
    export default {
        data: function() {
            return {
                cur_page: 1,
                dialogFormVisible: false,
                form: {
                    dev_name:'',
                    dev_vendor:'',
                    chip_type:'',
                    chip_vendor:'',
                    comment:''
                },
                rules: {
                    dev_name:[
                        {required: true, message: '请输入设备型号', trigger: 'blur'}
                    ],
                    dev_vendor:[
                        {required: true, message: '请输入设备厂商', trigger: 'blur'},
                    ],
                    chip_type:[
                        {required: true, message: '请输入芯片类型', trigger: 'blur'}
                    ],
                    chip_vendor:[
                        {required: true, message: '请输入芯片厂商', trigger: 'blur'}
                    ]
                },
                listData:[],
                formLabelWidth: '120px',
                loading:false,
                pageTotal:0,
                currentPage:1
            }
        },
        created: function(){
            this.getData({});
        },
        methods: {
            getData:function(params){
                var self = this;
                self.loading = true;
                // var params = {
//                    page_size:10,
//                    current_page:1,
//                    sort:'asc'
//                 };
                self.$axios.post(global_.baseUrl+'/devtype/list',params).then(function(res){
//                    console.log(res);
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        if(JSON.stringify(params) == '{}'){
                            self.pageTotal = res.data.extra.length;
                            self.listData = res.data.extra.slice(0,10);
                        }else{
                            self.listData = res.data.extra;
                        }

                    }
                })
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
                var params = {
                    dev_name:self.form.dev_name,
                    dev_vendor:self.form.dev_vendor,
                    chip_type:self.form.chip_type,
                    chip_vendor:self.form.chip_vendor,
                    comment:self.form.comment
                };
                self.loading = true;
//                console.log(params);
                self.$axios.post(global_.baseUrl+'/devtype/add',params).then(function(res){
//                    console.log(res);
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message('添加成功');
                        self.getData();
                        self.dialogFormVisible = false;
                    }

                },function(err){
                    self.loading = false;
                    self.$message('添加失败');
                    console.log(err);
                })
            },
            delDev: function(id){
                var self = this;
                var params = {
                    _id: id
                };
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/devtype/del',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message('删除成功');
                        self.getData();
                    }

                },function(err){
                    self.loading = false;
                    console.log(err);
                })
            },
            handleCurrentChange:function(val){
                this.currentPage = val;
                this.getData({page_size:10,current_page:this.currentPage});
            },
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

