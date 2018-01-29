<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-setting"></i> 设备管理</el-breadcrumb-item>
                <el-breadcrumb-item>设备状态</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='rad-group'>
            <el-radio-group v-model="radio3" @change="changeTab">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="online">在线</el-radio-button>
                <el-radio-button label="offline">离线</el-radio-button>
            </el-radio-group>
            <div class="handle-box2">
                <el-input v-model="search_word" placeholder="请输入设备MAC" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
        </div>

        <el-table :data="listData" border style="width: 100%" ref="multipleTable" v-loading="loading">
            <el-table-column prop="update_time" label="更新时间" width="180"></el-table-column>
            <el-table-column prop="status" label="状态" width="100":filters="[{ text: '在线', value: 'online' }, { text: '离线', value: 'offline' }]" :filter-method="filterTag">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status == 'offline' ? 'warning' : 'success'" close-transition>{{scope.row.status == 'online'?'在线':(scope.row.status == 'inactive'?'未激活':'离线')}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="mac" label="路由Mac" width="180"></el-table-column>
            <el-table-column prop="dev_type" label="设备型号" width="150"></el-table-column>
            <el-table-column prop="rom_verion" label="固件版本" width="150"></el-table-column>
            <el-table-column prop="box51_status" label="51盒子状态" width="120">
                <template slot-scope="scope">
                    <el-tag type="warning" class="orange">{{scope.row.box51_status == 'default'?'未知':'离线'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="printer_status" label="打印机状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.printer_status == 'default'?'warning': 'success'">{{scope.row.printer_status == 'default'?'未知': '离线'}}</el-tag>
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

    </div>
</template>

<script>
    import global_ from 'components/common/Global';
    export default {
        data: function(){
            const self = this;
            return {
                radio3:'all',
                tableData2:[
                    {
                        "zt":"离线",
                        "lymac":"D4ee073BB0E0",
                        "sbxh":"zc9525a",
                        "gjbb":"1.08.1659",
                        "hzzt":0,
                        "dyjzt":"online",
                        "gl":"无线信息"
                    },
                    {
                        "zt":"未激活",
                        "lymac":"D4ee073BB0E0",
                        "sbxh":"9525a",
                        "gjbb":"1.03.599",
                        "hzzt":0,
                        "dyjzt":"offline",
                        "gl":"无线信息"
                    },
                    {
                        "zt":"离线",
                        "lymac":"D4ee073BB0E0",
                        "sbxh":"zc9525a",
                        "gjbb":"1.08.1659",
                        "hzzt":0,
                        "dyjzt":"offline",
                        "gl":"无线信息"
                    }

                ],
                search_word:'',

                loading:false,
                pageTotal:0,
                listData:[],
                currentPage:1

            }
        },
        created: function(){
            this.getData({},'');
        },
        methods: {
            getData: function(params,url){
                var self = this;
                self.loading = true;
                // var params = {
                //    page_size:10,
                //    current_page:1,
                //    sort:'asc'
                // };
                self.$axios.post(global_.baseUrl+'/device/list'+url ,params).then(function(res){
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
            changeTab: function(){
                var url = '';
                if(this.radio3 == 'all'){
                    url = '';
                }else{
                    url = '/'+this.radio3;
                }
                this.getData({},url);
            },
            handleCurrentChange:function(val){
                this.currentPage = val;
                console.log(this.radio3,this.currentPage);
                var url = '';
                if(this.radio3 == 'all'){
                    url = '';
                }else{
                    url = '/'+this.radio3;
                }
                this.getData({page_size:10,current_page:this.currentPage},url);
            },
            search: function(){
                var self = this;
                var reg_name = /^[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}:[A-Fa-f\d]{2}$/;
                var reg_name2 = /^[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}[A-Fa-f\d]{2}$/;
                if(self.search_word == ''){
                    self.$message({message:'输入不能为空',type:'warning'});
                    return false;
                }
                if(!reg_name.test(self.search_word) && !reg_name2.test(self.search_word)){
                    self.$message({message:'设备MAC输入有误',type:'warning'});
                    return false;
                }
                self.loading = true;
                var params = {
                    filter:{"mac":self.search_word}
                };
                self.$axios.post(global_.baseUrl+'/device/list',params).then(function(res){
                    self.loading = false;
                    if(res.data.ret_code == 0){
                        self.pageTotal = res.data.extra.length;
                        self.listData = res.data.extra.slice(0,10);
                    }
                })

            },
            filterTag:function(value, row) {
                return row.status == value;
            }
        }
    }
</script>
<style>
    .rad-group{margin-bottom:20px;}
    .handle-input{  width: 300px;  display: inline-block;  }
    .handle-box2{display:inline-block;float:right;}
    .orange{color:#eb9e05;background:none;}
</style>
