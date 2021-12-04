<template>
  <v-card>

    <v-toolbar flat>
      <v-toolbar-title>Groups</v-toolbar-title>
      <v-spacer/>

      <v-btn
        :to="{name: 'create_group'}" >
        <v-icon>mdi-account-multiple-plus</v-icon>
        <span class="ml-2">Create group</span>
      </v-btn>

    </v-toolbar>
    <v-divider/>

    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="groups"
        @click:row="$router.push({name: 'group', params: {group_id: $event._id}})">
      </v-data-table>
    </v-card-text>





  </v-card>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Groups',

  data(){
    return {
      groups: [],
      headers: [
        {text: 'Name', value: 'name' },
      ]
    }
  },
  mounted(){
    this.get_groups()
  },
  methods: {
    get_groups(){
      // Getting top level groups
      const url = `${process.env.VUE_APP_GROUP_MANAGER_API_URL}/groups`
      const params = {top: true}
      this.axios.get(url, {params})
      .then(({data}) => { this.groups = data })
      .catch(error => { console.error(error) })
    },
    row_clicked(event){
      console.log(event)
    }
  }
}
</script>
