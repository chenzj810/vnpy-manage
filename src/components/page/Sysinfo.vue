<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-star-off"></i> 辅助工具</el-breadcrumb-item>
                <el-breadcrumb-item>路由SYSINFO查询</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='rad-group mb40'>
            <div class="form-box tab-cont">
                <el-form :model="form0" :inline="true" :rules="rules0" ref="form0" label-width="150px">
                    <el-form-item label="MAC地址" prop="route_mac">
                        <el-input v-model="form0.route_mac" class="diainp"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search('form0')" v-loading.fullscreen.lock="fullscreenLoading">查询</el-button>
                    </el-form-item>
                </el-form>
                <el-form :model="form1" ref="form1" label-width="150px">
                    <el-form-item label="结果" prop="router_mac">
                        <el-input type="textarea" :autosize="{ minRows: 16, maxRows: 26}" v-model="form1.result"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import global_ from 'components/common/Global';
    export default {
        data: function () {
            return {
                form0: {
                    route_mac: ''

                },
                form1:{
                    result:''
                },
                rules0: {
                    route_mac: [
                        {required: true, message: '请输入指定MAC', trigger: 'blur'},
                        {validator: this.validateMac, trigger: 'blur'}
                    ]

                },
                fullscreenLoading:false,
            }
        },
        created:function () {

        },
        methods: {
            search: function(formName){
                var self = this;
                self.$refs[formName].validate(function(valid){
                    if(valid){
                        // console.log('验证成功')
                        self.fullscreenLoading  = true;
                        var params = {
                            route_mac:self.form0.route_mac
                        };
                        // self.$axios.defaults.withCredentials = true;
                        self.$axios.post(global_.baseUrl+'/manage/sysinfo',params).then(function(res){
                            // console.log(res);
                            self.fullscreenLoading  = false;
                            self.loading = false;
                            if(res.data.ret_code == 0){
                                self.form1.result = res.data.extra;
                            }else{
                                self.$message.error(res.data.extra);
                            }

                        },function(err){
                            self.$message.error('操作失败');
                            self.fullscreenLoading  = false;
                        })

                    }else{
                        console.log('验证失败');
                        return false;
                    }
                });

            },
            validateMac: function (rule, value, callback) {
                var self = this;
                var reg_name = /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/;
                var reg_name2 = /^[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}$/;
                if (!reg_name.test(value) && !reg_name2.test(value)) {
                    callback(new Error('输入有误'));
                } else {
                    callback();
                }
            },
        }
    }
</script>
<style>
    .mb40 {margin-bottom: 40px;}
    .tab-cont {padding: 40px; /*border-top:1px solid #dfe6ec;*/}
    .diainp{width:217px;}
    .inp100{width:100px;}
</style>
