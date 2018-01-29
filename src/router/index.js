import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/readme',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    component: resolve => require(['../components/page/Readme.vue'], resolve)
                },
                {
                    path: '/basetable',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve)
                },
                {
                    path: '/setpush',
                        component: resolve => require(['../components/page/SetPush.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/pushresult',
                        component: resolve => require(['../components/page/PushResult.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/pushresultdetail',
                        component: resolve => require(['../components/page/PushResultDetail.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/updateromstatus',
                        component: resolve => require(['../components/page/UpdateRomStatus.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/devstatus',
                        component: resolve => require(['../components/page/DevStatus.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/rommanage',
                        component: resolve => require(['../components/page/RomManage.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/pluginmanage',
                        component: resolve => require(['../components/page/PluginManage.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/task/manage',
                    component: resolve => require(['../components/page/TaskManage.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/riskctrl/manage',
                    component: resolve => require(['../components/page/RiskManage.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/strategy/manage',
                    component: resolve => require(['../components/page/StrategyManage.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/scriptmanage',
                        component: resolve => require(['../components/page/ScriptManage.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/modelmanage',
                        component: resolve => require(['../components/page/ModelManage.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/basecharts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve)   // vue-schart组件
                },
                {
                    path: '/sysinfo',
                    component: resolve => require(['../components/page/Sysinfo.vue'], resolve)   // vue-schart组件
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/register',
                component: resolve => require(['../components/page/Register.vue'], resolve)
        },
    ]
})
