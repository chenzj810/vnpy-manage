<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-upload"></i> 批量执行任务</el-breadcrumb-item>
                <el-breadcrumb-item>执行结果</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class=''>
            <div class="handle-box2 rad-group">
                <el-input v-model="select_word" placeholder="请输入任务ID" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
        </div>
        <el-table :data="tableData2" border style="width: 100%" ref="multipleTable">
            <!--<el-table-column type="selection" width="55"></el-table-column>-->
            <el-table-column prop="wcsj" label="完成时间" width="180"></el-table-column>
            <el-table-column prop="lymac" label="路由MAC" width="140"></el-table-column>
            <el-table-column prop="sbzt" label="设备状态" width="100">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.sbzt == 'online' ? 'success' : 'warning'" close-transition>{{scope.row.sbzt == 'online'?'在线': (scope.row.sbzt == 'offline'?'离线':'未知')}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="zdmac" label="之前版本" width="140"></el-table-column>
            <el-table-column prop="sjfs" label="更新后版本" width="120"></el-table-column>
            <el-table-column prop="czr" label="推送人" width="100"></el-table-column>
            <el-table-column prop="sjzt" label="升级状态" width="100">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.sjzt == 'success' ? 'success' : 'danger'" close-transition>{{scope.row.sjzt == 'success'?'成功': (scope.row.sjzt == 'fail'?'失败':'未知')}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button class="btn1" type="info" size="small" @click="handleEdit(scope.row.lymac)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>


    </div>
</template>

<script>
    import axios from 'axios';
    import Datasource from 'vue-datasource';
    export default {
        data: function(){
            const self = this;
            return {
                url: './static/datasource.json',
                information: {
                    pagination:{},
                    data:[]
                },
                columns: [
                    {
                        name: 'Id',
                        key: 'id',
                    },
                    {
                        name: 'Name',
                        key: 'name',
                    },
                    {
                        name: 'email',
                        key: 'email',
                    },
                    {
                        name: 'ip',
                        key: 'ip',
                    }
                ],
                actions: [
                    {
                        text: 'Click',
                        class: 'btn-primary',
                        event: function(e, row) {
                            self.$message('选中的行数： ' + row.row.id)
                        }
                    }
                ],
                query:'',

                radio3:'ROM升级',

                tableData2:[
                    {
                        "wcsj":"2017-11-28 18:18:29",
                        "lymac":"D4EE71263AA",
                        "sbzt":"online",
                        "rwid":"01029",
                        "zdmac":"D4EE71263AA",
                        "sjfs":"实时自动",
                        "sjzt":"fail",
                        "czr":"王集",
                    },
                    {
                        "wcsj":"2017-11-28 18:18:29",
                        "lymac":"D4EE71263AA",
                        "sbzt":"offline",
                        "sj":"2017-11-28 18:18:29",
                        "rwid":"01029",
                        "zdmac":"D4EE71263AA",
                        "sjfs":"实时自动",
                        "sjzt":"success",
                        "czr":"王集",
                    },
                    {
                        "wcsj":"2017-11-28 18:18:29",
                        "lymac":"D4EE71263AA",
                        "sbzt":"online",
                        "sj":"2017-11-28 18:18:29",
                        "rwid":"01029",
                        "sjfs":"实时自动",
                        "sjzt":"fail",
                        "czr":"王集",
                    },
                    {
                        "wcsj":"2017-11-28 18:18:29",
                        "lymac":"D4EE71263AA",
                        "sbzt":"online",
                        "sj":"2017-11-28 18:18:29",
                        "rwid":"01029",
                        "zdmac":"D4EE71263AA",
                        "sjfs":"实时自动",
                        "sjzt":"fail",
                        "czr":"王集",
                    }
                ],
                select_word:''

            }
        },
        components: {
//            Datasource
        },
        methods: {
            handleEdit: function(mac){
                this.$router.push('/updateromstatus');
            },
            test: function(event){
                console.log(event);
            },
            arraySpanMethod: function(row, column, rowIndex, columnIndex){
                if (rowIndex % 2 === 0) {
                    if (columnIndex === 0) {
                        return [1, 2];
                    } else if (columnIndex === 1) {
                        return [0, 0];
                    }
                }
            },
            changeTab: function(){
                console.log(this.radio3);
//                this.$message('选择'+ this.radio3);
            },
            search: function(){

            },
            handleCurrentChange:function(val){
//                this.cur_page = val;
//                this.getData();
            },
            changePage:function(values) {
                this.information.pagination.per_page = values.perpage;
                this.information.data = this.information.data;
            },
            onSearch:function(searchQuery) {
                this.query = searchQuery;
            }
        },
        computed:{
            getData:function(){
                const self = this;
                return self.information.data.filter(function (d) {
                    if(d.name.indexOf(self.query) > -1){
                        return d;
                    }
                })
            }
        },
        beforeMount:function(){
            var self = this;
            if(process.env.NODE_ENV === 'development'){
                this.url = '/ms/table/source';
            };
            axios.get(this.url).then(function(res){
                self.information = res.data;
            })
        }
    }
</script>

<style src="../../../static/css/datasource.css"></style>
<style>
    .rad-group{margin-bottom:20px;}
    .handle-input{  width: 300px;  display: inline-block;  }
    .handle-box2{display:inline-block;float:right;}
</style>
