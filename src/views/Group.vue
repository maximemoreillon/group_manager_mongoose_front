<template>

  <v-card>

    <v-toolbar flat>
      <v-btn
        exact
        icon
        :to="{name: 'groups'}" >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title v-if="group">{{group.name}}</v-toolbar-title>
      <v-toolbar-title v-else>Group</v-toolbar-title>
      <v-spacer />
      <v-btn
        class="mx-2"
        @click="update_user()">
        <v-icon>mdi-content-save</v-icon>
        <span>Save</span>
      </v-btn>

      <v-btn
        class="mx-2"
        @click="delete_group()"
        color="#c00000"
        dark>
        <v-icon>mdi-delete</v-icon>
        <span>Delete</span>
      </v-btn>



    </v-toolbar>
    <v-divider/>


    <template v-if="group">

      <v-card-text>
        <v-row>
          <v-col>
            <v-img
              src="@/assets/logo.png"
              contain
              height="15em"/>
          </v-col>
          <v-col>
            <v-list two-line>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle>ID</v-list-item-subtitle>
                  <v-list-item-title>{{group._id}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle>Creation date</v-list-item-subtitle>
                  <v-list-item-title>{{group.creation_date}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-if="group.parent"
                :to="{name: 'group', params: {group_id: (group.parent._id || group.parent)}}">
                <v-list-item-content>
                  <v-list-item-subtitle>Parent</v-list-item-subtitle>
                  <v-list-item-title v-if="group.parent.name">{{group.parent.name}}</v-list-item-title>
                  <v-list-item-title v-else>{{group.parent}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>

          </v-col>
        </v-row>

      </v-card-text>

      <v-card-text>

        <v-data-table
          :items="group.members"
          :headers="members_table_headers">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>members</v-toolbar-title>
              <v-spacer/>
              <v-btn
                class="mx-2"
                dark>
                <v-icon>mdi-account-plus</v-icon>
                <span>Add users</span>
              </v-btn>
            </v-toolbar>
            <v-divider/>
          </template>
        </v-data-table>

      </v-card-text>

      <v-card-text>

        <v-data-table
          :items="group.subgroups"
          :headers="subgroups_table_headers"
          @click:row="$router.push({name: 'group', params: {group_id: $event._id}})">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Subgroups</v-toolbar-title>
              <v-spacer/>
              <v-btn
                class="mx-2"
                :to="{name: 'create_group', query: {parent: group_id}}"
                dark>
                <v-icon>mdi-account-multiple-plus</v-icon>
                <span>Create subgroup</span>
              </v-btn>
            </v-toolbar>
            <v-divider/>
          </template>
        </v-data-table>

      </v-card-text>


    </template>

  </v-card>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {

  },
  data(){
    return {
      group: null,
      members_table_headers: [
        {text: 'ID', value: 'user_id'},
        {text: 'Username', value: 'username'},
        {text: 'Admin', value: 'admin'}
      ],
      subgroups_table_headers: [
        {text: 'ID', value: '_id'},
      ]
    }
  },
  mounted(){
    this.get_group()
  },
  watch:{
    group_id(){
      this.get_group()
    }
  },
  methods: {
    get_group(){
      this.group = null
      this.loading = true
      const url = `${process.env.VUE_APP_GROUP_MANAGER_API_URL}/groups/${this.group_id}`
      this.axios.get(url)
      .then( ({data}) => {
        this.group = data
        this.get_subgroups()
        this.get_members_info()
        this.get_parent()
      })
      .catch( error => {
        console.error(error)
      })
      .finally(() => {
        this.loading = false
      })
    },
    get_members_info(){
      const url = `${process.env.VUE_APP_USER_MANAGER_API_URL}/users/`
      const ids = this.group.members.map(m => m.user_id)
      const params = {ids}
      this.axios.get(url,{params})
      .then( ({data}) => {
        data.forEach( (user, index) => {
          const new_user_properties = { ...user, ...this.group.members[index]   }
          this.$set(this.group.members, index, new_user_properties)
        })

      })
      .catch( error => {
        console.error(error)
      })
    },
    get_subgroups(){
      const url = `${process.env.VUE_APP_GROUP_MANAGER_API_URL}/groups/${this.group_id}/subgroups`
      this.axios.get(url)
      .then( ({data}) => {
        this.$set(this.group,'subgroups',data)
      })
      .catch( error => {
        console.error(error)
      })
    },
    get_parent(){
      if(!this.group.parent) return
      const url = `${process.env.VUE_APP_GROUP_MANAGER_API_URL}/groups/${this.group.parent}`
      this.axios.get(url)
      .then( ({data}) => {
        this.$set(this.group,'parent',data)
      })
      .catch( error => {
        console.error(error)
      })
    },
    delete_group(){
      if(!confirm(`Delete group ${this.group.name}?`)) return
      const url = `${process.env.VUE_APP_GROUP_MANAGER_API_URL}/groups/${this.group_id}`
      this.axios.delete(url)
      .then( () => {
        this.$router.push({name: 'groups'})
      })
      .catch( error => {
        console.error(error)
      })
    }
  },
  computed: {
    group_id(){
      return this.$route.params.group_id
    }
  }
}
</script>
