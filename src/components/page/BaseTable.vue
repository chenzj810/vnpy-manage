<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 渠道管理</el-breadcrumb-item>
                <el-breadcrumb-item>渠道列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="plus" class="handle-del mr10" @click="dialogFormVisible=true">新建用户</el-button>
            <el-input v-model="search_word" placeholder="请输入渠道名称或账号查找" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">查询</el-button>
        </div>
        <div class='rad-group'>
            <el-radio-group v-model="radio3" @change="changeTab">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button label="未冻结"></el-radio-button>
                <el-radio-button label="已冻结"></el-radio-button>
            </el-radio-group>
        </div>
        <el-table :data="userData" border style="width: 100%" ref="multipleTable" :empty-text="emptyMsg" v-loading="loading">
            <el-table-column prop="user_account" label="账 号" width="150"></el-table-column>
            <el-table-column prop="user_name" label="渠道名称" width="110"></el-table-column>
            <el-table-column prop="user_phone" label="联系电话" width="130"></el-table-column>
            <el-table-column prop="user_status" label="冻结状态" width="120" :filters="[{ text: '已冻结', value: '1' }, { text: '未冻结', value: '0' }]" :filter-method="filterTag">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.user_status == '1' ? 'warning' : 'success'" close-transition>{{scope.row.user_status=='1'?'已冻结':'未冻结'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="渠道类型" width="140">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.user_type == '0' ? 'danger' : 'info'" close-transition>{{scope.row.user_type == '0'?'超级管理员':'管理员'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="user_create_time" label="创建时间" width="150"></el-table-column>
            <el-table-column label="在线设备" width="100">
                <template slot-scope="scope">
                    <el-tag type="warning">{{scope.row.user_online_count + '/ ' + scope.row.user_device_count}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="240" fixed="right">
                <template slot-scope="scope">
                    <el-button class="btn1" size="small" type="text" @click="resetPwd(scope.row.user_account)">修改密码</el-button>
                    <el-button class="btn1" size="small" type="text" @click="toRouter(scope.row.user_id)">导入路由</el-button>
                    <el-button class="btn1" size="small" v-if="scope.row.user_status =='0'" @click="revoke(scope.row.user_account)" :type="scope.row.user_status == '1' ? 'warning' : 'danger'">冻结账户</el-button>
                    <el-button class="btn1" size="small" v-else @click="restore(scope.row.user_account)" :type="scope.row.user_status == '1' ? 'warning' : 'danger'">解冻账户</el-button>
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
        <el-dialog title="修改密码" :visible.sync="showDialogPwd" class="digcont">
            <el-form :model="formP" ref="formP" :rules="rulesP">
                <el-form-item label="密码" prop="user_password" :label-width="formLabelWidth">
                    <el-input v-model="formP.user_password" type="password" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="user_new_password" :label-width="formLabelWidth">
                    <el-input v-model="formP.user_new_password" type="password" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="user_validate_password" :label-width="formLabelWidth">
                    <el-input v-model="formP.user_validate_password" type="password" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showDialogPwd = false">取 消</el-button>
                <el-button type="primary" @click="savePwdChange('formP')" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="新建子渠道" :visible.sync="dialogFormVisible" class="digcont">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="账号" prop="user" :label-width="formLabelWidth">
                    <el-input v-model="form.user" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
                    <el-input v-model="form.password" type="password" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="渠道名称" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="form.name" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="tel" :label-width="formLabelWidth">
                    <el-input v-model="form.tel" class="diainp" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" :label-width="formLabelWidth">
                    <el-select size="small" style="width: 110px"
                               v-model="form.selectProv"
                               placeholder="请选择省份"
                               v-on:change="getProv($event)">
                        <el-option
                            v-for="item in provs"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select size="small" style="width: 104px"
                               v-if="form.selectProv!=''"
                               v-model="form.selectCity"
                               placeholder="请选择城市"
                               v-on:change="getCity($event)">
                        <el-option
                            v-for="item in citys"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="" :label-width="formLabelWidth">
                    <el-input v-model="form.addr" class="diainp2" auto-complete="off" placeholder="请输入详细地址"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveCreate('form')">创 建</el-button>
            </div>
        </el-dialog>

        <el-dialog title="导入路由" :visible.sync="showRouterDialog" class="digcont">
            <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                <el-tab-pane label="文件上传" name="1">
                    <div class="mb30">
                        路由导入模板.xls
                        <a href="http://cloud.kunteng.org/yunac/static/tmp/routers.xls" target="_blank">
                            <el-button class="btn1" size="small" type="primary">下载</el-button>
                        </a>
                    </div>
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        :auto-upload="false">
                        <div>
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                        </div>
                        <div slot="tip" style="margin-top:20px;" class="el-upload__tip">只能上传XXX文件，且不超过500kb</div>
                    </el-upload>
                    <div class="mt30">
                        <el-button @click="showDialog = false">取 消</el-button>
                        <el-button type="primary" @click="showDialog = false">保 存</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="手动导入" name="2">
                    <div style="margin-bottom:16px;">*批量添加功能MAC之间以换行分割，每行一个MAC；MAC格式为12位字母或数字组合，不区分大小写:</div>
                    <el-form :model="formRouter2" ref="formRouter2" :rules="rulesRouter2">
                        <el-form-item prop="route_mac">
                            <el-input
                                type="textarea"
                                :rows="5"
                                placeholder="请输入内容"
                                v-model="formRouter2.route_mac">
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <div class="mt30">
                        <el-button @click="showRouterDialog = false">取 消</el-button>
                        <el-button type="primary" @click="saveToRouterChange('formRouter2')">保 存</el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>

    </div>
</template>

<script>
    import global_ from 'components/common/Global';
    export default {
        data: function() {
            return {
                radio3:'全部',
                dialogFormVisible: false,
                form: {
                    user:'',
                    password:'',
                    name: '',
                    tel:'',
                    selectProv: '',
                    selectCity: '',
                    addr:'',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                rules: {
                    user:[
                        {required: true, message: '请输入账号', trigger: 'blur'}
                    ],
                    password:[
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {validator:this.validatePwd,trigger:'blur'}
                    ],
                    name:[
                        {required: true, message: '请输入渠道名称', trigger: 'blur'}
                    ],
                    tel:[
                        {required: true, message: '请输入联系电话', trigger: 'blur'},
                        {validator:this.validateTel,trigger:'blur'}
                    ]
                },
                formLabelWidth: '120px',
                provs:global_.provs,
                citys: [],
                showRouterDialog:false,
                radiotoRout:'文件上传',
                fileList:[{name: '路由器导入模板.xls', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
                search_word:'',
                activeName2:'2',
                textarea_macs:'',

                userData:[],
                loading:false,
                pageTotal:0,
                currentPage:1,
                emptyMsg:'暂无数据',
                formP:{
                    user_account:localStorage.getItem('ms_username'),
                    user_password:'',
                    user_new_password:'',
                    user_validate_password:''
                },
                rulesP: {
                    user_password:[
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    user_new_password:[
                        {required: true, message: '请输入新密码', trigger: 'blur'}
                    ],
                    user_validate_password:[
                        {required: true, message: '请输入确认密码', trigger: 'blur'},
                        {validator:this.validateRepwd,trigger:'blur'}
                    ]
                },
                showDialogPwd: false,
                curAccount:'',
                curUserid:'',
                fullscreenLoading: false,
                formRouter2:{route_mac:''},
                rulesRouter2: {
                    route_mac: [
                        {required: true, message: '请输入MAC', trigger: 'blur'},
                        {validator: this.validateMac, trigger: 'blur'}
                    ]
                },
            }
        },
        created: function(){
           this.getUsers({});
        },
        methods: {
            getUsers: function(params){//获取渠道列表
                var self = this;
                self.$axios.get(global_.baseUrl+'/admin/all',params).then(function(res){
                    // console.log(res.data);
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == '1003'){
                        self.emptyMsg = res.data.extra;
                    }
                    if(res.data.ret_code == 0){
                        if(JSON.stringify(params) == '{}'){
                            self.pageTotal = res.data.data.length;
                            self.userData = res.data.data.slice(0,10);
                        }else{
                            self.userData = res.data.data;
                        }
                    }
                })
            },
            revoke: function(account){//冻结操作
                var self = this;
                var params = {
                    user_account:account
                };
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/admin/revoke',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 1){
                        self.$message({message:res.data.extra,type:'warning'});
                    }
                    if(res.data.ret_code == 0){
                        self.$message({message:res.data.extra,type:'success'});
                        self.getUsers();
                    }

                },function(err){
                    self.$message.error('操作失败');
                    self.loading = false;
                    console.log(err);
                })

            },
            restore: function(account){//解冻操作
                var self = this;
                var params = {
                    user_account:account
                };
                self.loading = true;
                self.$axios.post(global_.baseUrl+'/admin/restore',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.$message({message:res.data.extra,type:'success'});
                        self.getUsers();
                    }

                },function(err){
                    self.$message.error('操作失败');
                    self.loading = false;
                    console.log(err);
                })

            },
            saveCreate: function(formName){
                let self = this;
                self.$refs[formName].validate(function(valid){
                    if(valid){
                        console.log('验证成功')
                    }else{
                        return false;
                        console.log('验证失败');
                    }
                    let params = {
                        user_account:self.form.user,
                        user_password:self.form.password,
                        user_name:self.form.name,
                        user_phone:self.form.tel,
                        user_city:self.form.selectProv+self.form.selectCity+self.form.addr
                    };
                    self.$axios.post(global_.baseUrl + '/admin/register',params).then(function(res){
                        if(res.data.ret_code == '1001'){
                            self.$message({message:res.data.extra,type:'warning'});
                            setTimeout(function(){
                                self.$router.replace('login');
                            },2000)
                        }
                        if(res.data.ret_code == 0){
                            self.$message('注册成功！');
                            self.dialogFormVisible = false;
                            self.getUsers({});
                        }else{
                            self.$message(res.data.extra);
                        }
                    })

                });

            },
            search: function(){
                var self = this;
                if(self.search_word == ''){
                    self.$message({message:'输入不能为空',type:'warning'});
                    return false;
                }
                self.loading = true;
                var params = {
                    user:self.search_word
                };
                self.$axios.post(global_.baseUrl+'/admin/query',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == '1003'){
                        self.emptyMsg = res.data.extra;
                    }
                    if(res.data.ret_code == 0){
                        if(JSON.stringify(params) == '{}'){
                            self.pageTotal = res.data.data.length;
                            self.userData = res.data.data.slice(0,10);
                        }else{
                            self.userData = res.data.data;
                        }
                    }
                    if(res.data.ret_code == 0){
                        self.pageTotal = res.data.extra.length;
                        self.listData = res.data.extra.slice(0,10);
                    }
                })

            },
            resetPwd: function(account){
                var self = this;
                self.showDialogPwd = true;
                self.curAccount = account;
            },
            savePwdChange: function(formName){
                var self = this;
                self.$refs[formName].validate(function(valid){
                    if(valid){
                        var params = {
                            user_account: self.curAccount,
                            user_password:self.formP.user_password,
                            user_new_password: self.formP.user_new_password
                        };
                        self.fullscreenLoading  = true;
                        self.$axios.post(global_.baseUrl+'/admin/change',params).then(function(res){
                            self.fullscreenLoading  = false;
                            if(res.data.ret_code == '1001'){
                                self.$message({message:res.data.extra,type:'warning'});
                                setTimeout(function(){
                                    self.$router.replace('login');
                                },2000)
                            }
                            if(res.data.ret_code == 0){
                                self.showDialogPwd = false;
                                self.$message({message:res.data.extra,type:'success'})
                            }else{
                                self.$message.error(res.data.extra);
                            }
                        },function(err){
                            self.fullscreenLoading  = false;
                            self.$message.error(err);
                        })
                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                })


            },
            toRouter: function(userid){
                var self = this;
                self.showRouterDialog = true;
                self.curUserid = userid;
            },
            saveToRouterChange: function(formName){
                var self = this;
                self.$refs[formName].validate(function(valid){
                    if(valid){
                        var params = {
                            user_id: self.curUserid,
                            route_mac:self.formRouter2.route_mac
                        };
                        self.fullscreenLoading  = true;
                        self.$axios.post(global_.baseUrl+'/device/import',params).then(function(res){
                            self.fullscreenLoading  = false;
                            if(res.data.ret_code == '1001'){
                                self.$message({message:res.data.extra,type:'warning'});
                                setTimeout(function(){
                                    self.$router.replace('login');
                                },2000)
                            }
                            if(res.data.ret_code == 0){
                                self.showDialogPwd = false;
                                self.$message({message:'导入成功',type:'success'})
                            }else{
                                self.$message.error(res.data.extra);
                            }
                        },function(err){
                            self.fullscreenLoading  = false;
                            self.$message.error(err);
                        })
                    }else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            validateRepwd: function(rule,value,callback){
                if(value !== this.formP.user_new_password){
                    callback(new Error('两次输入密码不一致'));
                }else{
                    callback();
                }
            },
            validateUser: function(rule,value,callback){
                if(value === ''){
                    callback(new Error('请输入账号'))
                }else{
                    callback();
                }
            },
            validatePwd: function(rule,value,callback){
                if(value === ''){
                    callback(new Error('请输入密码'))
                }else{
                    callback();
                }
            },
            validateTel:function(rule,value,callback){
                var regTel3 = /(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value);
                if(!regTel3){
                    callback(new Error('电话号码输入有误！'))
                }else{
                    callback();
                }
            },
            validateMac: function (rule, value, callback) {
                var self = this;
                var reg_name = /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/;
                var reg_name2 = /^[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}$/;
                var macarr = self.splitStr(value);
                for (var i = 0, len = macarr.length; i < len; i++) {
                    if (!reg_name.test(macarr[i]) && !reg_name2.test(macarr[i])) {
                        callback(new Error('输入有误，以逗号或回车分隔'));
                    } else {
                        callback();
                    }
                }
            },
            //按逗号和回车分隔字符串
            splitStr: function (str) {
                var temp = str.split(/[\n,]/g);
                for (var i = 0; i < temp.length; i++) {
                    if (temp[i] == "") {
                        temp.splice(i, 1);
                        //删除数组索引位置应保持不变
                        i--;
                    }
                }
                return temp;
            },
            handleClick:function(tab,event){

            },
            getProv: function(prov){
                let tempCity=[];
                this.citys=[];
                this.selectCity='';
                let allCity=global_.allCity;
                for (var val of allCity){
                    if (prov == val.prov){
                        console.log(val);
                        tempCity.push({label: val.label, value: val.label})
                    }
                }
                this.citys = tempCity;
            },
            getCity: function (city) {
                console.log(city);
                console.log(this.selectCity)
            },
            changeTab: function(){
                console.log(this.radio3);
                this.$message('选择'+ this.radio3);
            },
            submitUpload:function() {
                console.log('上传到服务器');
                this.$refs.upload.submit();
            },
            handleRemove:function(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview:function(file) {
                console.log(file);
            },
            handleCurrentChange:function(val){
                this.currentPage = val;
                this.getUsers({page_size:10,current_page:this.currentPage});
            },
            filterTag:function(value, row) {
                return row.user_status == value;
            }
        }
    }
</script>

<style scoped>
    .handle-box{  margin-bottom: 20px;  }
    .handle-select{  width: 120px;  }
    .handle-input{  width: 300px;  display: inline-block;  }
    .rad-group{margin-bottom:20px;}
    .btn1{margin-bottom:5px;margin-top:5px;/*margin-left:0;*/}
    /*.digcont{width:600px;}*/
    .diainp{width:217px;}
    .diainp2{width:400px;}
    .upload-demo{}
    .mb30{margin-bottom:30px;}
    .mt30{margin-top:30px;}
</style>
