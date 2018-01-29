<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-star-on"></i>TASK管理</el-breadcrumb-item>
                <el-breadcrumb-item>TASK列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box rad-group">
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="dialogFormVisible=true">创建任务</el-button>
        </div>
        <el-table :data="task_list" border style="width: 100%" ref="multipleTable" v-loading="loading">
            <el-table-column prop="task_id" label="任务ID" width="80"></el-table-column>
            <el-table-column prop="stock_code" label="股票代码" width="120"></el-table-column>
            <el-table-column prop="stock_name" label="股票名称" width="120"></el-table-column>
            <el-table-column prop="obj_amount" label="交易数量" width="120"></el-table-column>
            <el-table-column prop="strategy_name" label="策略名称" width="170"></el-table-column>
            <el-table-column prop="riskctrl_name" label="风控名称" width="170"></el-table-column>
            <el-table-column prop="gateway_name" label="交易接口" width="170"></el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button class="btn1" type="text" size="small" @click="delTask(scope.row._id,scope.row.task_id)">删除</el-button>
                    <el-button class="btn1" type="danger" size="small" v-if="scope.row.rom_status =='normal'" @click="revokeRom(scope.row._id,scope.row.file_name)">停止</el-button>
                    <el-button class="btn1" type="success" size="small" v-else @click="releaseRom(scope.row._id,scope.row.file_name)">启动</el-button>
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

        <el-dialog title="添加交易任务" :visible.sync="dialogFormVisible" class="digcont">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="股票代码" prop=stock_code :label-width="formLabelWidth">
                    <el-input v-model="form.stock_code" class="diainp" auto-complete="off" @change="getStockName"></el-input>
                </el-form-item>
                <el-form-item label="股票名称" prop=stock_name :label-width="formLabelWidth">
                    <el-input v-model="form.stock_name" class="diainp" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="交易数量" prop=obj_amount :label-width="formLabelWidth">
                    <el-input v-model="form.obj_amount" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="策略名称" prop="strategy_name" :label-width="formLabelWidth">
                    <el-select v-model="form.strategy_name" placeholder="请选择对应策略">
                        <el-option
                            v-for="item in strategy_list"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="风控名称" prop="riskctrl_name" :label-width="formLabelWidth">
                    <el-select v-model="form.riskctrl_name" placeholder="请选择对应风控">
                        <el-option
                            v-for="item in riskctrl_list"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交易接口" prop="gateway_name" :label-width="formLabelWidth">
                    <el-select v-model="form.gateway_name" placeholder="请选择对应交易接口">
                        <el-option
                            v-for="item in gateway_list"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
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
    var qs = require('qs');
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
                    task_id:'',
                    obj_amount:'',
                    stock_code:'',
                    stock_name:'',
                    strategy_name:'',
                    riskctrl_name: '',
                    gateway_name: ''
                },

                formLabelWidth: '120px',
                fileList3: [],
                loading:false,
                fullscreenLoading: false,
                task_list:[],
                strategy_list:[],
                riskctrl_list:[],
                gateway_list:[],
                valid_stock_list:[]

            }
        },
        created: function(){
            this.getTaskList();
            /*
            this.getStrategyList();
            this.getRiskCtrlList();
            this.getGatewayList();
            */
            //this.getValidStockList();
        },
        methods: {
            getTaskList: function(){//获取task列表
                var self = this;
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/task/list').then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.pageTotal = res.data.extra.length;
                        self.task_list = res.data.extra.slice(0,10);
                    }
                    else{
                        self.task_list = []
                    }
                })
            },
            getStrategyList: function(){//获取rom列表
                var self = this;
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/strategy/list').then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.strategy_list = res.data.extra;
                    }
                })
            },
            getRiskCtrlList: function(){//获取设备类型
                var self = this;
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/riskctrl/list').then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.riskctrl_list = res.data.extra;
                    }
                })
            },
            getGatewayList: function(){//获取设备类型
                var self = this;
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/gateway/list').then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.gateway_list = res.data.extra;
                    }
                })
            },
            getValidStockList: function(){//获取设备类型
                var self = this;
                self.loading = false;
                self.$axios.post(global_.baseUrl+'/stock/list').then(function(res){
                    //self.loading = false;
                    if(res.data.ret_code == 0){
                        self.valid_stock_list = res.data.extra;
                    }
                })
            },
            getStockName: function(){//获取设备类型
                var self = this;
                if (self.form.stock_code.length < 6){
                    self.form.stock_name = '';
                    return;
                }

                var params = {stock_code:self.form.stock_code}
                self.loading = false;
                self.$axios.post(global_.baseUrl+'/stock/name', qs.stringify(params)).then(function(res){
                    //self.loading = false;
                    if(res.data.ret_code == 0){
                        self.form.stock_name = res.data.extra;
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

                var params = {
                    stock_code:self.form.stock_code,
                    stock_name:self.form.stock_name,
                    obj_amount:self.form.obj_amount,

                    strategy_name:self.form.strategy_name,
                    riskctrl_name:self.form.riskctrl_name,
                    gateway_name:self.form.gateway_name
                };

                self.loading = true;
                self.$axios.post(global_.baseUrl+'/task/add',qs.stringify(params), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function(res){
                    self.loading = false;
                    console.log(res);
                    if(res.data.ret_code == 0){
                        self.$message('添加成功');
                        self.getData();
                    }

                },function(err){
                    self.$message('添加失败');
                    self.loading = false;
                    console.log(err);
                })

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
            delTask: function(id,task_id){//删除
                var self = this;
                var params = {
                    task_id:task_id
                };
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/task/del',qs.stringify(params)).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.$message('删除成功');
                        self.getTaskList();
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
