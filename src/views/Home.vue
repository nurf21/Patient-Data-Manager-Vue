<template>
  <b-container fluid>
    <b-row>
      <b-col cols="12" class="header">
        <Header/>
      </b-col>

      <b-col cols="12" class="content">
        <Table/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Header from '@/components/Header'
import Table from '@/components/Table'

export default {
  name: 'Home',
  components: {
    Header,
    Table
  }
}
</script>

<style scoped src="@/assets/css/style.css"></style>
