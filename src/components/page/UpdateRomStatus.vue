<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-upload"></i> 升级ROM详情</el-breadcrumb-item>
                <!--<el-breadcrumb-item>发起推送</el-breadcrumb-item>-->
            </el-breadcrumb>
        </div>
        <div class='rad-group mb40'>

            <div class="form-box tab-cont">
                <el-form :model="form0" ref="form0" label-width="150px">
                    <el-form-item label="路由响应信息" prop="desc">
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model="form0.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="抓取路由信息" prop="desc">
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model="form0.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="下发固件命令" prop="desc">
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model="form0.desc"></el-input>
                    </el-form-item>
                </el-form>
            </div>

        </div>


    </div>
</template>

<script>
    export default {
        data: function(){
            return {
                form0: {
                    desc: '',

                }
            }
        },
        created: function(){
//            this.getSysinfo()
        },
        methods: {
            getSysinfo: function(){
                var self = this;
                self.$axios({
                    method:'get',
                    headers: {'Content-Type': 'application/json'},
                    url:'http://api.rom.kunteng.org/device/sysinfo'
//                            data:{wx:'wlife'}
                }).then(function(response) {
                    console.log(response);
                },function(err){
                    console.log(err);
                });
            },
            handleClick:function(){

            },
            validateMac: function(rule,value,callback){
                var self = this;
                var reg_name=/^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/;
                var macarr = self.splitStr(value);
                for(var i= 0,len=macarr.length;i<len;i++){
                    if(!reg_name.test(macarr[i])){
                        callback(new Error('输入有误，以逗号或回车分隔'));
                    }else{
                        callback();
                    }
                }
            },
            //按逗号和回车分隔字符串
            splitStr: function(str){
                var temp = str.split(/[\n,]/g);
                for(var i =0;i<temp.length;i++){
                    if(temp[i] == ""){
                        temp.splice(i, 1);
                        //删除数组索引位置应保持不变
                        i--;
                    }
                }
                return temp;
            },
            onRomSubmit:function(formName) {
//                this.$message.success('提交成功！');
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
                    macs:self.splitStr(self.form0.desc),//数组格式
                    devnum:self.form0.devnum,
                    branch:self.form0.branch,
                    romversion:self.form0.romversion,
                    uptype:self.form0.uptype,
                    update:self.form0.update
                };
//                console.log(params);
                return false;
                self.$axios.get('urlstr',{params}).then(function(res){
//                    console.log(res);
                })

            },
            onPluginSubmit: function(formName){

            },
            onJavaSubmit: function(){}
        }
    }
</script>
<style>
    .mb40{margin-bottom:40px;}
    .tab-cont{padding:40px;/*border-top:1px solid #dfe6ec;*/}
    /*.textarea-mac{height:160px;}*/
</style>
