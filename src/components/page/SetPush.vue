<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-upload"></i> 批量执行任务</el-breadcrumb-item>
                <el-breadcrumb-item>发起推送</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='rad-group mb40'>
            <el-tabs v-model="task_type" type="card" @tab-click="handleClick">
                <el-tab-pane label="升级ROM" name="1">
                    <div class="form-box tab-cont">
                        <el-form :model="form0" :rules="rules0" ref="form0" label-width="150px">
                            <el-form-item label="输入指定MAC" prop="router_mac">
                                <el-input type="textarea" v-model="form0.router_mac"></el-input>
                            </el-form-item>
                            <el-form-item label="选择设备型号" prop="dev_type">
                                <el-select v-model="form0.dev_type" placeholder="请选择" @change="changeDev">
                                    <el-option v-for="item in typeListData" :key="item" :label="item" :value="item"></el-option>
                                    <!--<el-option v-for="item in ListData" :key="item.dev_type" :label="item.dev_type" :value="item.dev_type"></el-option>-->
                                </el-select>
                            </el-form-item>
                            <el-form-item label="选择ROM版本" prop="dest_version">
                                <el-select v-model="form0.dest_version" placeholder="请选择" @change="changeRom">
                                    <el-option
                                        v-for="item in romListData"
                                        :key="item.rom_version"
                                        :label="item.rom_version"
                                        :value="item.rom_version">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="所选文件">
                                <el-input v-model="form0.firmware_file" class="diainp2" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="升级方式" prop="upgrade_mode">
                                <el-radio-group v-model="form0.upgrade_mode" @change="changeUpgrade">
                                    <el-radio label="1">实时自动升级</el-radio>
                                    <el-radio label="2">用户自动升级</el-radio>
                                    <el-radio label="3">定时自动升级(整点时刻)</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="配置更新" prop="reflash">
                                <el-radio-group v-model="form0.reflash">
                                    <el-radio label="0">保留用户原有配置</el-radio>
                                    <el-radio label="1">更改用户原有配置(慎选)</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="超时时间" prop="expired_time">
                                <el-input v-model="form0.expired_time" :disabled="form0.isTime" class="inp100"></el-input>
                                <a>&nbsp;小时</a>
                            </el-form-item>
                            <el-form-item label="操作人" prop="operator_name">
                                <el-input v-model="form0.operator_name" class="diainp"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onRomSubmit('form0')" v-loading.fullscreen.lock="fullscreenLoading">执行</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="安装插件" name="2">

                    <div class="form-box tab-cont">
                        <el-form :model="form1" :rules="rules1" ref="form1" label-width="150px">
                            <el-form-item label="输入指定MAC" prop="route_mac">
                                <el-input class="textarea-mac" type="textarea" v-model="form1.route_mac"
                                          placeholder="以换行符分割，最多输入100条mac"></el-input>
                            </el-form-item>
                            <el-form-item label="选择要安装的插件" prop="pkg_str_name">
                                <el-select v-model="form1.pkg_str_name" placeholder="请选择" @change="changePlugin">
                                    <el-option
                                        v-for="item in pluginListData"
                                        :key="item.pkg_str_name"
                                        :label="item.pkg_str_name"
                                        :value="item.pkg_str_name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="选择插件的版本" prop="pkg_version">
                                <el-select v-model="form1.pkg_version" placeholder="请选择">
                                    <el-option
                                        v-for="item in pVerlist"
                                        :key="item.pkg_version"
                                        :label="item.pkg_verion"
                                        :value="item.pkg_version">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="操作人" prop="logo">
                                <el-input v-model="form1.logo" class="diainp"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onPluginSubmit('form1')">安装</el-button>
                                <!--<el-button>取消</el-button>-->
                            </el-form-item>
                        </el-form>
                    </div>

                </el-tab-pane>
                <el-tab-pane label="推送脚本" name="3">

                    <div class="form-box tab-cont">
                        <el-form ref="form" :model="form2" :rules="rules2" label-width="150px">
                            <el-form-item label="输入指定MAC" prop="mac">
                                <el-input class="textarea-mac" type="textarea" v-model="form2.mac"
                                          placeholder="以换行符分割，最多输入100条mac"></el-input>
                            </el-form-item>
                            <el-form-item label="选择要安装的脚本" prop="plug">
                                <el-select v-model="form2.plug" placeholder="请选择">
                                    <el-option key="apbridge" label="apbridge" value="bbk"></el-option>
                                    <el-option key="apfree_wifidog" label="apfree_wifidog" value="xtc"></el-option>
                                    <el-option key="apmodectl" label="apmodectl" value="imoo"></el-option>
                                    <el-option key="apmodectl_wd" label="apmodectl_wd" value="imoo"></el-option>
                                    <el-option key="cloudPlugin" label="cloudPlugin" value="imoo"></el-option>
                                    <el-option key="frpc" label="frpc" value="imoo"></el-option>
                                    <el-option key="jsInjector" label="jsInjector" value="imoo"></el-option>
                                    <el-option key="kt-base-files" label="kt-base-files" value="imoo"></el-option>
                                    <el-option key="luasocket" label="luasocket" value="imoo"></el-option>
                                    <el-option key="mosquitto" label="mosquitto" value="imoo"></el-option>
                                    <el-option key="jsInjector" label="jsInjector" value="imoo"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="选择脚本的版本" prop="version">
                                <el-select v-model="form2.version" placeholder="请选择">
                                    <el-option key="apbridge" label="0.7.22" value="bbk"></el-option>
                                    <el-option key="apfree_wifidog" label="apfree_wifidog" value="xtc"></el-option>
                                    <el-option key="apmodectl" label="apmodectl" value="imoo"></el-option>
                                    <el-option key="apmodectl_wd" label="apmodectl_wd" value="imoo"></el-option>
                                    <el-option key="cloudPlugin" label="cloudPlugin" value="imoo"></el-option>
                                    <el-option key="frpc" label="frpc" value="imoo"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="操作人" prop="name">
                                <el-input v-model="form2.name" class="diainp"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onJavaSubmit('form2')">安装</el-button>
                                <!--<el-button>取消</el-button>-->
                            </el-form-item>
                        </el-form>
                    </div>

                </el-tab-pane>
            </el-tabs>


        </div>


    </div>
</template>

<script>
    import global_ from 'components/common/Global';
    var crypto = require('crypto');
    export default {
        data: function () {
            return {
                form0: {
                    router_mac: '',
                    dev_type: '',
                    dest_version: '',
                    firmware_file:'',
                    firmware_md5:'',
                    upgrade_mode: '1',
                    reflash:'0',
                    operator_name: '',
                    expired_time:'0',
                    isTime: true
                },
                typeListData:[],
                ListData:[],
                romListData:[],
                rules0: {
                    router_mac: [
                        {required: true, message: '请输入指定MAC', trigger: 'blur'},
                        {validator: this.validateMac, trigger: 'blur'}
                    ],
                    dev_type: [
                        {required: true, message: '请选择设备型号', trigger: 'change'}
                    ],
                    dest_version: [
                        {required: true, message: '请选择ROM版本', trigger: 'change'}
                    ],
                    upgrade_mode: [
                        {required: true, message: '请选择升级方式', trigger: 'change'}
                    ],
                    reflash:[
                        { required: true, message: '请选择配置更新', trigger: 'change'}
                    ],
                    expired_time: [
                        {required: true, message: '请输入超时时间', trigger: 'blur'}
                    ],
                    operator_name: [
                        {required: true, message: '请输入操作人', trigger: 'blur'}
                    ]

                },

                form1: {
                    route_mac: '',
                    pkg_str_name: '',
                    pkg_version: '',
                    logo: ''
                },
                pluginListData:[],
                pVerlist:[],
                rules1: {
                    route_mac: [
                        {required: true, message: '请输入MAC', trigger: 'blur'},
                        {validator: this.validateMac, trigger: 'blur'}
                    ],
                    pkg_str_name: [
                        {required: true, message: '请选择要安装的插件', trigger: 'change'}
                    ],
                    pkg_version: [
                        {required: true, message: '请选择插件的版本', trigger: 'change'}
                    ]
                },

                form2: {
                    mac: '',
                    plug: '',
                    version: '',
                    name: ''
                },
                rules2: {
                    mac: [
                        {required: true, message: '请输入MAC', trigger: 'blur'},
                        {validator: this.validateMac, trigger: 'blur'}
                    ],
                    plug: [
                        {required: true, message: '请选择要安装的脚本', trigger: 'change'}
                    ],
                    version: [
                        {required: true, message: '请选择脚本的版本', trigger: 'change'}
                    ]
                },
                pluginList: [
                    {
                        value: 'apbridge',
                        label: 'apbridge'
                    }, {
                        value: 'apfree_wifidog',
                        label: 'apfree_wifidog'
                    }, {
                        value: 'frpc',
                        label: 'frpc'
                    }, {
                        value: 'cloudPlugin',
                        label: 'cloudPlugin'
                    }, {
                        value: 'apbridge',
                        label: 'apbridge'
                    }, {
                        value: 'apmodectl',
                        label: 'apmodectl'
                    }, {
                        value: 'kt-base-files',
                        label: 'kt-base-files'
                    }, {
                        value: 'apbridge',
                        label: 'apbridge'
                    }, {
                        value: 'jsInjector',
                        label: 'jsInjector'
                    }, {
                        value: 'apbridge',
                        label: 'apbridge'
                    }
                ],
                task_type: '1',
                value: '',

                datatest: [
                    {
                        "id": "0DE",
                        "name": "福州和誉至尚贸易有限公司",
                        "models": [
                            {
                                "name": "9525"
                            },
                            {
                                "name": "zc9525",
                                "roms": [
                                    {
                                        "id": 266,
                                        "name": "2.01.2071",
                                        "file": "http://cloud.kunteng.org/super/firmware/5bf176d2-7355-4c30-8d9e-6b5054130cf7/20170116-4b2bf0d73a-2.01.2071-kunteng-ramips-mt7620-jpm9525-squashfs-sysupgrade.bin",
                                        "md5": "5607b744494070d46118557c04ba04fa  20170116-4b2bf0d73a-2.01.2071-kunteng-ramips-mt7620-jpm9525-squashfs-sysupgrade.bin",
                                        "oem": "jpm9525"
                                    }, {
                                        "id": 277,
                                        "name": "2.03.2273",
                                        "file": "http://cloud.kunteng.org/super/firmware/e713fe7c-efc9-4ff4-b19c-08a4d76af1d7/20170330-691acd05a4-2.03.2273-kunteng-ramips-mt7620-zc9525-squashfs-sysupgrade.bin",
                                        "md5": "24d9e28ba078e8bf04a960b3a6255859  20170330-691acd05a4-2.03.2273-kunteng-ramips-mt7620-zc9525-squashfs-sysupgrade.bin",
                                        "oem": "kunteng"
                                    }, {
                                        "id": 279,
                                        "name": "2.04.2273",
                                        "file": "http://cloud.kunteng.org/super/firmware/22be49d8-5cb6-4808-8743-bf764b8d982c/20170401-691acd05a4-2.04.2273-kunteng-ramips-mt7620-jpm9525-squashfs-sysupgrade.bin",
                                        "md5": "a7966582c09683c94f6d92b42f7dfc34  20170401-691acd05a4-2.04.2273-kunteng-ramips-mt7620-jpm9525-squashfs-sysupgrade.bin",
                                        "oem": "jpm9525"
                                    }, {
                                        "id": 280,
                                        "name": "2.01.2039",
                                        "file": "http://cloud.kunteng.org/super/firmware/adbb61d0-6fed-4f45-b4b1-e3d9d8ac91cc/20170105-8d5e0f41ec-2.01.2039-kunteng-ramips-mt7620-zc9525-squashfs-sysupgrade.bin",
                                        "md5": "7f7de581f3a7da58f644b4270c19e846  20170105-8d5e0f41ec-2.01.2039-kunteng-ramips-mt7620-zc9525-squashfs-sysupgrade.bin",
                                        "oem": "kunteng"
                                    }, {
                                        "id": 288,
                                        "name": "2.22.2222",
                                        "file": "http://cloud.kunteng.org/super/firmware/8b966489-034d-4c07-ac60-f0f936c8ac18/20170330-691acd05a4-2.22.2222-kunteng-ramips-mt7620-zc9525-squashfs-sysupgrade.bin",
                                        "md5": "b5ac0dec0f8438e0adb2daf79ee85a02  20170330-691acd05a4-2.22.2222-kunteng-ramips-mt7620-zc9525-squashfs-sysupgrade.bin",
                                        "oem": "kunteng"
                                    }, {
                                        "id": 301,
                                        "name": "2.07.2434",
                                        "file": "http://cloud.kunteng.org/super/firmware/af272ede-fd11-4411-b776-19fbd65881b5/20170711-c0db03e576-2.07.2434-kunteng-ramips-mt7620-zc9525-squashfs-sysupgrade.bin",
                                        "md5": "d514442e09d9eb41390477b085d6b877  20170711-c0db03e576-2.07.2434-kunteng-ramips-mt7620-zc9525-squashfs-sysupgrade.bin",
                                        "oem": "kunteng"
                                    }, {
                                        "id": 304,
                                        "name": "2.07.2444",
                                        "file": "http://cloud.kunteng.org/super/firmware/4e8ff414-8ce3-45e4-a7ba-12442afb4a56/20170731-0a9e61ceeb-2.07.2444-kunteng-ramips-mt7620-ld9525-squashfs-sysupgrade.bin",
                                        "md5": "4d9a0af79188d8b8fcd9bba9796d59ca  20170731-0a9e61ceeb-2.07.2444-kunteng-ramips-mt7620-ld9525-squashfs-sysupgrade.bin",
                                        "oem": "ld9525"
                                    }, {
                                        "id": 314,
                                        "name": "2.08.2454",
                                        "file": "http://cloud.kunteng.org/super/firmware/8df8b7e2-4c03-4cdc-8ad5-9d018a8edbf4/20170809-3b722cf087-2.08.2454-kunteng-ramips-mt7620-ld9525-squashfs-sysupgrade.bin",
                                        "md5": "358175334c1e30c75f7af82c5c4db748  20170809-3b722cf087-2.08.2454-kunteng-ramips-mt7620-ld9525-squashfs-sysupgrade.bin",
                                        "oem": "ld9525"
                                    }, {
                                        "id": 338,
                                        "name": "2.08.2446",
                                        "file": "http://cloud.kunteng.org/super/firmware/04f3ed7f-a3dd-4f77-baf5-066d919f71ee/20170803-0d509b5b34-2.08.2446-kunteng-ramips-mt7620-zc9525-squashfs-sysupgrade.bin",
                                        "md5": "41d3dce8c2bf61017d19284729fea85c  20170803-0d509b5b34-2.08.2446-kunteng-ramips-mt7620-zc9525-squashfs-sysupgrade.bin",
                                        "oem": "kunteng"
                                    }
                                ]
                            },
                            {
                                "name": "zc9526",
                                "roms": [
                                    {
                                        "id": 282,
                                        "name": "2.04.2273",
                                        "file": "http://cloud.kunteng.org/super/firmware/9afa1b24-7c24-4540-8eac-b157319298eb/20170401-691acd05a4-2.04.2273-kunteng-ramips-mt7620-jpm9526-squashfs-sysupgrade.bin",
                                        "md5": "93ad345fe975d38d70e1526e2b8244e4  20170401-691acd05a4-2.04.2273-kunteng-ramips-mt7620-jpm9526-squashfs-sysupgrade.bin",
                                        "oem": "jpm9526"
                                    }, {
                                        "id": 286,
                                        "name": "2.03.2273",
                                        "file": "http://cloud.kunteng.org/super/firmware/4ab005be-9ac8-43d4-bfb0-c592d110b83a/20170330-691acd05a4-2.03.2273-kunteng-ramips-mt7620-zc9526-squashfs-sysupgrade.bin",
                                        "md5": "ec6b98e9ea18ae447e2d8da9b9b4e789  20170330-691acd05a4-2.03.2273-kunteng-ramips-mt7620-zc9526-squashfs-sysupgrade.bin",
                                        "oem": "kunteng"
                                    }, {
                                        "id": 300,
                                        "name": "2.07.2434",
                                        "file": "http://cloud.kunteng.org/super/firmware/299e0e99-aa61-47f8-9f5c-c8a2ab7cdd16/20170711-c0db03e576-2.07.2434-kunteng-ramips-mt7620-zc9526-squashfs-sysupgrade.bin",
                                        "md5": "edea21614d023f8e8bff341ebb6360b3  20170711-c0db03e576-2.07.2434-kunteng-ramips-mt7620-zc9526-squashfs-sysupgrade.bin",
                                        "oem": "kunteng"
                                    }, {
                                        "id": 322,
                                        "name": "2.09.2485",
                                        "file": "http://cloud.kunteng.org/super/firmware/5559bf79-803f-4d4e-81b2-5a47e397b717/20170906-41fe538c61-2.09.2485-kunteng-ramips-mt7620-zc9526-squashfs-sysupgrade.bin",
                                        "md5": "19326b6fc0cd889a3cb3cf43af2af2fd  20170906-41fe538c61-2.09.2485-kunteng-ramips-mt7620-zc9526-squashfs-sysupgrade.bin",
                                        "oem": "kunteng"
                                    }, {
                                        "id": 327,
                                        "name": "2.08.2446",
                                        "file": "http://cloud.kunteng.org/super/firmware/64c3bf0d-5e2e-4855-bba3-bc46143263e4/20170803-0d509b5b34-2.08.2446-kunteng-ramips-mt7620-zc9526-squashfs-sysupgrade.bin",
                                        "md5": "6b8a23dedd852b39e61e0069c80b9e98  20170803-0d509b5b34-2.08.2446-kunteng-ramips-mt7620-zc9526-squashfs-sysupgrade.bin",
                                        "oem": "kunteng"
                                    }, {
                                        "id": 337,
                                        "name": "2.11.2510",
                                        "file": "http://cloud.kunteng.org/super/firmware/ecc70541-dc1c-4497-95cb-a6fc2717726f/20171108-8b806a68a5-2.11.2510-kunteng-ramips-mt7620-zc9526-squashfs-sysupgrade.bin",
                                        "md5": "5a0cb61de94974d3de059ec72fd89671  20171108-8b806a68a5-2.11.2510-kunteng-ramips-mt7620-zc9526-squashfs-sysupgrade.bin",
                                        "oem": "kunteng"
                                    }, {
                                        "id": 342,
                                        "name": "2.12.2557",
                                        "file": "http://cloud.kunteng.org/super/firmware/27221f94-5cdc-4f2d-a972-afe2eda7f4ec/20171206-454600db8a-2.12.2557-kunteng-ramips-mt7620-zc9526-squashfs-sysupgrade.bin",
                                        "md5": "d6927c3103da8d510022f815dc168be3  20171206-454600db8a-2.12.2557-kunteng-ramips-mt7620-zc9526-squashfs-sysupgrade.bin",
                                        "oem": "kunteng"
                                    }
                                ]
                            }
                        ]
                    }
                ],
                romtest:[],
                filetest:'',
                fullscreenLoading: false,
            }
        },
        created:function () {
            this.getTypes();
            this.getRomList();
        },
        methods: {
            onRomSubmit:function (formName) {
                var self = this;
                self.$refs[formName].validate(function (valid) {
                    if (valid) {
                        var params = {
                            route_mac:self.form0.router_mac,
                            operator_name:self.form0.operator_name,
                            dev_type:self.form0.dev_type,
                            dest_version:self.form0.dest_version,
                            firmware_file:self.form0.firmware_file,
                            firmware_md5:self.form0.firmware_md5,
                            upgrade_mode:self.form0.upgrade_mode,
                            reflash:self.form0.reflash,
                            expired_time:self.form0.expired_time
                        };
                        self.fullscreenLoading = true;
                        self.$axios.post(global_.baseUrl + '/task/add/sysupgrade',params).then(function (res) {
                            // console.log(res.data);
                            self.fullscreenLoading = false;
                            if(res.data.ret_code == '1001'){
                                self.$message({message:res.data.extra,type:'warning'});
                                setTimeout(function(){
                                    self.$router.replace('login');
                                },2000)
                            }
                            if(res.data.ret_code == 0){
                                self.$message({message:'推送成功',type:'success'});
                            }else{
                                self.$message.error(res.data.extra);
                            }
                        })

                    } else {
                        return false;
                        console.log('验证失败');
                    }
                });

            },
            getTypes: function(){//获取设备型号
                var self = this;
                self.$axios.post(global_.baseUrl+'/devtype/types').then(function(res){
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.typeListData = res.data.extra;
                    }
                })
            },
            getRomList: function(){//获取rom版本
                var self = this;
                self.$axios.post(global_.baseUrl+'/rom/list').then(function(res){
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.ListData = res.data.extra;
                    }
                })
            },
            getSysinfo: function () {
                var self = this;
                var params = {
                    user_name:localStorage.getItem('ms_username'),
                    router_mac: self.splitStr(self.form0.router_mac).join(','),
                    task_type:self.task_type,
                    upgrade_type:self.form0.upgrade_type,
                    expired_time:self.form0.expired_time,
                    firmware_url: self.filetest
                };
                self.$axios({
                    method: 'get',
                    headers: {'Content-Type': 'application/json'},
                    url: global_.baseUrl + '/device/sysinfo'
                }).then(function (response) {
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    console.log(response);
                }, function (err) {
                    console.log(err);
                });
            },
            changeDev: function(){
                var self = this;
                self.form0.dest_version = '';
                self.form0.firmware_file = '';
                self.form0.firmware_md5 = '';
                var curdevnum = self.form0.dev_type;
                var resultArr = [];
                var list = self.ListData;
                for(var i=0;i<list.length;i++){
                    if(list[i].dev_type == curdevnum){
                        resultArr.push(list[i])
                    }
                }
                self.romListData = resultArr;
                if(resultArr.length){
                    self.form0.dest_version = resultArr[0].rom_version || '';
                    self.form0.firmware_file = resultArr[0].file_name || '';
                    self.form0.firmware_md5 = resultArr[0].md5_value || '';
                }

            },
            changeRom: function(){
                var self = this;
                var curromv = self.form0.dest_version;
                var resultArr = [];
                var list = self.ListData;
                for(var i=0;i<list.length;i++){
                    if(list[i].dev_type == self.form0.dev_type && list[i].rom_version == curromv){
                        self.form0.firmware_file = list[i].file_name;
                        self.form0.firmware_md5 = list[i].md5_value
                    }
                }

            },
            changeUpgrade: function(value){
                if(value == '1'){
                    this.form0.expired_time = '0';
                    this.form0.isTime =  true;
                }else{
                    this.form0.expired_time = '';
                    this.form0.isTime =  false;
                }
            },
            handleClick:function (tab,event) {
                var self = this;
                // console.log(tab,event);
                if(tab.name == '2'){
                    self.getPkgData({});
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
            onPluginSubmit: function (formName) {
                var self = this;
                self.$refs[formName].validate(function (valid) {
                    if (valid) {
                        var params = {
                            route_mac:self.form1.route_mac,
                            pkg_str_name: self.form1.pkg_str_name,
                            pkg_version:self.form1.pkg_version,
                            logo:self.form1.logo
                        };
                        self.fullscreenLoading = true;
                        self.$axios.post(global_.baseUrl + '/manage/apps',params).then(function (res) {
                            self.fullscreenLoading = false;
                            if(res.data.ret_code == '1001'){
                                self.$message({message:res.data.extra,type:'warning'});
                                setTimeout(function(){
                                    self.$router.replace('login');
                                },2000)
                            }
                            if(res.data.ret_code == 0){
                                self.$message({message:res.data.extra,type:'success'});
                            }else{
                                self.$message.error(res.data.extra)
                            }
                        })

                    } else {
                        return false;
                        console.log('验证失败');
                    }
                });

            },
            onJavaSubmit: function () {

            },
            getPkgData: function(){//获取插件列表
                var self = this;
                self.$axios.post(global_.baseUrl+'/pkg/list').then(function(res){
                    if(res.data.ret_code == '1001'){
                        self.$message({message:res.data.extra,type:'warning'});
                        setTimeout(function(){
                            self.$router.replace('login');
                        },2000)
                    }
                    if(res.data.ret_code == 0){
                        self.pluginListData = res.data.data;
                    }
                })
            },
            changePlugin: function(){
                var self = this;
                var curplugin = self.form1.pkg_str_name;
                var resultArr = [];
                var list = self.pluginListData;
                for(var i=0;i<list.length;i++){
                    if(list[i].pkg_str_name == self.form1.pkg_str_name){
                        resultArr.push(list[i]);
                    }
                }
                self.pVerlist = resultArr;
                if(resultArr.length){
                    self.form1.pkg_version = resultArr[0].pkg_version || '';
                }
            },
        }
    }
</script>
<style>
    .mb40 {margin-bottom: 40px;}
    .tab-cont {padding: 40px; /*border-top:1px solid #dfe6ec;*/}
    .diainp{width:217px;}
    .diainp2{width:450px;}
    .inp100{width:100px;}
    /*.textarea-mac{height:160px;}*/
</style>
