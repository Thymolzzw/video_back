<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="活动" name="activity" style="height: 100vh; overflow: scroll">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="收藏" name="timeline" style="height: 100vh; overflow: scroll">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="操作记录" name="timeline2" style="height: 100vh; overflow: scroll">
                <timeline2 />
              </el-tab-pane>
              <el-tab-pane label="账户信息" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Timeline2 from './components/Timeline2'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { UserCard, Activity, Timeline2, Timeline, Account },
  data() {
    return {
      user: {},
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'user_info'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar,
        user_info: this.user_info,
      }
    }
  }
}
</script>
