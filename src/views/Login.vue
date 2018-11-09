<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
  import { requestLogin } from '../api/api';
  //全局正则定义
  const nameReg = /^[A-Za-z][A-Za-z1-9_-]{4,17}$/;
  const pwdReg = /^[a-zA-Z0-9_.@~!?]{7,17}$/;
  //import NProgress from 'nprogress'
  export default {
    data() {
    	let validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'));
        } else {
	      	if(!nameReg.test(value)) {
	      		callback(new Error('名称要求5到18位字符由字母、数字、下划线及中划线组合。'));
	      	}
          callback();
        }
      };
      let validatePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
	      	if(!pwdReg.test(value)) {
	      		callback(new Error('密码要求8到18位字符由字母、数字及英文符号组合。'));
	      	}
          callback();
        }
      };
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
        	//input校验，失去焦点的验证
          account: [
            { validator: validateName, trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { validator: validatePwd, trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    // computed property for form validation state
	  computed: {
	    validation: function () {
	      return {
	        name: nameReg.test(ruleForm2.account),
	        email: pwdReg.test(ruleForm2.checkPass)
	      }
	    },
	    isValid: function () {
	      var validation = this.validation
	      return Object.keys(validation).every(function (key) {
	        return validation[key]
	      })
	    }
	  },

    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleBlur(event) {
		    this.$emit('blur', event);  // 触发 blur 事件
		    console.log("aa")
//		    if(isValid())
//		    this.dispatch('ElFormItem', 'el.form.blur', [this.currentValue]);  // 向父组件派发 el.form.blur 事件
		  },

      handleSubmit2(ev) {
        var _this = this;
        //表单验证
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
            
            //客户端方式，方便演示
            this.logining = false;
            //模拟用户
            let user = {
            	"avatar": "https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png",
							"id": 1,
							"name": "wsladmin",
							"password": undefined,
							"username": "admin"
            }
            sessionStorage.setItem('user', JSON.stringify(user));
            this.$router.push({ path: '/main' });
            //请求方式暂时屏蔽
//          requestLogin(loginParams).then(data => {
//            this.logining = false;
//            //NProgress.done();
//            let { msg, code, user } = data;
//            if (code !== 200) {
//              this.$message({
//                message: msg,
//                type: 'error'
//              });
//            } else {
//              sessionStorage.setItem('user', JSON.stringify(user));
//              this.$router.push({ path: '/table' });
//            }
//          });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 100px auto !important;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>