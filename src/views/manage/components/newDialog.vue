<template>
  <el-dialog title="添加模板" :visible="visible" @close="handleCancel">
    <el-form :model="data" ref="data" :rules="uploadRules" label-width="80px">
      <el-form-item label="账号" prop="account">
        <el-input v-model="data.account" ref="account"></el-input>
      </el-form-item>

      <el-form-item label="编号" prop="uuid">
        <el-input v-model="data.uuid" ref="uuid"></el-input>
      </el-form-item>

      <el-form-item label="IP" prop="ip">
        <el-input v-model="data.ip" ref="ip"></el-input>
      </el-form-item>

      <el-form-item label="姓名" prop="name">
        <el-input v-model="data.name" ref="name"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="data.password" ref="password"></el-input>
      </el-form-item>


        <el-form-item label="单位">
          <OriginzationSelect v-model="data.organization_id" placeholder="请输入管理员姓名"></OriginzationSelect>
        </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { isEmpty } from "@/utils/validate";
// import commonNewDialog from "@/mixins/new_dialog";
// import { queryOrganizations } from "@/api/organization";
// import OriginzationSelect from '@/views/components/OriginzationSelect'

export default {
  // mixins: [commonNewDialog],
  // components: {OriginzationSelect},
  data() {
    return {
      data: {
        uuid: "",
        account: "",
        password: "123456", //用户默认密码：123456
        role: "user",
        ip: "0.0.0.0",
        name: "",
        organization_id: undefined
      },
      uploadRules: {
        uuid: [{ required: true, trigger: "blur", message: "编号 不能为空" }],
        account: [
          { required: true, trigger: "blur", message: "账号 不能为空" }
        ],
        ip: [{ required: true, trigger: "blur", message: "ip 不能为空 若不知可默认为0.0.0.0" }],
        name: [{ required: true, trigger: "blur", message: "姓名 不能为空" }],
        organization_id: [
          { required: true, trigger: "blur", message: "组织 不能为空" }
        ]
      },

      organizations: [] //部门列表
    };
  },
  methods: {
    //获取部门信息
    // setOrganizations() {
    //   queryOrganizations({}).then(res => {
    //     this.organizations = res.data.organizations;
    //   });
    // },
    //
    // handleSubmit() {
    //   this.$refs.data.validate(valid => {
    //     if (valid) {
    //       this.$emit("onOK", this.data);
    //     }
    //   });
    // }
  },
  mounted() {
    this.setOrganizations();
    window.vue = this;
  }
};
</script>
